import { UserData } from "@/app/types/UserInfo";

export function getName(userData: UserData) {
    if (userData.displayName) {
      return userData.displayName;
    } else if (userData.firstName || userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    } else {
      return "Unknown";
    }
  }