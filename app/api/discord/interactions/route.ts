import { NextRequest, NextResponse } from 'next/server';
import {
  InteractionType,
  InteractionResponseType,
  ComponentType,
  APIInteraction,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponsePong,
  APIMessageComponentInteraction,
  MessageFlags,
  APIInteractionResponseDeferredChannelMessageWithSource,
  APIEmbed,
} from 'discord-api-types/v10';
import { verifyDiscordRequest } from '@/utils/discord_verify'; // Assuming @ is configured for src or utils
import { BasePayload, getPayload } from 'payload';
import configPromise from '@payload-config'; // Ensure this path is correct
import nacl from 'tweetnacl';
import { getCustomPayload } from '@/lib/payload/getCustomPayload';

// Helper function to make fetch calls with a timeout
async function fetchWithTimeout(resource: RequestInfo, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = 8000 } = options; // Default timeout 8 seconds

  const controller = new AbortController();
  const id = setTimeout(() => {
    console.warn(`[FETCH_TIMEOUT] Request to ${typeof resource === 'string' ? resource : 'URL object'} timed out after ${timeout}ms`);
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error(`[FETCH_ABORTED] Request to ${typeof resource === 'string' ? resource : 'URL object'} was aborted due to timeout.`);
    }
    throw error; // Re-throw error to be caught by calling function
  }
}

// Helper function to get raw body for Next.js Edge/Serverless functions
async function getRawBodyFromRequest(req: NextRequest): Promise<string> {
  const reader = req.body?.getReader();
  if (!reader) {
    return '';
  }
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return new TextDecoder().decode(new Uint8Array(chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), [] as number[])));
}

// Helper function to send follow-up messages
async function sendFollowUp(interaction: APIInteraction, content: string) {
  const followupUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`;
  try {
    const res = await fetchWithTimeout(followupUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
      timeout: 5000,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error(`[INTERACTION_HANDLER] Error sending follow-up. Status: ${res.status}`, errorData);
    }
  } catch (e) {
    console.error('[INTERACTION_HANDLER] Exception during sendFollowUp fetch:', e);
  }
}

async function handleInteractionLogic(interaction: APIInteraction, req: NextRequest) {
  const {
    type,
    data,
    member,
    id: interactionId,
    token: interactionToken,
    message: originalMessage,
    channel_id: channelId,
    application_id: applicationId
  } = interaction;

  // Ensure data and member exist for MessageComponent interactions
  if (!data || !('custom_id' in data) || !member || !applicationId || !interactionToken) {
    console.error('Interaction data, member, applicationId or interactionToken is undefined for MessageComponent');
    // Attempt to send an ephemeral error message if possible, but only if we have token & app id
    if (applicationId && interactionToken) {
      await sendEphemeralFollowup(applicationId, interactionToken, 'Error: Interaction data is malformed.');
    }
    return;
  }

  const customId = data.custom_id;
  const adminRoles = member.roles;
  const adminUser = member.user;

  const requiredAdminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;
  if (!requiredAdminRoleId) {
    console.error('DISCORD_ADMIN_ROLE_ID is not set.');
    await sendEphemeralFollowup(applicationId, interactionToken, 'Error: Server configuration issue (admin role ID missing).');
    return;
  }

  if (!adminRoles.includes(requiredAdminRoleId)) {
    await sendEphemeralFollowup(applicationId, interactionToken, 'Error: You do not have permission to perform this action.');
    return;
  }

  const parts = customId.split('_');
  if (parts.length < 3) {
    console.error(`Invalid custom_id format: ${customId}`);
    await sendEphemeralFollowup(applicationId, interactionToken, 'Error: Invalid action command.');
    return;
  }
  const actionType = parts[0]; // 'approve' or 'reject'
  const entityType = parts[1]; // 'staff'
  const userId = parts[2];

  if (entityType !== 'staff' || !userId || (actionType !== 'approve' && actionType !== 'reject')) {
    console.error(`Invalid action parameters: ${actionType}, ${entityType}, ${userId}`);
    await sendEphemeralFollowup(applicationId, interactionToken, 'Error: Invalid action parameters.');
    return;
  }

  const internalApiSecret = process.env.DISCORD_INTERNAL_API_SECRET;
  if (!internalApiSecret) {
    console.error('DISCORD_INTERNAL_API_SECRET is not set.');
    await sendEphemeralFollowup(applicationId, interactionToken, 'Error: Server configuration issue (internal API secret missing).');
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '');
  if (!appUrl) {
    console.error('NEXT_PUBLIC_APP_URL is not set.');
    await sendEphemeralFollowup(applicationId, interactionToken, 'Error: Server configuration issue (app URL missing).');
    return;
  }

  const apiUrl = `${appUrl}/api/staff/approval/${actionType}/${userId}`;

  try {
    console.log(`[INTERACTION_LOGIC] Attempting to get Payload instance for user ${userId}, action ${actionType}`);
    let payload: BasePayload;
    try {
      payload = await getCustomPayload();
      console.log(`[INTERACTION_LOGIC] Successfully got Payload instance for user ${userId}`);
    } catch (e: any) {
      console.error(`[INTERACTION_LOGIC] CRITICAL: Failed to get Payload instance for user ${userId}:`, e);
      await sendEphemeralFollowup(applicationId, interactionToken, `Error: Server critical issue (Payload init failed). Please contact support.`);
      return;
    }

    console.log(`[INTERACTION_LOGIC] Attempting to find staff user ${userId}`);
    let staffUser;
    try {
      staffUser = await payload.findByID({
        collection: 'staffs',
        id: userId,
        depth: 0,
        req
      });
      console.log(`[INTERACTION_LOGIC] Successfully queried for staff user ${userId}. Found: ${!!staffUser}`);
    } catch (e: any) {
      console.error(`[INTERACTION_LOGIC] CRITICAL: Failed to query staff user ${userId}:`, e);
      await sendEphemeralFollowup(applicationId, interactionToken, `Error: Server critical issue (DB query failed). Please contact support.`);
      return;
    }

    if (!staffUser) {
      await sendEphemeralFollowup(applicationId, interactionToken, `Error: Staff user with ID ${userId} not found.`);
      return;
    }
    const userEmailForMessage = staffUser.email || `User ID ${userId}`;

    const apiResponse = await fetchWithTimeout(apiUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${internalApiSecret}`,
        'Content-Type': 'application/json',
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      console.error(`Failed to ${actionType} staff ${userId}: ${apiResponse.status} - ${errorData}`);
      await sendEphemeralFollowup(applicationId, interactionToken, `Error: Failed to ${actionType} ${userEmailForMessage}. API responded with ${apiResponse.status}.`);
      return;
    }

    const successMessage = actionType === 'approve'
      ? `✅ User ${userEmailForMessage} has been approved. They will be notified.`
      : `❌ User ${userEmailForMessage} has been rejected. They will be notified.`;
    await sendEphemeralFollowup(applicationId, interactionToken, successMessage);

    // If action was successful, update the original public message
    if (originalMessage && originalMessage.embeds && originalMessage.embeds.length > 0 && channelId && originalMessage.id) {
      const currentEmbed = originalMessage.embeds[0];
      const newEmbed: APIEmbed = {
        ...currentEmbed,
        title: `${currentEmbed.title || 'Staff Signup Request'} - ${actionType === 'approve' ? 'Approved' : 'Rejected'}`,
        color: actionType === 'approve' ? 0x00FF00 : 0xFF0000, // Green for approve, Red for reject
        fields: [
          ...(currentEmbed.fields || []).filter(field => field.name !== 'Status'), // Remove old status if any
          {
            name: 'Status',
            value: `${actionType === 'approve' ? 'Approved' : 'Rejected'} by ${adminUser?.username || 'Admin'}`,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      };

      const discordBotToken = process.env.DISCORD_BOT_TOKEN;
      if (discordBotToken) {
        const editMessageUrl = `https://discord.com/api/v10/channels/${channelId}/messages/${originalMessage.id}`;
        const editResponse = await fetchWithTimeout(editMessageUrl, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bot ${discordBotToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            embeds: [newEmbed],
            components: [], // Remove buttons
          }),
        });
        if (!editResponse.ok) {
          const errorBody = await editResponse.text();
          console.error(`Failed to edit original message ${originalMessage.id}: ${editResponse.status}`, errorBody);
        } else {
          console.log(`Successfully updated original message ${originalMessage.id} for user ${userId}`);
        }
      } else {
        console.error('Missing DISCORD_BOT_TOKEN for editing public message.');
      }
    }

  } catch (error) {
    console.error(`Error processing ${actionType} staff ${userId}:`, error);
    await sendEphemeralFollowup(applicationId, interactionToken, `An unexpected error occurred while processing the ${actionType} request for user ID ${userId}.`);
  }
}

async function sendEphemeralFollowup(applicationId: string, interactionToken: string, content: string) {
  const followupUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;
  try {
    const response = await fetchWithTimeout(followupUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
      timeout: 5000,
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error sending/editing ephemeral followup: ${response.status}`, errorBody);
    }
  } catch (fetchError) {
    console.error('Fetch error sending/editing ephemeral followup:', fetchError);
  }
}

export async function POST(request: NextRequest) {
  console.log('[INTERACTION_HANDLER] Received POST request');
  const rawBody = await getRawBodyFromRequest(request);
  console.log('[INTERACTION_HANDLER] Raw body extracted');

  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  console.log(`[INTERACTION_HANDLER] Signature: ${signature ? 'Present' : 'MISSING'}, Timestamp: ${timestamp ? 'Present' : 'MISSING'}`);

  const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;
  if (!DISCORD_PUBLIC_KEY) {
    console.error('[INTERACTION_HANDLER] FATAL: DISCORD_PUBLIC_KEY is not set.');
    return NextResponse.json({ error: 'Internal server configuration error (public key missing)' }, { status: 500 });
  }
  console.log('[INTERACTION_HANDLER] DISCORD_PUBLIC_KEY is present.');

  const isValid = nacl.sign.detached.verify(
    Buffer.from((timestamp || '') + rawBody),
    Buffer.from(signature || '', 'hex'),
    Buffer.from(DISCORD_PUBLIC_KEY, 'hex')
  );

  if (!isValid) {
    console.warn('[INTERACTION_HANDLER] Invalid Discord interaction signature. Raw Body:', rawBody, 'Timestamp:', timestamp, 'Signature:', signature);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  console.log('[INTERACTION_HANDLER] Interaction signature VALID.');

  const interaction = JSON.parse(rawBody) as APIInteraction;
  console.log(`[INTERACTION_HANDLER] Parsed interaction type: ${interaction.type}`);

  if (interaction.type === InteractionType.Ping) {
    console.log('Handling PING interaction');
    return NextResponse.json({ type: InteractionResponseType.Pong } as APIInteractionResponsePong);
  }

  if (interaction.type === InteractionType.MessageComponent) {
    console.log('Handling MessageComponent interaction:', interaction.data.custom_id);

    // Non-blocking call to handle the logic after returning the deferred response
    // Vercel might require awaiting this, or using a background task solution if available and needed.
    // For now, we'll await it to ensure completion in typical serverless function lifecycles.
    // However, this means the DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE isn't truly "fire and forget"
    // for the client if the entire handleInteractionLogic is awaited before this response.
    // The `handleInteractionLogic` will itself send the followup.
    // The primary response from THIS function must be the DEFERRED type.

    // Fire and forget (Node.js specific, might not work reliably in all serverless environments without specific configurations)
    // For Vercel, it's often better to await promises to ensure they complete.
    // Let's make handleInteractionLogic run, and then we return the DEFERRED response.
    // This implies handleInteractionLogic should not block the main thread for too long
    // before the initial deferral acknowledgement is made by its own internal logic if needed.
    // The current structure of handleInteractionLogic will do its own fetches.

    // Correct approach: The main POST must return the DEFERRED response type.
    // The actual work is then done by handleInteractionLogic, which uses webhooks to update Discord.

    // We start the async work but don't wait for it to finish before sending the deferred response.
    // Using `request.signal` for abort controller if needed for long-running tasks, but here we rely on Discord's async webhook nature.
    handleInteractionLogic(interaction, request).catch(error => {
      // Log errors from the unawaited promise
      console.error("Error in detached handleInteractionLogic:", error);
      // Optionally, try to send a generic error followup if possible, though token might be expired
      if (interaction.application_id && interaction.token) {
        sendEphemeralFollowup(interaction.application_id, interaction.token, "A critical error occurred while processing your request.");
      }
    });

    return NextResponse.json({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: {
        flags: 64, // Literal value for EPHEMERAL (1 << 6)
      },
    } as APIInteractionResponseDeferredChannelMessageWithSource);
  }

  console.warn('[INTERACTION_HANDLER] Unhandled interaction type or fallthrough:', interaction.type);
  return NextResponse.json({ error: 'Unhandled interaction type' }, { status: 400 });
}
