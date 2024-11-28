import { getPlaceholderImage } from "@/utils/placeholder";
import { UserData } from "@/app/types/UserInfo";
import { getName } from "@/utils/user_name";

export async function getProfileImageUrl(userData: UserData) {
  const placeholderName = await getName(userData);
  if (!userData.profilePicture) {
    // If no profile picture set, get placeholder
    return getPlaceholderImage(placeholderName);
  }

  const profilePictureUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_pictures/${userData.profilePicture}`;

  try {
    // Check if image exists
    const response = await fetch(profilePictureUrl, { method: "HEAD" });
    if (!response.ok) {
      return getPlaceholderImage(placeholderName);
    }
    return profilePictureUrl;
  } catch (error) {
    console.error("Error checking profile image:", error);
    return getPlaceholderImage(placeholderName);
  }
}