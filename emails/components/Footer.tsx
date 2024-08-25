// File: app/emails/components/Footer.tsx

import React from 'react';
import { Img, Section, Link } from "@react-email/components";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "localhost:3000";

export const Footer: React.FC = () => (
  // <Section style={{ marginTop: '20px' }}>
  <Section className="mt-5">
    <Img
      src={`${baseUrl}/HoanTatProject-background-20240822.png`}
      alt="Hoan Tat Project - Footer Banner"
      className="w-full h-auto my-8"
    />
    <Section className="text-center my-4">
      <Link href="https://www.facebook.com/creativecontact.vn" className="mr-2">Facebook</Link>
      <Link href="https://instagram.com/creativecontact_vn">Instagram</Link>
      <Link href="https://creativecontact.vn" className="ml-2">Website</Link>
    </Section>
    <p className="text-center text-sm text-gray-500">
      This email was created with 💓 from Creative Contact
    </p>
  </Section>
);