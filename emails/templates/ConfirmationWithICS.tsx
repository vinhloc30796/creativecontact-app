import {
  Body,
  Container,
  Heading,
  Img,
  Preview,
  Text
} from "@react-email/components";
import * as React from "react";
import { Layout } from "../components/Layout";

interface ConfirmationWithICSProps {
  participantName: string;
  eventDate: string;
  eventTime: string;
  qrCodeUrl: string;
}

export const ConfirmationWithICS: React.FC<ConfirmationWithICSProps> = ({
  participantName,
  eventDate,
  eventTime,
  qrCodeUrl,
}) => {
  const previewText = `Thanks for registering to Hoàn Tất Project!`;

  return (
    <Layout>
      <Preview>{previewText}</Preview>
      <Body className="bg-white my-auto mx-auto font-sans">
        <Container className="my-10 mx-auto p-5 max-w-[600px]">
          <Heading className="text-2xl font-bold text-center text-[#f27151] my-8">
            Thanks for registering to Hoàn Tất Project 🤩
          </Heading>
          <Heading style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif", fontSize: '16px', lineHeight: '1.5' }}>
            This text uses inline styles for better compatibility.
          </Heading>
          <Text className="text-base mb-4">
            Hey {participantName}!
          </Text>
          <Text className="text-base mb-4">
            Guess what? You&apos;re officially on the list for Hoàn Tất Project! 🎉 We&apos;re super hyped that you&apos;re joining us for this showcase.
          </Text>
          <Text className="text-base font-bold mt-6 mb-2">
            Here&apos;s the details:
          </Text>
          <Text className="text-base mb-1">
            📅 When: {eventDate}
          </Text>
          <Text className="text-base mb-1">
            🕒 What time: {eventTime}
          </Text>
          <Text className="text-base mb-4">
            📍 Where: NEO-<br />
            393/7 Hai Bà Trưng, Phường 8, Quận 3, Hồ Chí Minh
          </Text>
          <Text className="text-base mb-4">
            Please show this ticket and QR code to us at the entrance, and let the goooooooood vibe begin!
          </Text>
          <Img
            src={qrCodeUrl}
            alt="QR Code"
            width="200"
            height="200"
            className="w-full h-auto my-8"
          />
          <Text className="text-sm italic mb-6">
            If you&apos;ve got any Qs, just hit us up by replying to this email. Otherwise, get hyped and we&apos;ll see you there! ❤️
          </Text>
        </Container>
      </Body>
    </Layout>
  );
};

export default ConfirmationWithICS;