// File: app/(protected)/profile/edit/page.tsx

"use server";

import { fetchUserData } from "@/app/api/user/helper";
import { UserData } from "@/app/types/UserInfo";
// Components
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { UserHeader } from "@/components/wrappers/UserHeader";
// React
import { getServerAuth } from "@/hooks/useServerAuth";
import { redirect } from "next/navigation";
import { ProfileEditForm } from "./ProfileEditForm";
import { BackButton } from "../BackButton";

interface ProfileEditPageProps {
  params: Promise<{}>;
  searchParams: Promise<{
    lang: string;
  }>;
}

export default async function ProfileEditPage(props: ProfileEditPageProps) {
  const searchParams = await props.searchParams;
  const lang = searchParams.lang || "en";
  const { user, isLoggedIn, isAnonymous } = await getServerAuth();

  if (!isLoggedIn || isAnonymous) {
    redirect("/login");
  }

  let userData: UserData | null = null;
  if (user) {
    try {
      userData = await fetchUserData(user.id);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  if (!userData) {
    return null;
  }

  return (
    <BackgroundDiv>
      <div className="flex min-h-screen w-full flex-col">
        <UserHeader
          lang={lang}
          isLoggedIn={isLoggedIn}
          className="bg-background/80 backdrop-blur-sm"
        />

        <main className="relative z-20 mt-10 w-full flex-grow lg:mt-20">
          <div className="container mx-auto mb-4 px-4">
            <BackButton />
          </div>
          <div className="container mx-auto px-4">
            <ProfileEditForm userData={userData} lang={lang} />
          </div>
        </main>
      </div>
    </BackgroundDiv>
  );
}
