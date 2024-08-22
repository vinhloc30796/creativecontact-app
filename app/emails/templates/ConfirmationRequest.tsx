import {
  Body,
  Button,
  Container,
  Heading,
  Preview,
  Section,
  Text
} from "@react-email/components";
import * as React from "react";
import { Layout } from "../components/Layout";

interface ConfirmationRequestProps {
  confirmationUrl: string;
  participantName: string;
  eventDate: string;
  eventTime: string;
}

export const ConfirmationRequest: React.FC<ConfirmationRequestProps> = ({
  confirmationUrl,
  participantName,
  eventDate,
  eventTime,
}) => {
  const previewText = `Complete your registration for Hoàn Tất Project`;

  return (
    <Layout>
      <Preview>{previewText}</Preview>
      <Body className="bg-white my-auto mx-auto font-sans">
        <Container className="border border-solid border-gray-200 my-10 mx-auto p-5 max-w-[600px]">
          <Heading className="text-2xl font-bold text-center text-[#f27151] my-8">
            Complete your registration
          </Heading>
          <Text className="text-base font-bold mt-6 mb-2">
            Here&apos;s your registration details, {participantName}:
          </Text>
          <Text className="text-base mb-1">
            📅 When: {eventDate}
          </Text>
          <Text className="text-base mb-1">
            🕒 What time: {eventTime}
          </Text>
          <Text className="text-base text-center mb-4">
            👇 Please confirm by clicking the link below 👇
          </Text>
          <Section className="text-center mt-8 mb-8">
            <Button
              className={`bg-[#f27151] text-white text-center px-6 py-3`}
              href={confirmationUrl}
            >
              Confirm
            </Button>
          </Section>
        </Container>
      </Body>
    </Layout>
  );
};