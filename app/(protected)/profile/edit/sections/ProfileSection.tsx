"use client";

import { UserData } from "@/app/types/UserInfo";
import { Section, FormStateNav } from "../FormStateNav";
import { ProfessionalSection } from "@/components/profile/ProfessionalSection";
import { BasicInfoSection } from "./BasicInfoSection";
import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";

interface ProfileEditFormProps {
  userData: UserData;
  sections: Section[];
  navTranslations: {
    editProfile: string;
    basicInfo: string;
    about: string;
    professional: string;
    contact: string;
    saveChanges: string;
  };
  basicInfoTranslations: {
    basicInfo: string;
    firstName: string;
    lastName: string;
    displayName: string;
    location: string;
  };
  aboutTranslations: {
    about: string;
    placeholder: string;
  };
  contactTranslations: {
    contact: string;
    email: string;
    phone: string;
    socialLinks: string;
    instagram: string;
    facebook: string;
  };
  professionalTranslations: {
    professional: string;
    currentIndustries: string;
    experience: string;
    select: string;
    search: string;
    noExperienceFound: string;
  };
}

export function ProfileEditForm({
  userData,
  sections,
  navTranslations,
  basicInfoTranslations,
  aboutTranslations,
  contactTranslations,
  professionalTranslations,
}: ProfileEditFormProps) {
  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      console.log('Submitting form data:', formData);
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 overflow-y-hidden">
      {/* Left Navigation */}
      <FormStateNav 
        sections={sections} 
        translations={navTranslations} 
        onSubmit={handleSubmit}
      />

      {/* Right Content */}
      <div className="lg:w-2/3 overflow-y-clip">
        <div className="space-y-8 overflow-y-scroll">
          <BasicInfoSection userData={userData} translations={basicInfoTranslations} />
          <AboutSection userData={userData} translations={aboutTranslations} />
          <ProfessionalSection userData={userData} translations={professionalTranslations} />
          <ContactSection userData={userData} translations={contactTranslations} />
          <div className="h-20"></div> {/* Padding at the end */}
        </div>
      </div>
    </div>
  );
}