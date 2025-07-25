// File: app/(protected)/profile/edit/page.tsx

import { fetchUserData } from "@/app/api/user/helper";
import { UserData } from "@/app/types/UserInfo";
// Components
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { Header } from "@/components/Header";
// React
import { getServerAuth } from "@/hooks/useServerAuth";
import { getServerTranslation } from "@/lib/i18n/init-server";
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
  const { t } = await getServerTranslation(lang, "HomePage");
  const { user, isLoggedIn, isAnonymous } = await getServerAuth();

  if (!isLoggedIn || isAnonymous) {
    redirect("/login");
  }

  let userData: UserData | null = null;
  if (user) {
    try {
      userData = await fetchUserData(user.id);
      console.log("userData", userData);
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
        <Header
          t={t}
          className="bg-background/80 backdrop-blur-xs"
        />

        <main className="relative z-20 mt-10 w-full grow lg:mt-20">
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

// Source: https://github.com/vercel/next.js/issues/74128
// TODO: Attempt to remove now that we have Next 15.2
export const dynamic = "force-dynamic";
