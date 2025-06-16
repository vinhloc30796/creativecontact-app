// File: app/(protected)/profile/page.tsx

"use client";

// External imports
import { useTranslation } from "@/lib/i18n/init-client";
import { useQuery } from "@tanstack/react-query";
import { Suspense, use } from "react";

// API imports
import { UserData } from "@/app/types/UserInfo";

// UI imports
import { Button } from "@/components/ui/button";

// Schema imports
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";

// Utility imports
import { getProfileImageUrl } from "@/utils/profile_image";
import { getSocialMediaLinks } from "@/utils/social_media";
import { getName } from "@/utils/user_name";

// Icon imports
import { getFormattedPhoneNumber } from "@/lib/phone";
import { MapPin, Pencil } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function SocialSubsection({
  userData,
  lang = "en",
}: {
  userData?: UserData;
  lang?: string;
}) {
  const { t } = useTranslation(lang, "ProfileCard");

  const emptyMessage = (
    <p className="text-sm text-muted-foreground">{t("noSocialLinks")}</p>
  );

  if (!userData) {
    return emptyMessage;
  }

  const socialLinks = getSocialMediaLinks(userData);
  if (socialLinks.length === 0) {
    return emptyMessage;
  }

  return socialLinks.map(
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
  );
}

interface ProfileCardProps {
  userData: UserData;
  portfolioArtworksPromise: Promise<PortfolioArtworkWithDetails[]>;
  showButtons?: boolean;
  lang?: string;
}

export function ProfileCard({
  userData,
  portfolioArtworksPromise,
  showButtons = false,
  lang = "en",
}: ProfileCardProps) {
  const { t } = useTranslation(lang, "ProfileCard", {
    useSuspense: false,
  });

  const name = getName(userData);
  const userName = userData.userName || "";
  const { data: profilePictureUrl, isLoading: isLoadingProfilePicture } =
    useQuery({
      queryKey: ["profilePicture", userData.id],
      queryFn: () => getProfileImageUrl(userData),
    });

  const userSkills = userData.userSkills;
  const phoneNumber = getFormattedPhoneNumber(userData);

  const portfolioArtworks = use(portfolioArtworksPromise);

  return (
    <div className="w-full bg-[#FCFAF5] border border-[#1A1A1A] overflow-hidden flex flex-col">
      {/* Pixel Art Section */}
      <div className="flex items-center justify-center py-10">
        <div className="w-60 h-[236px] bg-[#FCFAF5] relative">
          {/* Placeholder for pixel art - will be replaced with actual graphic */}
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">Pixel Art Placeholder</span>
          </div>
        </div>
      </div>

      {/* Name Banner */}
      <div className="bg-[#FFE12D] px-4 py-4 flex items-center justify-center border-t border-b border-[#1A1A1A]">
        <h1 className="text-[28px] font-bold uppercase tracking-[0.0357em] text-[#1A1A1A] text-center leading-[1.26]">
          {name}
        </h1>
      </div>

      {/* Status Section */}
      <div className="flex items-center justify-center gap-3 px-5 py-4 border-b border-[#1A1A1A] w-full">
        <div className="w-6 h-6 flex items-center justify-center">
          <div className="w-4 h-4 bg-[#00E22A] rounded-full"></div>
        </div>
        <span className="text-base font-medium text-[#1A1A1A]">{t("openToCollab")}</span>
      </div>
      <div className="flex items-center justify-center gap-3 px-5 py-4 border-b border-[#1A1A1A] w-full">
        <MapPin className="w-6 h-6 text-[#1A1A1A]" />
        <span className="text-base font-medium text-[#1A1A1A]">{userData.location || t("unsetLocation")}</span>
      </div>

      {/* Bio Section */}
      {userData.about && (
        <div className="px-6 py-8 border-b border-[#1A1A1A]">
          <h3 className="text-base font-extrabold uppercase tracking-[0.02em] text-[#1A1A1A] mb-2">bio</h3>
          <p className="text-base font-medium text-[#1A1A1A] leading-[1.26]">{userData.about}</p>
        </div>
      )}

      {/* Industry Section */}
      {userData.industryExperiences && userData.industryExperiences.length > 0 && (
        <div className="px-6 py-8 border-b border-[#1A1A1A]">
          <h3 className="text-base font-extrabold uppercase tracking-[0.02em] text-[#1A1A1A] mb-2">Industry</h3>
          <div className="flex flex-wrap gap-2">
            {userData.industryExperiences.map((exp) => (
              <span key={`${exp.industry}-${exp.experienceLevel}`} className="text-base font-medium text-[#1A1A1A]">
                {exp.industry}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Level Section */}
      {userData.industryExperiences && userData.industryExperiences.length > 0 && (
        <div className="px-6 py-8 border-b border-[#1A1A1A]">
          <h3 className="text-base font-extrabold uppercase tracking-[0.02em] text-[#1A1A1A] mb-2">level</h3>
          <div className="flex flex-wrap gap-2">
            {userData.industryExperiences.map((exp) => (
              <span key={`level-${exp.experienceLevel}`} className="text-base font-medium text-[#1A1A1A] tracking-[0.0625em]">
                {exp.experienceLevel}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="px-6 py-8">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            {userData.email && (
              <div className="flex flex-col gap-2">
                <h4 className="text-base font-extrabold uppercase tracking-[0.02em] text-[#1A1A1A]">email</h4>
                <a href={`mailto:${userData.email}`} className="text-base font-medium text-[#1A1A1A] tracking-[0.0625em] hover:underline">
                  {userData.email}
                </a>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {phoneNumber && (
              <div className="flex flex-col gap-2">
                <h4 className="text-base font-extrabold uppercase tracking-[0.02em] text-[#1A1A1A]">phone number</h4>
                <a href={`tel:${phoneNumber}`} className="text-base font-medium text-[#1A1A1A] tracking-[0.0625em] hover:underline">
                  {phoneNumber}
                </a>
              </div>
            )}
          </div>
          {/* Social Icons */}
          <div className="flex justify-center gap-8">
            <SocialSubsection userData={userData} lang={lang} />
          </div>
        </div>
      </div>

      {/* Edit Button */}
      {showButtons && (
        <div className="px-6 py-4 border-t border-[#1A1A1A]">
          <Button variant="outline" size="sm" asChild className="w-full">
            <a href="/profile/edit">
              <Pencil className="mr-1 h-4 w-4" />
              {t("edit")}
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
