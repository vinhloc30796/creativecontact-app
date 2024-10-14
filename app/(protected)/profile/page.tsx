"use server";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { UserHeader } from "@/components/wrappers/UserHeader";
import { useTranslation } from "@/lib/i18n/init-server";
import { SiGithub, SiLinkedin, SiX, SiFacebook, SiInstagram } from "@icons-pack/react-simple-icons";
import { useServerAuth } from "@/hooks/useServerAuth";
import { UserData } from "@/app/types/UserInfo";
import { fetchUserData } from "@/app/api/user/helper";
import { TFunction } from "i18next";
import { Mail, Phone, MapPin, UserCircle, CheckCircle, MessageSquare, UserPlus, Share2 } from 'lucide-react'
import { redirect } from "next/navigation";

interface ProfilePageProps {
  params: {
    lang: string;
  };
}

interface UserSkills {
  id: number;
  name: string;
}

async function getUserSkills(userId?: string): Promise<UserSkills[]> {
  // TODO: Implement actual skill fetching logic
  // This is a placeholder implementation
  return [
    { id: 1, name: "JavaScript" },
    { id: 2, name: "React" },
    { id: 3, name: "Node.js" },
    { id: 4, name: "TypeScript" },
    { id: 5, name: "GraphQL" },
  ];
}

const socialMediaMapper = {
  instagramHandle: {
    icon: SiInstagram,
    baseUrl: "https://instagram.com/",
  },
  facebookHandle: {
    icon: SiFacebook,
    baseUrl: "https://facebook.com/",
  },
};

function getSocialMediaLinks(userData: UserData) {
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



function ProfileCard({
  t,
  userData,
  userSkills,
  showButtons = false
}: {
  t: TFunction;
  userData: UserData;
  userSkills: UserSkills[];
  showButtons?: boolean;
}) {
  return (
    <div className="mt-6 w-full overflow-y-auto lg:mt-0 lg:w-1/3 lg:pl-6">
      <Card className="p-6">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="mb-2 text-2xl font-bold flex items-center">
            <UserCircle className="mr-2 h-6 w-6" />
            {userData.firstName} {userData.lastName}
          </CardTitle>
          <div className="mb-2 flex items-center">
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 flex items-center">
              <CheckCircle className="mr-1 h-3 w-3" />
              {t("openToCollab")}
            </span>
          </div>
          <p className="mb-4 text-sm text-gray-500 flex items-center">
            <MapPin className="mr-1 h-4 w-4" />
            {userData.location}
          </p>
          {showButtons && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="mr-1 h-4 w-4" />
                {t("message")}
              </Button>
              <Button variant="outline" size="sm">
                <UserPlus className="mr-1 h-4 w-4" />
                {t("connect")}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-1 h-4 w-4" />
                {t("share")}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {userData.about && (
              <section data-section="about">
                <h3 className="mb-2 text-lg font-semibold">{t("about")}</h3>
                <p>{userData.about}</p>
              </section>
            )}
            {userData.industries && userData.industries.length > 0 && (
              <section data-section="industry">
                <h3 className="mb-2 text-lg font-semibold">{t("industry")}</h3>
                <div className="flex flex-wrap gap-2">
                  {userData.industries.map((industry) => (
                    <span
                      key={industry}
                      className="rounded-full bg-primary-100 px-2 py-1 text-xs text-primary-800"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </section>
            )}
            {userData.experience && (
              <section data-section="experience">
                <h3 className="mb-2 text-lg font-semibold">{t("experience")}</h3>
                <p>{userData.experience}</p>
              </section>
            )}
            {userSkills && userSkills.length > 0 && (
              <section data-section="skills">
                <h3 className="mb-2 text-lg font-semibold">{t("skills")}</h3>
                <div className="flex flex-wrap gap-2">
                {userSkills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full bg-primary-100 px-2 py-1 text-xs text-primary-800"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
              </section>
            )}
            <section data-section="contact">
              <h3 className="mb-2 text-lg font-semibold">{t("contact")}</h3>
              <ul className="space-y-2">
                {userData.email && (
                  <li className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <a
                      href={`mailto:${userData.email}`}
                      className="text-primary hover:underline"
                    >
                      {userData.email}
                    </a>
                  </li>
                )}
                {userData.phone && (
                  <li className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    <a
                      href={`tel:${userData.phone}`}
                      className="text-primary hover:underline"
                    >
                      {userData.phone}
                    </a>
                  </li>
                )}
              </ul>
            </section>
            {userData && (
              <section data-section="social-links">
                <h3 className="mb-2 text-lg font-semibold">{t("socialLinks")}</h3>
                <div className="flex space-x-4">
                  {getSocialMediaLinks(userData).map((link, index) => (
                    link && link.url && (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-600"
                      >
                        <link.icon className="h-6 w-6" />
                      </a>
                    )
                  ))}
                </div>
              </section>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  // User
  const lang = params.lang || "en";
  const { t } = await useTranslation(lang, "ProfilePage");
  const { user, isLoggedIn, isAnonymous } = await useServerAuth();

  if (!isLoggedIn || isAnonymous) {
    redirect("/login");
  }

  // Fetch user data
  let userData: UserData | null = null;
  if (user) {
    try {
      userData = await fetchUserData(user.id);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  }

  // Fetch user skills
  const userSkills = await getUserSkills(userData?.id);

  return (
    <BackgroundDiv>
      <div className="flex min-h-screen w-full flex-col">
        <UserHeader
          lang={lang}
          isLoggedIn={isLoggedIn}
          className="bg-background/80 backdrop-blur-sm"
        />
        <main className="relative z-20 mt-10 w-full flex-grow justify-between lg:mt-20">
          <div className="w-full px-4 sm:px-8 md:px-16">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full overflow-y-auto pr-0 lg:w-2/3 lg:pr-6">
                <div className="mb-6">
                  <nav className="flex space-x-4">
                    <a
                      href="#"
                      className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      {t("overview")}
                    </a>
                    <a
                      href="#"
                      className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      {t("activity")}
                    </a>
                    <a
                      href="#"
                      className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      {t("settings")}
                    </a>
                  </nav>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("card1Title")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{t("card1Content")}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("card2Title")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{t("card2Content")}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("card3Title")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{t("card3Content")}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              {userData && (
                <ProfileCard
                  t={t}
                  userData={userData}
                  userSkills={userSkills}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </BackgroundDiv>
  );
}
