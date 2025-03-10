import { ArrowUpRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { JSX, SVGProps } from "react";

import { ClientNavMenu } from "@/components/ClientNavMenu";
import { TextIconBox } from "@/components/text-icon-box";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { H2, HeroTitle, Lead, P } from "@/components/ui/typography";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { getServerTranslation } from "@/lib/i18n/init-server";

export const metadata: Metadata = {
  title: "About | Creative Contact",
  description:
    "Learn about Creative Contact's mission, vision, and the team behind our creative community.",
};

export default async function AboutPage() {
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
            <Link href="/join">
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
            About Us
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
            Creative Contact is a community platform connecting artists,
            designers, and creative professionals in Vietnam.
          </Lead>

          <Separator className="bg-white/10" />

          {/* Mission Section */}
          <div className="mt-12">
            <H2 className="text-foreground/90">Our Mission</H2>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <div>
                <P className="text-foreground/80">
                  Creative Contact was founded with a simple yet powerful
                  mission: to foster collaboration, innovation, and growth
                  within Vietnam's creative community. We believe that by
                  connecting talented individuals across different disciplines,
                  we can create a thriving ecosystem where creativity
                  flourishes.
                </P>
                <P className="mt-4 text-foreground/80">
                  Our platform serves as a bridge between artists, designers,
                  writers, musicians, filmmakers, and other creative
                  professionals, providing them with opportunities to showcase
                  their work, find collaborators, and access resources that help
                  them advance their careers.
                </P>
              </div>
              <div className="relative h-64 w-full overflow-hidden rounded-lg md:h-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-purple-500/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    Creative Vision
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mt-16">
            <H2 className="text-foreground/90">Our Values</H2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/20">
                  <span className="text-xl font-bold text-yellow-400">01</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Collaboration
                </h3>
                <P className="text-foreground/80">
                  We believe that the most innovative ideas emerge when diverse
                  perspectives come together.
                </P>
              </div>

              <div className="rounded-lg bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/20">
                  <span className="text-xl font-bold text-yellow-400">02</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Inclusivity
                </h3>
                <P className="text-foreground/80">
                  Our community welcomes creators from all backgrounds,
                  disciplines, and experience levels.
                </P>
              </div>

              <div className="rounded-lg bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/20">
                  <span className="text-xl font-bold text-yellow-400">03</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Innovation
                </h3>
                <P className="text-foreground/80">
                  We encourage experimentation and pushing boundaries in
                  creative expression.
                </P>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mt-16">
            <H2 className="text-foreground/90">Our Team</H2>
            <P className="mt-2 text-foreground/70">
              Meet the passionate individuals behind Creative Contact.
            </P>

            <div className="mt-6 grid gap-6 md:grid-cols-4">
              {/* Team members */}
              {[
                { name: "Team Member 1", role: "Founder & Creative Director" },
                { name: "Team Member 2", role: "Community Manager" },
                { name: "Team Member 3", role: "Event Coordinator" },
                { name: "Team Member 4", role: "Technical Lead" },
              ].map((member, i) => (
                <div
                  key={i}
                  className="relative rounded-lg border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
                >
                  {/* Construction banner */}
                  <div className="absolute left-0 right-0 top-0 flex items-center justify-center gap-2 rounded-t-lg bg-yellow-400 px-2 py-1">
                    <ConstructionIcon className="h-5 w-5 text-black" />
                    <span className="text-xs font-medium text-black">
                      Under Construction
                    </span>
                  </div>

                  {/* Profile content */}
                  <div className="mt-6">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-md bg-white/10">
                      <span className="text-4xl font-bold text-white/50">
                        {String.fromCharCode(65 + i)}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm text-foreground/70">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Join Us CTA */}
          <div className="mt-16 rounded-lg bg-gradient-to-r from-yellow-400/20 to-purple-500/20 p-8 text-center backdrop-blur-sm">
            <H2 className="text-foreground">Join Our Creative Community</H2>
            <P className="mx-auto mt-4 max-w-2xl text-foreground/80">
              Whether you're an established professional or just starting your
              creative journey, there's a place for you in our community.
              Connect, collaborate, and grow with us.
            </P>
            <Button
              asChild
              className="mt-6 bg-yellow-400 text-black hover:bg-yellow-500"
            >
              <Link href="/join">Become a Member</Link>
            </Button>
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
              >{`Join our creative community • Creative Contact`}</span>
            ))}
        </div>
      </footer>
    </BackgroundDiv>
  );
}

// Construction icon component
function ConstructionIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="6" width="20" height="8" rx="1" />
      <path d="M17 14v7" />
      <path d="M7 14v7" />
      <path d="M17 3v3" />
      <path d="M7 3v3" />
      <path d="M10 14 2.3 6.3" />
      <path d="m14 6 7.7 7.7" />
      <path d="m8 6 8 8" />
    </svg>
  );
}
