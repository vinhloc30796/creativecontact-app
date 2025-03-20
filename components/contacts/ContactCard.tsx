"use client";

import { UserData } from "@/app/types/UserInfo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ComboBadge } from "@/components/ui/combo-badge";
import { useTranslation } from "@/lib/i18n/init-client";
import { getProfileImageUrl } from "@/utils/profile_image";
import { getName } from "@/utils/user_name";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, CheckCircle, MapPin, UserCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContactCardProps {
  userData: UserData;
  showButtons?: boolean;
  lang?: string;
}

export function ContactCard({
  userData,
  showButtons = false,
  lang = "en",
}: ContactCardProps) {
  const { t } = useTranslation(lang, "ProfilePage", {
    useSuspense: false,
  });
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E0E0E0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%23757575' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
  const name = getName(userData);
  const userName = userData.userName;
  const { data: profilePictureUrl, isLoading } = useQuery({
    queryKey: ['profilePicture', userData.id],
    queryFn: () => getProfileImageUrl(userData),
  });
  const contactImage = isLoading ? placeholderImage : (profilePictureUrl || placeholderImage);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-0 overflow-hidden">
        <div className="relative w-full h-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={contactImage}
            alt={`${name}'s profile`}
            className={`w-full h-full object-cover ${isLoading ? 'animate-pulse' : ''}`}
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black opacity-50"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <CardTitle className="text-2xl font-bold flex items-center mb-2">
              <UserCircle className="mr-2 h-6 w-6" />
              {userData.displayName}
            </CardTitle>
            {userName && (
              <p className="mb-2 flex items-center text-sm text-gray-200">
                @{userName}
              </p>
            )}
            <div className="mb-2 flex items-center">
              <Badge variant="success" className="flex items-center">
                <CheckCircle className="mr-1 h-3 w-3" />
                {t("openToCollab")}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grow p-4">
        <ul className="space-y-3">
          {userData.industryExperiences && userData.industryExperiences.length > 0 && (
            <li className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4 shrink-0" />
              <div className="flex flex-wrap gap-2">
                {userData.industryExperiences.map((exp, index) => (
                  <ComboBadge
                    key={index}
                    leftContent={exp.industry}
                    rightContent={exp.experienceLevel}
                    leftColor="bg-primary"
                    rightColor="bg-primary/80"
                  />
                ))}
              </div>
            </li>
          )}
          {userData.location && (
            <li className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 shrink-0" />
              <span>{userData.location}</span>
            </li>
          )}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto p-4 pt-2 border-t">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                {userName ? (
                  <Button variant="link" className="p-0" asChild>
                    <a href={`/user/${userName}`}>
                      {t("seeMore")}
                    </a>
                  </Button>
                ) : (
                  <Button variant="link" className="p-0" disabled>
                    <span>{t("seeMore")}</span>
                  </Button>
                )}
              </div>
            </TooltipTrigger>
            {!userName && (
              <TooltipContent>
                <p>{t("userProfileNotAvailable")}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
} 