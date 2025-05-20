import { ClientNavMenu } from "@/components/ClientNavMenu";
import ContactSwimLane from "@/components/contacts/ContactSwimLane";
import { ConstructionIcon } from "@/components/icons/ConstructionIcon";
import { TextIconBox } from "@/components/text-icon-box";
import { Button } from "@/components/ui/button";
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

// Dummy contact data for demonstration
const dummyContacts = Array(6)
  .fill(0)
  .map((_, i) => ({
    contactId: `contact-${i + 1}`,
    name: `Creative ${i + 1}`,
    role:
      [
        "Artist",
        "Designer",
        "Photographer",
        "Writer",
        "Musician",
        "Filmmaker",
      ][i % 6],
    location: "Ho Chi Minh City",
    slug: `creative-${i + 1}`,
    profilePictureUrl: undefined, // Using placeholder for now
    tags: ["Design", "Digital", "Art", "Music", "Film", "Writing"].slice(
      0,
      (i % 3) + 1,
    ),
  }));

export default async function ContactsPage() {
  const { t } = await getServerTranslation("en", "HomePage");

  return (
    <BackgroundDiv shouldCenter={false} className="flex min-h-screen flex-col">
      {/* Header with logo and join button */}
      <header className="flex w-full items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-sunglow p-1"
          >
            <span className="text-xl font-bold text-black">CC</span>
          </Link>
        </div>

        <div className="flex items-center">
          <Button
            variant="link"
            asChild
            className="text-sm text-foreground hover:text-sunglow"
          >
            <Link href="/signup">
              <TextIconBox
                title={t("joinUsLine1")}
                subtitle={t("joinUsLine2")}
                icon={
                  <ArrowUpRight
                    className="text-sunglow"
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
        <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-12 md:px-12">
          <Lead className="whitespace-pre-line px-8 text-xl text-foreground/90 md:px-0 md:text-2xl">
            Connect with our network of artists, creators, and collaborators.
          </Lead>

          <div className="px-8 md:px-0">
            <Separator className="bg-white/10" />
          </div>

          {/* Contact Directory Section */}
          <div className="mt-8">
            <div className="px-8 md:px-0">
              <H2 className="text-foreground/90">Directory</H2>
              <P className="mt-2 text-foreground/70">
                Browse our network of creative professionals and organizations.
              </P>
            </div>
            {/* Placeholder for construction banner/info if needed */}
            <div className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 transform items-center justify-center gap-2 rounded-md bg-sunglow px-3 py-1.5">
              <ConstructionIcon className="h-5 w-5 text-black" />
              <span className="text-sm font-medium text-black">
                Contact Display Under Construction
              </span>
            </div>

            {/* Replaced Grid with a simple div for swimlanes */}
            <div className="mt-6 flex flex-col">
              {dummyContacts.map((contact, i) => (
                <ContactSwimLane
                  key={contact.contactId}
                  contactId={contact.contactId}
                  name={contact.name}
                  role={contact.role}
                  location={contact.location}
                  slug={contact.slug}
                  profilePictureUrl={contact.profilePictureUrl}
                  tags={contact.tags}
                  rowIndex={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer ticker */}
      <footer className="w-full overflow-hidden bg-sunglow py-3 text-black">
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
