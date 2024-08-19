export const TIMEZONE = "Asia/Ho_Chi_Minh";
export const LOCALE = "vi-VN";

const options: Intl.DateTimeFormatOptions = {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false, // Use 24-hour format
};
export const timezoneFormatter = new Intl.DateTimeFormat(LOCALE, options);
