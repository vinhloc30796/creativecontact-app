"use server";

import { fetchUserData } from "@/app/api/user/helper";
import { UserData } from "@/app/types/UserInfo";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { UserHeader } from "@/components/wrappers/UserHeader";
import { useServerAuth } from "@/hooks/useServerAuth";
import { useTranslation } from "@/lib/i18n/init-server";
import { redirect } from "next/navigation";
import { Section } from "./FormStateNav";
import { ProfileEditForm } from "./sections/ProfileSection";

interface ProfileEditPageProps {
  params: {};
  searchParams: {
    lang: string;
  };
}

export default async function ProfileEditPage({ params, searchParams }: ProfileEditPageProps) {
  const lang = searchParams.lang || "en";
  const { t } = await useTranslation(lang, "ProfilePage");
  const { user, isLoggedIn, isAnonymous } = await useServerAuth();

  const navTranslations = {
    editProfile: t("navigation.editProfile"),
    basicInfo: t("navigation.basicInfo"),
    about: t("navigation.about"),
    professional: t("navigation.professional"),
    contact: t("navigation.contact"),
    saveChanges: t("navigation.saveChanges"),
  };

  const basicInfoTranslations = {
    basicInfo: t("BasicInfoSection.basicInfo"),
    firstName: t("BasicInfoSection.firstName"),
    lastName: t("BasicInfoSection.lastName"),
    displayName: t("BasicInfoSection.displayName"),
    location: t("BasicInfoSection.location"),
  };

  const aboutTranslations = {
    about: t("AboutSection.about"),
    placeholder: t("AboutSection.placeholder"),
  };

  const contactTranslations = {
    contact: t("ContactSection.contact"),
    email: t("ContactSection.email"),
    phone: t("ContactSection.phone"),
    socialLinks: t("ContactSection.socialLinks"),
    instagram: t("ContactSection.instagram"),
    facebook: t("ContactSection.facebook"),
  };

  const professionalTranslations = {
    professional: t("ProfessionalSection.professional"),
    currentIndustries: t("ProfessionalSection.currentIndustries"),
    experience: t("ProfessionalSection.experience"),
    select: t("ProfessionalSection.select"),
    search: t("ProfessionalSection.search"),
    noExperienceFound: t("ProfessionalSection.noExperienceFound"),
  };

  const sections: Section[] = [
    { id: "basic", label: t("navigation.basicInfo"), iconName: "user" },
    { id: "about", label: t("navigation.about"), iconName: "userCircle" },
    { id: "professional", label: t("navigation.professional"), iconName: "briefcase" },
    { id: "contact", label: t("navigation.contact"), iconName: "mail" },
  ];

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
            <ProfileEditForm
              userData={userData}
              sections={sections}
              navTranslations={navTranslations}
              basicInfoTranslations={basicInfoTranslations}
              aboutTranslations={aboutTranslations}
              contactTranslations={contactTranslations}
              professionalTranslations={professionalTranslations}
            />
          </div>
        </main>
      </div>
    </BackgroundDiv>
  );
}
