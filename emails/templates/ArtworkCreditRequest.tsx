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

interface ArtworkCreditRequestProps {
  claimAccountUrl: string;
  artistName: string;
  artworkTitle: string;
}

export const ArtworkCreditRequest: React.FC<ArtworkCreditRequestProps> = ({
  claimAccountUrl,
  artistName,
  artworkTitle,
}) => {
  const previewText = `You've been credited for your artwork on Hoàn Tất Project`;

  return (
    <Layout>
      <Preview>{previewText}</Preview>
      <Heading className="text-2xl font-bold text-center text-[#f27151] my-8">
        Your Have Been Credited for an Artwork
      </Heading>
      <Text className="text-base font-bold mt-6 mb-2">
        Dear {artistName},
      </Text>
      <Text className="text-base mb-4">
        We're excited to inform you that your artwork, "{artworkTitle}", has been credited on our platform. We appreciate your contribution to the Hoàn Tất Project and would like to invite you to join our community.
      </Text>
      <Text className="text-base mb-4">
        To claim your account and become an active member of our platform, please click the button below:
      </Text>
      <Section className="text-center mt-4 mb-4">
        <Button
          className={`bg-[#f27151] text-white text-center px-6 py-3`}
          href={claimAccountUrl}
        >
          Claim Your Account
        </Button>
      </Section>
      <Text className="text-base mb-4">
        By joining our platform, you'll (soon 😉) be able to:
      </Text>
      <ul className="list-disc pl-6 mb-4">
        <li>
          <Text className="text-base mb-1">
            Manage your artwork credits
          </Text>
        </li>
        <li>
          <Text className="text-base mb-1">
            Connect with other artists and art enthusiasts
          </Text>
        </li>
        <li>
          <Text className="text-base mb-1">
            Showcase your portfolio to a wider audience
          </Text>
        </li>
      </ul>
      <Text className="text-base mb-4">
        We look forward to having you as part of our creative community!
      </Text>
      <Text className="text-base">
        Best regards,<br />
        Creative Contact
      </Text>
    </Layout>
  );
};

export default ArtworkCreditRequest;
