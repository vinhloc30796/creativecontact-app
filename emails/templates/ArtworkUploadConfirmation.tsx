// File: emails/templates/ArtworkUploadConfirmation.tsx

import {
  Body,
  Button,
  Container,
  Heading,
  Preview,
  render,
  Section,
  Text
} from "@react-email/components";
import * as React from "react";
import { Layout } from "../components/Layout";

interface ArtworkUploadConfirmationProps {
  uploaderName: string;
  artworkTitle: string;
  confirmationUrl?: string;
}

export const ArtworkUploadConfirmation: React.FC<ArtworkUploadConfirmationProps> = ({
  uploaderName,
  artworkTitle,
  confirmationUrl,
}) => {
  const previewText = `Confirm your email for Hoàn Tất Project artwork submission`;

  return (
    <Layout>
      <Preview>{previewText}</Preview>
      <Heading className="text-2xl font-bold text-center text-[#f27151] my-8">
        Artwork Submitted Successfully
      </Heading>
      <Text className="text-base font-bold mt-6 mb-2">
        Hello {uploaderName},
      </Text>
      <Text className="text-base mb-4">
        Your artwork has been successfully submitted to the Hoàn Tất Project. Here are the details:
      </Text>
      <ul className="list-none pl-0">
        <li>
          <Text className="text-base mb-1">
            🎨 Artwork Title: {artworkTitle}
          </Text>
        </li>
        <li>
          <Text className="text-base mb-4">
            👤 Uploader: {uploaderName}
          </Text>
        </li>
      </ul>
      {confirmationUrl && (
        <>
          <Text className="text-base text-center mb-4">
            Please confirm your email address by clicking the link below:
          </Text>
          <Section className="text-center mt-4">
            <Button
              className={`bg-[#f27151] text-white text-center px-6 py-3`}
              href={confirmationUrl}
            >
              Confirm Email
            </Button>
          </Section>
        </>
      )}
      <Text className="text-sm text-center mt-6">
        If you did not submit this artwork, please disregard this email.
      </Text>
    </Layout>
  );
};

export default ArtworkUploadConfirmation;
