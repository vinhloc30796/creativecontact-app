import { UserData } from "@/app/types/UserInfo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TFunction } from "i18next";
import { Briefcase, CheckCircle, MapPin, TrendingUp, UserCircle } from 'lucide-react';

interface ContactCardProps {
  t: TFunction;
  userData: UserData;
  showButtons?: boolean;
}

export function ContactCard({
  t,
  userData,
  showButtons = false
}: ContactCardProps) {
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