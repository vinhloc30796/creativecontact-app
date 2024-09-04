// File: app/actions/email/utils.ts
import { EventSlot } from "@/app/types/EventSlot";
import { createEvent } from "ics";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY!;
export const resend = new Resend(resendApiKey);

export function generateICSFile(slotData: EventSlot): Promise<string> {
  return new Promise((resolve, reject) => {
    const event = {
      start: [
        slotData.time_start.getUTCFullYear(),
        slotData.time_start.getUTCMonth() + 1,
        slotData.time_start.getUTCDate(),
        slotData.time_start.getUTCHours(),
        slotData.time_start.getUTCMinutes(),
      ],
      end: [
        slotData.time_end.getUTCFullYear(),
        slotData.time_end.getUTCMonth() + 1,
        slotData.time_end.getUTCDate(),
        slotData.time_end.getUTCHours(),
        slotData.time_end.getUTCMinutes(),
      ],
      // Event information
      title: "Hoàn Tất Project",
      description:
        "Dự án độc đáo kêu gọi các bạn thực hành sáng tạo và nghệ thuật trao đổi và hoàn thành tác phẩm dang dở, kết hợp với Neo-",
      organizer: {
        name: "Creative Contact",
        email: "no-reply@creativecontact.vn",
      },
      // Geo
      location:
        "NEO-, 393/7 Hai Bà Trưng, Phường 8, Quận 3, Hồ Chí Minh, Vietnam",
      geo: { lat: 10.790062, lon: 106.688437 },
      // Other information
      url: "https://creativecontact.vn",
      status: "CONFIRMED" as const,
      busyStatus: "BUSY" as const,
      alarms: [
        {
          action: "display",
          description: "Reminder: Hoàn Tất is starting in 1 day",
          trigger: { hours: 24, minutes: 0, before: true },
        },
        {
          action: "display",
          description: "Reminder: Hoàn Tất is starting in 1 hour",
          trigger: { hours: 1, minutes: 0, before: true },
        },
      ],
      // Explicitly set the timezone
      startInputType: "utc",
      startOutputType: "utc",
      endInputType: "utc",
      endOutputType: "utc",
    };

    createEvent(event as any, (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    });
  });
}
