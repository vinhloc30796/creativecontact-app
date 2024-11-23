import { UserData } from "@/app/types/UserInfo";

function getFormattedPhoneNumber(userData: UserData) {
  if (userData.phoneNumber && userData.phoneCountryCode) {
    return `+${userData.phoneCountryCode} ${userData.phoneNumber}`;
  }
  return null;
}

export { getFormattedPhoneNumber };