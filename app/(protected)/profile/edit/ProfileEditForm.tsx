"use client";

import { UserData } from "@/app/types/UserInfo";
import { ProfessionalSection } from "@/components/profile/ProfessionalSection";
import { FormStateProvider } from "@/contexts/FormStateProvider";
import { UserService } from "@/services/user-service";
import { useRouter } from "next/navigation";
import { FormStateNav, Section } from "./FormStateNav";
import { AboutSection } from "@/components/profile/AboutSection";
import { BasicInfoSection } from "@/components/profile/BasicInfoSection";
import { ContactSection } from "@/components/profile/ContactSection";
import { useTranslation } from "@/lib/i18n/init-client";
import { User } from "lucide-react";

interface ProfileEditFormProps {
  userData: UserData;
  lang?: string;
}

export function ProfileEditForm({
  userData,
  lang = "en",
}: ProfileEditFormProps) {
  const router = useRouter();
  const { t } = useTranslation(lang, "ProfilePage");

  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      await UserService.updateUserInfo(userData.id, {
        ...formData.basic,
        ...formData.about,
        ...formData.contact,
        ...formData.professional,
      });

      await UserService.addNewSkills(formData.professional.userNewSkills);
      await UserService.updateUserSkills(
        userData.id,
        formData.professional.userSkills,
      );

      router.push("/profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error;
    }
  };
  const sections: Section[] = [
    { id: "basic", label: t("navigation.basicInfo"), iconName: "user" },
    { id: "about", label: t("navigation.about"), iconName: "userCircle" },
    {
      id: "professional",
      label: t("navigation.professional"),
      iconName: "briefcase",
    },
    { id: "contact", label: t("navigation.contact"), iconName: "mail" },
  ];

  return (
    <div className="flex h-full flex-col gap-8 lg:flex-row">
      <div className="lg:w-1/3 lg:overflow-y-auto">
        <FormStateNav sections={sections} onSubmit={handleSubmit} />
      </div>
      <div className="space-y-8 pb-8 lg:w-2/3 lg:overflow-y-auto">
        <BasicInfoSection userData={userData} lang={lang} />
        <AboutSection userData={userData} lang={lang} />
        <ProfessionalSection userData={userData} lang={lang} />
        <ContactSection userData={userData} lang={lang} />
      </div>
    </div>
  );
}
