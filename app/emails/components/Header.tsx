// File: app/emails/components/Header.tsx

import * as React from "react";
import { Img, Text } from "@react-email/components";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "localhost:3000";

export const Header: React.FC = () => (
  <>
    <Img
      src={`${baseUrl}/logo-full-horizontal-transparent.png`}
      alt="Creative Contact - Logo"
      className="w-full h-auto"
    />
    <Text className="text-4xl font-bold text-center my-6">
      Creative Contact
    </Text>
  </>
);