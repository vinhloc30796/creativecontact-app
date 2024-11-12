"use server";

import { fetchUserContacts } from "@/app/api/user/[id]/contacts/helper";
import { fetchUserPortfolioArtworks } from "@/app/api/user/[id]/portfolio-artworks/helper";
import { fetchUserData } from "@/app/api/user/helper";
import { UserData } from "@/app/types/UserInfo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { UserHeader } from "@/components/wrappers/UserHeader";
import { PortfolioArtwork } from "@/drizzle/schema/portfolio";
import { useServerAuth } from "@/hooks/useServerAuth";
import { useTranslation } from "@/lib/i18n/init-server";
import { getSocialMediaLinks } from "@/utils/social_media";
import { TFunction } from "i18next";
import { Briefcase, CheckCircle, Image, Mail, MapPin, Pencil, Phone, TrendingUp, UserCircle } from 'lucide-react';
import { redirect } from "next/navigation";

interface ProfilePageProps {
  params: {
  };
  searchParams: {
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

async function getUserContacts(userId?: string): Promise<UserData[]> {
  if (!userId) {
    return [];
  }

  const contacts = await fetchUserContacts(userId);

  // Map UserInfo to UserData
  return contacts.map(contact => ({
    ...contact,
    email: '', // Add a default empty string or fetch the actual email
    isAnonymous: false, // Set a default value
    emailConfirmedAt: null, // Set a default value
  }));
}



function getFormattedPhoneNumber(userData: UserData) {
  if (userData.phoneNumber && userData.phoneCountryCode) {
    return `+${userData.phoneCountryCode} ${userData.phoneNumber}`;
  }
  return null;
}

function ProfileCard({
  t,
  userData,
  userSkills,
  portfolioArtworks,
  showButtons = false
}: {
  t: TFunction;
  userData: UserData;
  userSkills: UserSkills[];
  portfolioArtworks: PortfolioArtwork[];
  showButtons?: boolean;
}) {
  const name = userData.displayName || `${userData.firstName} ${userData.lastName}`;
  const profilePictureUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_pictures/${userData.profilePicture}`;
  const phoneNumber = getFormattedPhoneNumber(userData);

  return (
    <div className="mt-6 w-full overflow-y-auto lg:mt-0 lg:w-1/3 lg:pl-6">
      <Card className="flex flex-col h-full">
        <CardHeader className="flex flex-col items-center">
          <div className="mb-4 w-24 h-24 overflow-hidden rounded-lg">
            <img
              src={profilePictureUrl}
              alt={`${name}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>
          <CardTitle className="mb-2 text-2xl font-bold flex items-center">
            <UserCircle className="mr-2 h-6 w-6" />
            {name}
          </CardTitle>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="success" className="flex items-center">
              <CheckCircle className="mr-1 h-3 w-3" />
              {t("openToCollab")}
            </Badge>
            <Badge variant="secondary" className="flex items-center">
              <Image className="mr-1 h-3 w-3" />
              {portfolioArtworks.length} {t("artworks")}
            </Badge>
          </div>
          <p className="mb-4 text-sm text-gray-500 flex items-center">
            <MapPin className="mr-1 h-4 w-4" />
            {userData.location}
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/profile/edit">
                <Pencil className="mr-1 h-4 w-4" />
                {t("edit")}
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/profile/portfolio">
                <Image className="mr-1 h-4 w-4" />
                {t("portfolio")}
              </a>
            </Button>
          </div>
          {userData.about && (
            <section data-section="about" className="pt-4">
              <h3 className="mb-2 text-lg font-semibold">{t("about")}</h3>
              <p>{userData.about}</p>
            </section>
          )}
        </CardHeader>
        <Separator className="my-4" />
        <CardContent className="mt-4">
          <div className="space-y-6">
            {userData.industries && userData.industries.length > 0 && (
              <section data-section="industry">
                <h3 className="mb-2 text-lg font-semibold">{t("industry")}</h3>
                <div className="flex flex-wrap gap-2">
                  {userData.industries.map((industry) => (
                    <Badge
                      key={industry}
                      variant="default"
                      className="text-xs"
                    >
                      {industry}
                    </Badge>
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
                    <Badge
                      key={skill.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
            <Separator className="my-4" />
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
                {phoneNumber && (
                  <li className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    <a
                      href={`tel:${phoneNumber}`}
                      className="text-primary hover:underline"
                    >
                      {phoneNumber}
                    </a>
                  </li>
                )}
              </ul>
            </section>
            <Separator className="my-4" />
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
    </div >
  );
}

function ContactCard({
  t,
  userData,
  showButtons = false
}: {
  t: TFunction;
  userData: UserData;
  showButtons?: boolean;
}) {
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E0E0E0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%23757575' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
  const profilePictureUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_pictures/${userData.profilePicture}`;
  const contactImage = profilePictureUrl || placeholderImage;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-0 overflow-hidden">
        <div className="relative w-full h-48">
          <img
            src={contactImage}
            alt={`${userData.displayName}'s profile`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <CardTitle className="text-2xl font-bold flex items-center mb-2">
              <UserCircle className="mr-2 h-6 w-6" />
              {userData.displayName}
            </CardTitle>
            <div className="mb-2 flex items-center">
              <Badge variant="success" className="flex items-center">
                <CheckCircle className="mr-1 h-3 w-3" />
                {t("openToCollab")}
              </Badge>
            </div>
          </div>

        </div>
      </CardHeader>

      <CardContent className="flex-grow p-4">
        <ul className="space-y-3">
          {userData.industries && userData.industries.length > 0 && (
            <li className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4 flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                {userData.industries.map((industry, index) => (
                  <Badge key={index} variant="secondary">{industry}</Badge>
                ))}
              </div>
            </li>
          )}
          {userData.experience && (
            <li className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>{userData.experience}</span>
            </li>
          )}
          {userData.location && (
            <li className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>{userData.location}</span>
            </li>
          )}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto p-4 pt-2 border-t">
        <a href="#" className="text-primary hover:underline">
          {t("seeMore")}
        </a>
      </CardFooter>
    </Card>
  );
}

export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
  // User
  const lang = searchParams.lang || "en";
  const { t } = await useTranslation(lang, "ProfilePage");
  const { user, isLoggedIn, isAnonymous } = await useServerAuth();

  if (!isLoggedIn || isAnonymous) {
    redirect("/login");
  }

  // Fetch user data and portfolio artworks in parallel
  let userData: UserData | null = null;
  let portfolioArtworks: PortfolioArtwork[] = [];
  if (user) {
    const [userDataResult, portfolioArtworksResult] = await Promise.allSettled([
      fetchUserData(user.id),
      fetchUserPortfolioArtworks(user.id)
    ]);
    // Handle user data
    if (userDataResult.status === 'fulfilled') {
      userData = userDataResult.value;
    } else {
      console.error("Error fetching user data:", userDataResult.reason);
    }

    // Handle portfolio artworks
    if (portfolioArtworksResult.status === 'fulfilled') {
      portfolioArtworks = portfolioArtworksResult.value;
    } else {
      console.error("Error fetching portfolio artworks:", portfolioArtworksResult.reason);
    }
  }

  // Fetch user skills
  const userSkills = await getUserSkills(userData?.id);

  // Image
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E0E0E0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%23757575' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
  const contactImage = placeholderImage; // TODO: Implement actual image fetching logic

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
                <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                  {userData && (
                    <>
                      {getUserContacts(userData.id).then((contacts) => {
                        if (contacts.length === 0) {
                          return (
                            <div className="col-span-full">
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="text-center">
                                    <p className="text-gray-500">Please connect with other users to see their profiles here.</p>
                                    <Button className="mt-4">
                                      Find Contacts
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          );
                        }
                        return contacts.map((contact) => (
                          <ContactCard
                            key={contact.id}
                            t={t}
                            userData={contact}
                            showButtons={false}
                          />
                        ));
                      })}
                    </>
                  )}
                </div>
              </div>
              {userData && (
                <ProfileCard
                  t={t}
                  userData={userData}
                  userSkills={userSkills}
                  portfolioArtworks={portfolioArtworks}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </BackgroundDiv>
  );
}
