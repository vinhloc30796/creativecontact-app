"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';

function UploadConfirmedContent() {
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:3000";
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const [uploadInfo, setUploadInfo] = useState({
    email: '',
    userId: '',
    artworkId: ''
  });
  const [emailStatus, setEmailStatus] = useState<'sent' | 'error'>('sent');

  useEffect(() => {
    const info = {
      email: searchParams.get('email') || '',
      userId: searchParams.get('userId') || '',
      artworkId: searchParams.get('artworkId') || ''
    };
    setUploadInfo(info);

    const emailSent = searchParams.get('emailSent') === 'true';
    setEmailStatus(emailSent ? 'sent' : 'error');
  }, [searchParams]);

  return (
    <BackgroundDiv>
      <Card className="w-[400px] overflow-hidden relative z-10">
        <CardHeader className="border-b aspect-video bg-accent-foreground text-accent-foreground"
          style={{
            backgroundImage: 'url(/upload-confirmed-background.png)',
            backgroundSize: 'cover',
          }}
        />
        <CardContent className='p-6 flex flex-col gap-4'>
          <div
            className='flex flex-col space-y-2 p-4 bg-slate-400 bg-opacity-10 rounded-md border border-primary-foreground border-opacity-20'
            style={{ backgroundColor: '#F6EBE4' }}
          >
            <h2 className="text-2xl font-semibold text-primary">Upload Confirmed</h2>
            <p>Your upload has been successfully confirmed. Thank you for your submission!</p>
            {emailStatus === 'sent' && <p>A confirmation email has been sent!</p>}
            {emailStatus === 'error' && <p>
              There was an error sending the confirmation email...
              Please contact us at <a href="mailto:hello@creativecontact.vn" className='underline'>hello@creativecontact.vn</a>
            </p>}
            <div>
              <p className="text-muted-foreground text-sm">
                {isLoading ? 'Loading user information...' : `You're ` + (user?.email ? `logged in as ${user.email}` : `a guest`)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p>The confirmation email contains the following details:</p>
            <ul className="list-disc list-inside">
              <li>Confirmation of your artwork submission</li>
              <li>Details of your uploaded artwork</li>
              <li>Next steps in the review process</li>
              <li>Contact information for any inquiries</li>
            </ul>
          </div>

          <div className="bg-gray-100 p-4 rounded-md space-y-4">
            <p><strong>Artwork ID:</strong> {uploadInfo.artworkId || 'Not available'}</p>
          </div>
        </CardContent>
      </Card>
    </BackgroundDiv >
  )
}

export default UploadConfirmedContent;
