import { ClientNavMenu } from "@/components/ClientNavMenu";
import { ConstructionIcon } from "@/components/icons/ConstructionIcon";
import { TextIconBox } from "@/components/text-icon-box";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { H2, HeroTitle, Lead, P } from "@/components/ui/typography";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { getServerTranslation } from "@/lib/i18n/init-server";
import { ArrowUpRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Book | Creative Contact",
  description:
    "Connect with Creative Contact's network of artists and creators.",
};

export default async function ContactsPage() {
  const { t } = await getServerTranslation("en", "HomePage");

  return (
    <BackgroundDiv shouldCenter={false} className="flex min-h-screen flex-col">
      {/* Header with logo and join button */}
      <header className="flex w-full items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 p-1"
          >
            <span className="text-xl font-bold text-black">CC</span>
          </Link>
        </div>

        <div className="flex items-center">
          <Button
            variant="link"
            asChild
            className="text-sm text-foreground hover:text-yellow-400"
          >
            <Link href="/signup">
              <TextIconBox
                title={t("joinUsLine1")}
                subtitle={t("joinUsLine2")}
                icon={
                  <ArrowUpRight
                    className="text-yellow-400"
                    style={{ height: "125%", width: "125%" }}
                  />
                }
                className="text-sm"
              />
            </Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-0 flex flex-1 flex-col">
        {/* Header section */}
        <div className="flex h-[30vh] max-h-[30vh] flex-col justify-center px-12">
          <HeroTitle className="whitespace-pre-line font-bold" size="medium">
            Contact Book
          </HeroTitle>

          {/* Navigation row */}
          <div className="flex w-full items-center justify-end py-6">
            <ClientNavMenu
              items={[
                { text: t("aboutCC"), href: "/about" },
                { text: t("contactBook"), href: "/contacts" },
                { text: t("event"), href: "/events" },
              ]}
              menuText={t("menu")}
            />
          </div>
        </div>

        {/* Content section */}
        <div className="flex-1 space-y-10 overflow-y-auto px-12 pb-12">
          <Lead className="whitespace-pre-line text-xl text-foreground/90 md:text-2xl">
            Connect with our network of artists, creators, and collaborators.
          </Lead>

          <Separator className="bg-white/10" />

          {/* Contact Directory Section */}
          <div className="mt-12">
            <H2 className="text-foreground/90">Directory</H2>
            <P className="mt-2 text-foreground/70">
              Browse our network of creative professionals and organizations.
            </P>

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Placeholder contact cards */}
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <ContactCard
                    key={i}
                    name={`Creative ${i + 1}`}
                    role={
                      [
                        "Artist",
                        "Designer",
                        "Photographer",
                        "Writer",
                        "Musician",
                        "Filmmaker",
                      ][i % 6]
                    }
                    location="Ho Chi Minh City"
                    tags={[
                      "Design",
                      "Digital",
                      "Art",
                      "Music",
                      "Film",
                      "Writing",
                    ].slice(0, (i % 3) + 1)}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer ticker */}
      <footer className="w-full overflow-hidden bg-yellow-400 py-3 text-black">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <span
                key={i}
                className="mx-4 text-base font-medium"
              >{`Connect with our creative network • Creative Contact`}</span>
            ))}
        </div>
      </footer>
    </BackgroundDiv>
  );
}

interface ContactCardProps {
  name: string;
  role: string;
  location: string;
  tags: string[];
}

function ContactCard({ name, role, location, tags }: ContactCardProps) {
  return (
    <Card className="relative flex h-full flex-col overflow-hidden border-0 bg-white/10 backdrop-blur-xs transition-all hover:bg-white/15">
      {/* Construction banner */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-center gap-2 bg-yellow-400 px-2 py-1">
        <ConstructionIcon className="h-5 w-5 text-black" />
        <span className="text-xs font-medium text-black">
          Under Construction
        </span>
      </div>

      <CardHeader className="pt-8">
        {" "}
        {/* Add padding-top to accommodate the banner */}
        <CardTitle className="text-foreground">{name}</CardTitle>
        <CardDescription className="text-foreground/70">{role}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <P className="text-foreground/80">{location}</P>

        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          asChild
          className="w-full bg-white/10 text-foreground hover:bg-white/20"
        >
          <Link href="#">View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
