// File: app/registration-confirmed/page.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import QRCode from "qrcode";
import { useEffect, useState } from 'react';
import styles from '../(public)/(event)/checkin/_sections/_checkin.module.scss';
import QRCodeWithHover from './QRCodeWithHover'; // Make sure to create this file

export default function RegistrationConfirmed() {
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const [registrationInfo, setRegistrationInfo] = useState({
    email: '',
    userId: '',
    registrationId: ''
  });
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    const info = {
      email: searchParams.get('email') || '',
      userId: searchParams.get('userId') || '',
      registrationId: searchParams.get('registrationId') || ''
    };
    setRegistrationInfo(info);

    if (info.registrationId) {
      QRCode.toDataURL(info.registrationId)
        .then(url => setQrCode(url))
        .catch(err => console.error('Error generating QR code:', err));
    }
  }, [searchParams]);

  const handleSaveQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'registration-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={cn('min-h-screen flex items-center justify-center', styles.container)} style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover' }}>
      <Card className="w-[400px] overflow-hidden relative z-10">
        <CardHeader className="border-b aspect-video bg-accent-foreground text-accent-foreground"
          style={{
            backgroundImage: 'url(/banner.jpg)',
            backgroundSize: 'cover',
          }}
        />
        <CardContent className='p-6 flex flex-col gap-4'>
          <div
            className={cn('flex flex-col space-y-2 p-4 bg-slate-400 bg-opacity-10 rounded-md border border-primary-foreground border-opacity-20', styles.step)}
            style={{ backgroundColor: '#F6EBE4' }}
          >
            <h2 className="text-2xl font-semibold">Registration Confirmed</h2>
            <p>Your registration has been successfully confirmed. Thank you for registering! We will send more information to your email ({registrationInfo.email || user?.email || 'Not available'})</p>
          </div>

          {isLoading ? (
            <p>Loading user information...</p>
          ) : (
            <div className="space-y-2">
              <p><strong>User ID:</strong> {registrationInfo.userId || user?.id || 'Not available'}</p>
            </div>
          )}

          <div className="space-y-2">
            <p>Please check your email for a confirmation message with the following details:</p>
            <ul className="list-disc list-inside">
              <li>Event schedule</li>
              <li>Venue information</li>
              <li>Any required materials or preparation</li>
              <li>Contact information for event organizers</li>
            </ul>
          </div>

          <div className="bg-gray-100 p-4 rounded-md space-y-4">
            <p><strong>Registration ID:</strong> (click to save) {registrationInfo.registrationId || 'Not available'}</p>
            {qrCode && (
              <div className="flex justify-center">
                <QRCodeWithHover qrCode={qrCode} onSave={handleSaveQRCode} />
              </div>
            )}
          </div>



          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href={
                `https://creativecontact.vn/?utm_source=webapp&utm_medium=button&utm_campaign=registration-confirmed&utm_content=${registrationInfo.userId || user?.id || 'unknown'}`
              }>Go to Event Page</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}