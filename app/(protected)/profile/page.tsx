"use server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { UserHeader } from "@/components/wrappers/UserHeader";
import { useTranslation } from "@/lib/i18n/init-server";
import { SiGithub, SiLinkedin, SiX } from "@icons-pack/react-simple-icons";


interface ProfilePageProps {
  params: {
    lang: string;
  };
}

async function getUserSkills(userId?: string) {
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


export default async function ProfilePage({ params }: ProfilePageProps) {
  const lang = params.lang || "en";
  const { t } = await useTranslation(lang, "ProfilePage");

  return (
    <BackgroundDiv>
      <div className="min-h-screen flex flex-col w-full">
        <UserHeader lang={lang} className="bg-background/80 backdrop-blur-sm" />
        <main className="flex-grow mt-10 lg:mt-20 relative z-20 justify-between w-full">
          <div className="w-full px-4 sm:px-8 md:px-16">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-2/3 overflow-y-auto pr-0 lg:pr-6">
                <div className="mb-6">
                  <nav className="flex space-x-4">
                    <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">{t("overview")}</a>
                    <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">{t("activity")}</a>
                    <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">{t("settings")}</a>
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
              <div className="w-full lg:w-1/3 overflow-y-auto mt-6 lg:mt-0 lg:pl-6">
                <Card className="p-6">
                  <CardHeader className="flex flex-col items-center">
                    <CardTitle className="text-2xl font-bold mb-2">{t("profileName")}</CardTitle>
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{t("openToCollab")}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{t("location")}</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">{t("message")}</Button>
                      <Button variant="outline" size="sm">{t("connect")}</Button>
                      <Button variant="outline" size="sm">{t("share")}</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-lg font-semibold mb-2">{t("bio")}</h3>
                        <p>{t("userBio")}</p>
                      </section>
                      <section>
                        <h3 className="text-lg font-semibold mb-2">{t("industry")}</h3>
                        <p>{t("userIndustry")}</p>
                      </section>
                      <section>
                        <h3 className="text-lg font-semibold mb-2">{t("level")}</h3>
                        <p>{t("userLevel")}</p>
                      </section>
                      <section>
                        <h3 className="text-lg font-semibold mb-2">{t("skills")}</h3>
                        <div className="flex flex-wrap gap-2">
                          {(await getUserSkills()).map((skill) => (
                            <span key={skill.id} className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </section>
                      <section>
                        <h3 className="text-lg font-semibold mb-2">{t("contact")}</h3>
                        <p>
                          <a href={`mailto:${t("userEmail")}`} className="text-primary hover:underline">
                            {t("userEmail")}
                          </a>
                        </p>
                        <p>
                          <a href={`tel:${t("userPhone")}`} className="text-primary hover:underline">
                            {t("userPhone")}
                          </a>
                        </p>
                      </section>
                      <section>
                        <h3 className="text-lg font-semibold mb-2">{t("socialLinks")}</h3>
                        <div className="flex space-x-4">
                          <a href={t("userLinkedIn")} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-600">
                            <SiLinkedin className="w-6 h-6" />
                          </a>
                          <a href={t("userTwitter")} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-600">
                            <SiX className="w-6 h-6" />
                          </a>
                          <a href={t("userGitHub")} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-600">
                            <SiGithub className="w-6 h-6" />
                          </a>
                        </div>
                      </section>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BackgroundDiv>
  );
}
