import { Container, Heading, Img, Section, Text } from '@react-email/components';
import React from 'react';
import { Layout } from '../components/Layout';

interface EventDetailsEmailProps {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventTime: string;
  qrCodeUrl: string;
}

export const EventDetailsEmail: React.FC<EventDetailsEmailProps> = ({
  name,
  email,
  phone,
  eventDate,
  eventTime,
  qrCodeUrl
}) => (
  <Layout>
    <Container className="border border-solid border-gray-200 my-10 mx-auto p-5 max-w-[600px]">
      <Heading className="text-2xl font-bold text-center text-[#f27151] my-8">Your Event Registration Details</Heading>
      <Text>Here are the details of your event registration:</Text>
      <Section className="my-4">
        <Text>Name: {name}</Text>
        <Text>Email: {email}</Text>
        <Text>Phone: {phone}</Text>
        <Text>Event Date: {eventDate}</Text>
        <Text>Event Time: {eventTime}</Text>
      </Section>
      <Text className="font-bold">Your QR Code:</Text>
      <Img src={qrCodeUrl} alt="Registration QR Code" width="300" height="300" />
    </Container>
  </Layout>
);