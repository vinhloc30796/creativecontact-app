export const TIMEZONE = "Asia/Ho_Chi_Minh";
export const LOCALE = "vi-VN";

// Just date
const dateOptions: Intl.DateTimeFormatOptions = {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
};
export const dateFormatter = new Intl.DateTimeFormat(LOCALE, dateOptions);
// Just hour and minute
const timeslotOptions: Intl.DateTimeFormatOptions = {
  timeZone: TIMEZONE,
  hour: "numeric",
  minute: "numeric",
  hour12: false, // Use 24-hour format
};
export const timeslotFormatter = new Intl.DateTimeFormat(LOCALE, timeslotOptions);
// Full datetime
const datetimeOptions: Intl.DateTimeFormatOptions = {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false, // Use 24-hour format
}
export const datetimeFormatter = new Intl.DateTimeFormat(LOCALE, datetimeOptions);