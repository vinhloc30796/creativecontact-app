import { UserData } from "@/app/types/UserInfo";

export async function fetchUserData(userId: string): Promise<UserData | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  // Construct the full URL
  const url = `${baseUrl}/api/user/${userId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return response.json();
}
