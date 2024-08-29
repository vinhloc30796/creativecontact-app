import { Heading, Img, Preview, Text, Link } from "@react-email/components";
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
      <Heading className="text-2xl font-bold text-center text-[#f27151] my-8">
        Thanks for registering to Hoàn Tất Project 🤩
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
      <ul className="list-none pl-0">
        <li>
          <Text className="text-base mb-1">
            📅 When: {eventDate}
          </Text>
        </li>
        <li>
          <Text className="text-base mb-1">
            🕒 What time: {eventTime}
          </Text>
        </li>
        <li>
          <Text className="text-base mb-4">
            📍 Where: NEO-<br />
            393/7 Hai Bà Trưng, Phường 8, Quận 3, Hồ Chí Minh
          </Text>
        </li>
      </ul>
      <Text className="text-base mb-4">
        Please show this ticket and QR code to us at the entrance, and let the goooooooood vibe begin! <br />
        You can also self-check-in here on the day of the event: &nbsp;
        <Link href="https://app.creativecontact.com/checkin?utm_source=webapp&utm_medium=button&utm_campaign=registration-confirmed&utm_content=${registrationInfo.userId || user?.id || 'unknown'}">
          /checkin
        </Link>
      </Text>
      <Text className="text-base text-foreground">
        Mở mã QR này cho chúng mình tại sự kiện để check-in nhé! <br />
        Bạn cũng có thể tự check-in tại đây vào ngày sự kiện: &nbsp;
        <Link href="https://app.creativecontact.com/checkin?utm_source=webapp&utm_medium=button&utm_campaign=registration-confirmed&utm_content=${registrationInfo.userId || user?.id || 'unknown'}">
          /checkin
        </Link>
      </Text>
      <Img
        src={qrCodeUrl}
        alt="QR Code"
        width="200"
        height="200"
        className="w-full h-auto my-8"
      />
      <Text className="text-sm italic mb-4">
        If you&apos;ve got any Qs, just hit us up by replying to this email. Otherwise, get hyped and we&apos;ll see you there! ❤️
      </Text>
    </Layout>
  );
};

export default ConfirmationWithICS;