import { Button, Container, Heading, Section, Text } from '@react-email/components';
import React from 'react';
import { Layout } from '../components/Layout';

interface SignInEmailProps {
  otp: string;
  confirmationURL: string;
  isStaff?: boolean;
}

export const SignInEmail: React.FC<SignInEmailProps> = ({ otp, confirmationURL, isStaff = false }) => {
  const heading = isStaff ? "Welcome to the Staff Portal!" : "Welcome to our Event!";
  const buttonText = isStaff ? "Sign In to Staff Portal" : "Sign In to Check-In";
  
  return (
    <Layout>
      <Heading className="text-2xl font-bold text-center text-[#f27151] my-8">{heading}</Heading>
      <Section className="mb-4">
        <Text className="mb-2">Here&apos;s your one-time password:</Text>
        <Text className="font-bold text-lg">{otp}</Text>
      </Section>
      <Section className="mb-4">
        <Text className="mb-4">Or click the button below to sign in and complete your check-in:</Text>
        <Button
          className={`bg-[#f27151] text-white text-center px-6 py-3`}
          href={confirmationURL}
        >
          {buttonText}
        </Button>
        <Text className="mt-4 text-sm text-gray-600">
          If you didn&apos;t request this email, please ignore it.
        </Text>
      </Section>
    </Layout>
  );
};

export default SignInEmail;