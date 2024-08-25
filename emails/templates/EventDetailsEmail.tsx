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
    <Text>Hey, {name}! Here are the details of your event registration:</Text>
    <Section className="my-4">
      <ul className="list-none pl-0">
        <li><Text className="text-base mb-4">📅 When: {eventDate}</Text></li>
        <li><Text className="text-base mb-4">🕒 What Time: {eventTime}</Text></li>
        <li>
          <Text className="text-base mb-4">
            📍 Where: NEO-<br />
            393/7 Hai Bà Trưng, Phường 8, Quận 3, Hồ Chí Minh
          </Text>
        </li>
      </ul>
    </Section>
    <Section className="mb-4">
      <Text className="font-bold">Your QR Code:</Text>
      <Img src={qrCodeUrl} alt="Registration QR Code" width="300" height="300" />
    </Section>
  </Layout>
);

export default EventDetailsEmail;