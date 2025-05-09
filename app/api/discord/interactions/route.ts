import { NextRequest, NextResponse } from 'next/server';
import { InteractionType, InteractionResponseType, ComponentType, APIInteraction, APIInteractionResponseChannelMessageWithSource, APIInteractionResponsePong, APIMessageComponentInteraction, MessageFlags } from 'discord-api-types/v10';
import { verifyDiscordRequest } from '@/utils/discord_verify'; // Assuming @ is configured for src or utils
import { getPayload } from 'payload';
import configPromise from '@payload-config'; // Ensure this path is correct
import nacl from 'tweetnacl';

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
    const res = await fetch(followupUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error(`[INTERACTION_HANDLER] Error sending follow-up. Status: ${res.status}`, errorData);
    }
  } catch (e) {
    console.error('[INTERACTION_HANDLER] Exception during sendFollowUp fetch:', e);
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
    if (interaction.data.component_type !== ComponentType.Button) {
      console.warn(`[INTERACTION_HANDLER] Unsupported component type: ${interaction.data.component_type}`);
      return NextResponse.json({ error: 'Unsupported component type' }, { status: 400 });
    }

    const componentInteraction = interaction as APIMessageComponentInteraction;
    const customId = componentInteraction.data.custom_id;
    console.log(`[INTERACTION_HANDLER] Handling MessageComponent interaction with custom_id: ${customId}`);

    const [action, entity, userId] = customId.split('_');

    if (entity !== 'staff' || !userId) {
      console.error(`[INTERACTION_HANDLER] Invalid custom_id format: ${customId}`);
      return NextResponse.json({ error: 'Invalid custom_id format' }, { status: 400 });
    }
    console.log(`[INTERACTION_HANDLER] Parsed custom_id: action=${action}, entity=${entity}, userId=${userId}`);

    // Admin Role Verification
    const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;
    if (!adminRoleId) {
      console.error('[INTERACTION_HANDLER] FATAL: DISCORD_ADMIN_ROLE_ID is not set.');
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: 'Error: Server configuration issue (admin role ID missing). Action cannot be performed.',
          flags: MessageFlags.Ephemeral,
        },
      } as APIInteractionResponseChannelMessageWithSource);
    }
    console.log(`[INTERACTION_HANDLER] DISCORD_ADMIN_ROLE_ID is present: ${adminRoleId}`);

    const memberRoles = componentInteraction.member?.roles || [];
    console.log(`[INTERACTION_HANDLER] Member roles: ${memberRoles.join(', ')}`);
    if (!memberRoles.includes(adminRoleId)) {
      console.warn(`[INTERACTION_HANDLER] User ${componentInteraction.member?.user?.id} (username: ${componentInteraction.member?.user?.username}) attempting action '${action}' on user ${userId} without admin role ${adminRoleId}. User roles: ${memberRoles.join(', ')}`);
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '🚫 You do not have permission to perform this action.',
          flags: MessageFlags.Ephemeral,
        },
      } as APIInteractionResponseChannelMessageWithSource);
    }
    console.log(`[INTERACTION_HANDLER] Admin role VERIFIED for user ${componentInteraction.member?.user?.id}`);

    // Proceed with action if admin role is verified
    console.log(`[INTERACTION_HANDLER] Admin user ${componentInteraction.member?.user?.id} (username: ${componentInteraction.member?.user?.username}) performing action '${action}' on user ${userId}`);

    if (action === 'approve') {
      console.log('[INTERACTION_HANDLER] Matched action: approve');

      // Immediately defer the response ephemerally
      // Important: The main function MUST return this response quickly.
      // The actual work will be done in a non-awaited async function.
      const deferResponse = NextResponse.json({
        type: InteractionResponseType.DeferredChannelMessageWithSource,
        data: {
          flags: MessageFlags.Ephemeral,
        },
      });

      // Fire-and-forget the actual processing and follow-up
      (async () => {
        try {
          const internalApiSecret = process.env.DISCORD_INTERNAL_API_SECRET;
          if (!internalApiSecret) {
            console.error('[INTERACTION_HANDLER] FATAL: DISCORD_INTERNAL_API_SECRET is not set for approval. Cannot send follow-up.');
            // Attempt to send a follow-up error message if possible
            await sendFollowUp(interaction, "Error: Server configuration issue (internal API secret missing). Approval cannot be processed.");
            return;
          }
          console.log('[INTERACTION_HANDLER] DISCORD_INTERNAL_API_SECRET is present for approval follow-up.');

          let baseApiUrlString;
          if (process.env.NODE_ENV === 'development') {
            baseApiUrlString = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
          } else {
            baseApiUrlString = process.env.NEXT_PUBLIC_SERVER_URL || new URL(request.url).origin;
          }
          const approveApiUrl = new URL(`/api/staff/approval/approve/${userId}`, baseApiUrlString).toString();
          console.log(`[INTERACTION_HANDLER] Constructed approval API URL for follow-up: ${approveApiUrl}`);

          const apiResponse = await fetch(approveApiUrl, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${internalApiSecret}`,
              'Content-Type': 'application/json',
            },
          });

          const responseBody = await apiResponse.json().catch(() => ({}));
          console.log(`[INTERACTION_HANDLER] Follow-up: Approval API response status: ${apiResponse.status}, body:`, responseBody);

          let followUpMessageContent;
          if (!apiResponse.ok) {
            console.error(`[INTERACTION_HANDLER] Follow-up: Error calling approval API for user ${userId}. Status: ${apiResponse.status}`, responseBody);
            followUpMessageContent = `⚠️ Failed to approve user ${userId}. API responded with status ${apiResponse.status}. ${(responseBody as any).error || 'Unknown error'}`.trim();
          } else {
            const userEmail = (responseBody as any).staff?.email || `ID ${userId}`;
            console.log(`[INTERACTION_HANDLER] Follow-up: User ${userEmail} approved successfully via API call.`);
            followUpMessageContent = `✅ User ${userEmail} has been approved.`;
          }
          await sendFollowUp(interaction, followUpMessageContent);

        } catch (error) {
          console.error(`[INTERACTION_HANDLER] Follow-up: Network or unexpected error processing approval for staff ${userId}:`, error);
          await sendFollowUp(interaction, `Error processing approval for user ${userId}. Please check server logs.`);
        }
      })();

      return deferResponse; // Return the deferral quickly

    } else if (action === 'reject') {
      console.log('[INTERACTION_HANDLER] Matched action: reject');

      // Immediately defer the response ephemerally
      const deferResponse = NextResponse.json({
        type: InteractionResponseType.DeferredChannelMessageWithSource,
        data: {
          flags: MessageFlags.Ephemeral,
        },
      });

      // Fire-and-forget the actual processing and follow-up
      (async () => {
        try {
          const internalApiSecret = process.env.DISCORD_INTERNAL_API_SECRET;
          if (!internalApiSecret) {
            console.error('[INTERACTION_HANDLER] FATAL: DISCORD_INTERNAL_API_SECRET is not set for rejection follow-up.');
            await sendFollowUp(interaction, "Error: Server configuration issue (internal API secret missing). Rejection cannot be processed.");
            return;
          }
          console.log('[INTERACTION_HANDLER] DISCORD_INTERNAL_API_SECRET is present for rejection follow-up.');

          const payload = await getPayload({ config: configPromise });
          const staffUser = await payload.findByID({
            collection: 'staffs',
            id: userId,
          });

          if (!staffUser) {
            console.error(`[INTERACTION_HANDLER] Follow-up: Staff user with ID ${userId} not found for rejection.`);
            await sendFollowUp(interaction, `Error: Staff user with ID ${userId} not found.`);
            return;
          }

          let baseApiUrlStringReject;
          if (process.env.NODE_ENV === 'development') {
            baseApiUrlStringReject = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
          } else {
            baseApiUrlStringReject = process.env.NEXT_PUBLIC_SERVER_URL || new URL(request.url).origin;
          }
          const rejectApiUrl = new URL(`/api/staff/approval/reject/${userId}`, baseApiUrlStringReject).toString();
          console.log(`[INTERACTION_HANDLER] Constructed reject API URL for follow-up: ${rejectApiUrl}`);

          const apiResponse = await fetch(rejectApiUrl, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${internalApiSecret}`,
            },
          });

          const errorBody = await apiResponse.json().catch(() => ({})); // Changed variable name for clarity
          console.log(`[INTERACTION_HANDLER] Follow-up: Reject API response status: ${apiResponse.status}, body:`, errorBody);

          let followUpMessageContent;
          if (!apiResponse.ok) {
            console.error(`[INTERACTION_HANDLER] Follow-up: Error calling reject API for user ${userId}:`, errorBody);
            followUpMessageContent = `Error rejecting user: ${(errorBody as any).error || 'Unknown error'}`;
          } else {
            console.log(`[INTERACTION_HANDLER] Follow-up: User ${staffUser.email} rejected successfully via API call.`);
            followUpMessageContent = `❌ User ${staffUser.email} has been rejected. They will be notified.`;
          }
          await sendFollowUp(interaction, followUpMessageContent);

        } catch (error: any) {
          console.error(`[INTERACTION_HANDLER] Follow-up: Error processing rejection for user ${userId}:`, error);
          await sendFollowUp(interaction, `An unexpected error occurred while rejecting the user: ${error.message || 'Unknown error'}`);
        }
      })();

      return deferResponse; // Return the deferral quickly

    } else {
      console.warn(`[INTERACTION_HANDLER] Unknown action: ${action} for custom_id: ${customId}`);
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  }

  console.warn('[INTERACTION_HANDLER] Unhandled interaction type or fallthrough:', interaction.type);
  return NextResponse.json({ error: 'Unhandled interaction type' }, { status: 400 });
}
