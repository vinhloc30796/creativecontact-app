// File: app/(protected)/profile/page.tsx

"use server";

// API imports
import { UserData } from "@/app/types/UserInfo";

// UI imports
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ComboBadge } from "@/components/ui/combo-badge";

// Schema imports
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";

// Utility imports
import { getSocialMediaLinks } from "@/utils/social_media";
import { TFunction } from "i18next";

// Icon imports
import { getFormattedPhoneNumber } from "@/lib/phone";
import {
  CheckCircle,
  Image,
  Mail,
  MapPin,
  Pencil,
  Phone,
  UserCircle,
} from "lucide-react";

// Local component import
interface UserSkills {
  id: number;
  name: string;
}

function ProfileCard({
  t,
  userData,
  userSkills,
  portfolioArtworks,
  showButtons = false,
}: {
  t: TFunction;
  userData: UserData;
  userSkills: UserSkills[];
  portfolioArtworks: PortfolioArtworkWithDetails[];
  showButtons?: boolean;
}) {
  const name =
    userData.displayName || `${userData.firstName} ${userData.lastName}`;
  const userName = userData.userName || "";
  const profilePictureUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_pictures/${userData.profilePicture}`;
  const phoneNumber = getFormattedPhoneNumber(userData);

  return (
    <Card className="flex h-fit flex-col overflow-auto">
      <CardHeader className="flex flex-col items-center">
        <div className="mb-4 h-24 w-24 overflow-hidden rounded-lg">
          <img
            src={profilePictureUrl}
            alt={`${name}'s profile`}
            className="h-full w-full object-cover"
          />
        </div>
        <CardTitle className="mb-2 flex items-center text-2xl font-bold">
          <UserCircle className="mr-2 h-6 w-6" />
          {name}
        </CardTitle>
        {userName && (
          <p className="mb-2 flex items-center text-sm text-gray-500">
            @{userName}
          </p>
        )}
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
        <p className="mb-4 flex items-center text-sm text-gray-500">
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
          {userData.industryExperiences &&
            userData.industryExperiences.length > 0 && (
              <section data-section="industry">
                <h3 className="mb-2 text-lg font-semibold">{t("industry")}</h3>
                <div className="flex flex-wrap gap-2">
                  {userData.industryExperiences.map((exp) => (
                    <ComboBadge
                      key={`${exp.industry}-${exp.experienceLevel}`}
                      leftContent={exp.industry}
                      rightContent={exp.experienceLevel}
                      leftColor="bg-primary"
                      rightColor="bg-secondary"
                    />
                  ))}
                </div>
              </section>
            )}
          {userSkills && userSkills.length > 0 && (
            <section data-section="skills">
              <h3 className="mb-2 text-lg font-semibold">{t("skills")}</h3>
              <div className="flex flex-wrap gap-2">
                {userSkills.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="text-xs">
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
                {getSocialMediaLinks(userData).map(
                  (link, index) =>
                    link &&
                    link.url && (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-600"
                      >
                        <link.icon className="h-6 w-6" />
                      </a>
                    ),
                )}
              </div>
            </section>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { ProfileCard };
