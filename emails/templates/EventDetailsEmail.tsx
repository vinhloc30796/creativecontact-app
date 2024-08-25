import { Heading, Img, Section, Text } from '@react-email/components';
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
    <Heading className="text-2xl font-bold text-center text-[#f27151] my-8">Your Event Registration Details</Heading>
    <Text>Here are the details of your event registration:</Text>
    <Section className="my-4">
      <Text>Name: {name}</Text>
      <Text>Email: {email}</Text>
      <Text>Phone: {phone}</Text>
      <Text>Event Date: {eventDate}</Text>
      <Text>Event Time: {eventTime}</Text>
    </Section>
    <Section className="mb-4">
      <Text className="font-bold">Your QR Code:</Text>
      <Img src={qrCodeUrl} alt="Registration QR Code" width="300" height="300" />
    </Section>
  </Layout>
);

export default EventDetailsEmail;