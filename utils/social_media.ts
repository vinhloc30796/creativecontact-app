import { UserData } from "@/app/types/UserInfo";
import { SiFacebook, SiInstagram } from "@icons-pack/react-simple-icons";

export const socialMediaMapper = {
  instagramHandle: {
    icon: SiInstagram,
    baseUrl: "https://instagram.com/",
  },
  facebookHandle: {
    icon: SiFacebook,
    baseUrl: "https://facebook.com/",
  },
};

export function getSocialMediaLinks(userData: UserData) {
  return Object.entries(socialMediaMapper).reduce((acc, [key, value]) => {
    const handle = userData[key as keyof Pick<UserData, 'instagramHandle' | 'facebookHandle'>];
    if (handle) {
      acc.push({
        icon: value.icon,
        url: `${value.baseUrl}${handle}`,
      });
    }
    return acc;
  }, [] as Array<{ icon: typeof SiInstagram | typeof SiFacebook; url: string }>);
}