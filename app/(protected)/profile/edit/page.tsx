"use server";

import { fetchUserData } from "@/app/api/user/helper";
import { UserData } from "@/app/types/UserInfo";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { UserHeader } from "@/components/wrappers/UserHeader";
import { useServerAuth } from "@/hooks/useServerAuth";
import { redirect } from "next/navigation";
import { ProfileEditForm } from "./ProfileEditForm";

interface ProfileEditPageProps {
  params: {};
  searchParams: {
    lang: string;
  };
}

export default async function ProfileEditPage({ params, searchParams }: ProfileEditPageProps) {
  const lang = searchParams.lang || "en";
  const { user, isLoggedIn, isAnonymous } = await useServerAuth();

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
          <div className="container mx-auto px-4">
            <ProfileEditForm userData={userData} lang={lang} />
          </div>
        </main>
      </div>
    </BackgroundDiv>
  );
}
