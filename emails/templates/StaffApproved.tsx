import {
  Button,
  Container,
  Heading,
  Section,
  Text,
} from '@react-email/components';
import React from 'react';
import { Layout } from '../components/Layout';

interface StaffApprovedEmailProps {
  name?: string;
  loginUrl: string;
}

export const StaffApprovedEmail: React.FC<StaffApprovedEmailProps> = ({
  name,
  loginUrl,
}) => {
  const userName = name ? `, ${name}` : '';

  return (
    <Layout>
      <Container className="px-4 py-8 mx-auto text-center">
        <Heading className="text-3xl font-bold text-[#f27151] mb-6">
          Account Approved!
        </Heading>
        <Section className="mb-6">
          <Text className="text-lg text-gray-700 mb-4">
            Congratulations{userName}! Your staff account has been approved.
          </Text>
          <Text className="text-lg text-gray-700 mb-6">
            You can now log in to access the staff portal and features.
          </Text>
          <Button
            className="bg-[#f27151] text-white font-semibold text-center px-8 py-3 rounded-md text-lg"
            href={loginUrl}
          >
            Log In to Staff Portal
          </Button>
        </Section>
        <Text className="mt-8 text-sm text-gray-500">
          If you have any questions, please contact support.
        </Text>
      </Container>
    </Layout>
  );
};

export default StaffApprovedEmail;
