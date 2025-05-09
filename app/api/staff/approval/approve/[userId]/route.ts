import { NextResponse, type NextRequest } from 'next/server';
import { getCustomPayload } from '@/lib/payload/getCustomPayload';
import { StaffApprovedEmail } from '@/emails/templates/StaffApproved';
import { resend } from '@/app/actions/email/utils'; // Assuming this is the correct path
import React from 'react';
import { render } from '@react-email/components';

interface ApprovalParams {
  params: Promise<{
    userId: string;
  }>;
}

export async function PATCH(req: NextRequest, { params }: ApprovalParams) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const authorizationHeader = req.headers.get('Authorization');
  const expectedToken = process.env.DISCORD_INTERNAL_API_SECRET;

  if (!expectedToken) {
    console.error('DISCORD_INTERNAL_API_SECRET is not set in environment variables.');
    return NextResponse.json({ error: 'Internal server configuration error' }, { status: 500 });
  }

  if (!authorizationHeader || authorizationHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const localPayload = await getCustomPayload();
    const updatedStaff = await localPayload.update({
      collection: 'staffs',
      id: userId,
      data: {
        status: 'approved',
        active: true,
      },
    });

    if (!updatedStaff) {
      return NextResponse.json({ error: 'Staff member not found or update failed' }, { status: 404 });
    }

    // Email notification logic will be added as part of task D1.1
    // console.log(`User ${userId} approved. Trigger email notification here.`);

    // Send approval email
    if (updatedStaff.email) {
      try {
        const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/staff/login`; // Or your specific staff login page

        const emailComponent = React.createElement(StaffApprovedEmail, {
          name: updatedStaff.name || undefined,
          loginUrl: loginUrl,
        });

        await resend.emails.send({
          from: 'Creative Contact <no-reply@creativecontact.vn>',
          to: updatedStaff.email,
          subject: 'Your Staff Account has been Approved!',
          react: emailComponent,
          text: await render(emailComponent, { plainText: true }),
        });
        console.log(`Approval email sent to ${updatedStaff.email}`);
      } catch (emailError) {
        console.error(`Error sending approval email to ${updatedStaff.email}:`, emailError);
        // Do not fail the whole request if email sending fails, but log it.
      }
    } else {
      console.warn(`User ${userId} approved, but no email found to send notification.`);
    }

    return NextResponse.json({ message: 'Staff member approved successfully', staff: updatedStaff }, { status: 200 });
  } catch (error: any) {
    console.error(`Error approving staff member ${userId}:`, error);

    if (error.message?.includes('not found') || error.status === 404) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal server error while approving staff member' }, { status: 500 });
  }
}
