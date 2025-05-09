import { NextRequest, NextResponse } from 'next/server';
import { RESTPostAPIChannelMessageJSONBody, APIEmbed, APIActionRowComponent, APIButtonComponent, ButtonStyle, ComponentType } from 'discord-api-types/v10';

interface SignupNotificationRequest {
  userId: string;
  email: string;
  name?: string; // Optional, as it might not always be provided
  // Add any other relevant user details you might want to include
}

export async function POST(request: NextRequest) {
  const { userId, email, name } = (await request.json()) as SignupNotificationRequest;

  if (!userId || !email) {
    return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 });
  }

  const discordBotToken = process.env.DISCORD_BOT_TOKEN;
  const discordChannelId = process.env.DISCORD_CHANNEL_ID;

  if (!discordBotToken || !discordChannelId) {
    console.error('Discord bot token or channel ID is not configured.');
    return NextResponse.json({ error: 'Discord integration not configured' }, { status: 500 });
  }

  const userDisplayName = name || email; // Use email if name is not available

  const embed: APIEmbed = {
    title: 'New Staff Signup Request',
    description: `A new staff member has signed up and requires approval.`,
    color: 0x5865F2, // Discord blurple
    fields: [
      { name: 'User ID', value: userId, inline: true },
      { name: 'Email', value: email, inline: true },
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: 'CreativeContact Staff Approval System',
    },
  };
  if (name) {
    embed.fields?.splice(1, 0, { name: 'Name', value: name, inline: true });
  }


  const approveButton: APIButtonComponent = {
    type: ComponentType.Button,
    style: ButtonStyle.Success,
    label: 'Approve',
    custom_id: `approve_staff_${userId}`,
  };

  const rejectButton: APIButtonComponent = {
    type: ComponentType.Button,
    style: ButtonStyle.Danger,
    label: 'Reject',
    custom_id: `reject_staff_${userId}`,
  };

  const actionRow: APIActionRowComponent<APIButtonComponent> = {
    type: ComponentType.ActionRow,
    components: [approveButton, rejectButton],
  };

  const messagePayload: RESTPostAPIChannelMessageJSONBody = {
    embeds: [embed],
    components: [actionRow],
  };

  try {
    const response = await fetch(`https://discord.com/api/v10/channels/${discordChannelId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${discordBotToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messagePayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to send Discord notification:', response.status, errorData);
      return NextResponse.json({ error: 'Failed to send Discord notification', details: errorData }, { status: response.status });
    }

    console.log(`Notification sent to Discord for user ID: ${userId}`);
    return NextResponse.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending Discord notification:', error);
    return NextResponse.json({ error: 'Internal server error while sending notification' }, { status: 500 });
  }
}
