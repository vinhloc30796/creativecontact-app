"use server";

import { fetchUserData } from "@/app/api/user/helper";
import { UserData } from "@/app/types/UserInfo";
import { ProfessionalSection } from "@/components/profile/ProfessionalSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { UserHeader } from "@/components/wrappers/UserHeader";
import { useServerAuth } from "@/hooks/useServerAuth";
import { useTranslation } from "@/lib/i18n/init-server";
import { Briefcase, Mail, MapPin, Phone, User, UserCircle } from 'lucide-react';
import { redirect } from "next/navigation";

interface ProfileEditPageProps {
  params: {};
  searchParams: {
    lang: string;
  };
}

function BasicInfoSection({ userData, t }: { userData: UserData, t: (key: string) => string }) {
  return (
    <Card id="basic">
      <CardHeader>
        <CardTitle>{t("basicInfo")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">{t("firstName")}</Label>
            <Input id="firstName" defaultValue={userData.firstName || ''} className="max-w-md" />
          </div>
          <div>
            <Label htmlFor="lastName">{t("lastName")}</Label>
            <Input id="lastName" defaultValue={userData.lastName || ''} className="max-w-md" />
          </div>
        </div>
        <div>
          <Label htmlFor="displayName">{t("displayName")}</Label>
          <Input id="displayName" defaultValue={userData.displayName || ''} className="max-w-md" />
        </div>
        <div>
          <Label htmlFor="location">{t("location")}</Label>
          <div className="relative max-w-md">
            <Input
              id="location"
              defaultValue={userData.location || ''}
            />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AboutSection({ userData, t }: { userData: UserData, t: (key: string) => string }) {
  return (
    <Card id="about">
      <CardHeader>
        <CardTitle>{t("about")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea id="about" defaultValue={userData.about || ''} rows={4} className="max-w-2xl" />
      </CardContent>
    </Card>
  )
}

function ContactSection({ userData, t }: { userData: UserData, t: (key: string) => string }) {
  return (
    <Card id="contact">
      <CardHeader>
        <CardTitle>{t("contact")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">{t("email")}</Label>
          <div className="relative max-w-md">
            <Input
              id="email"
              type="email"
              defaultValue={userData.email || ''}
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div>
          <Label htmlFor="phone">{t("phone")}</Label>
          <div className="relative max-w-md">
            <Input
              id="phone"
              type="tel"
              defaultValue={userData.phone || ''}
            />
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <Separator />
        <div>
          <Label>{t("socialLinks")}</Label>
          <div className="grid grid-cols-2 gap-4 mt-2 max-w-2xl">
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                defaultValue={userData.instagramHandle || ''}
                placeholder="@username"
              />
            </div>
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                defaultValue={userData.facebookHandle || ''}
                placeholder="username"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



export default async function ProfileEditPage({ params, searchParams }: ProfileEditPageProps) {
  const lang = searchParams.lang || "en";
  const { t } = await useTranslation(lang, "ProfilePage");
  const { user, isLoggedIn, isAnonymous } = await useServerAuth();

  const professionalTranslations = {
    professional: t("ProfessionalSection.professional"),
    currentIndustries: t("ProfessionalSection.currentIndustries"),
    experience: t("ProfessionalSection.experience"),
    select: t("ProfessionalSection.select"),
    search: t("ProfessionalSection.search"),
    noExperienceFound: t("ProfessionalSection.noExperienceFound")
  }

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

  const sections = [
    { id: "basic", label: t("basicInfo"), icon: User },
    { id: "about", label: t("about"), icon: UserCircle },
    { id: "professional", label: t("professional"), icon: Briefcase },
    { id: "contact", label: t("contact"), icon: Mail },
  ];

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
            <div className="flex flex-col lg:flex-row gap-8 overflow-y-hidden">

              {/* Left Navigation */}
              <div id="left-nav" className="lg:w-1/3 flex flex-col">
                <div className="fixed lg:w-[calc(33.333%-2rem)]">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("editProfile")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <nav className="space-y-2">
                        {sections.map((section) => (
                          <a
                            key={section.id}
                            href={`#${section.id}`}
                            className="flex items-center p-2 hover:bg-accent rounded-lg transition-colors"
                          >
                            <section.icon className="mr-2 h-4 w-4" />
                            {section.label}
                          </a>
                        ))}
                      </nav>
                    </CardContent>
                  </Card>
                  <div id="left-nav-button" className="flex justify-end align-bottom space-x-4 pb-8 my-5">
                    <Button>{t("saveChanges")}</Button>
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="lg:w-2/3 overflow-y-clip">
                <div className="space-y-8 overflow-y-scroll">
                  <BasicInfoSection userData={userData} t={t} />
                  <AboutSection userData={userData} t={t} />
                  <ProfessionalSection userData={userData} translations={professionalTranslations} />
                  <ContactSection userData={userData} t={t} />
                  <div className="h-20"></div> {/* Padding at the end */}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div >
    </BackgroundDiv >
  );
}
