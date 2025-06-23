'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useLayoutEffect } from 'react';
import { ClientNavMenu } from '@/components/ClientNavMenu';
import { ConstructionIcon } from '@/components/icons/ConstructionIcon';
import { TextIconBox } from '@/components/text-icon-box';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { H2, Lead, P } from '@/components/ui/typography';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import ContactsInfinite from './client';
import { useTranslation } from '@/lib/i18n/init-client';

// ---------- Animation semantics ----------
// Scroll ranges
const INITIAL_TITLE_END = 400; // fallback if measurement fails
const HEADER_HEIGHT = 64;      // px – adjust if header height changes

const CONTENT_SCROLL_RANGE: [number, number] = [0, 800];

// Transform value ranges
const TITLE_SCALE_RANGE: [number, number] = [1, 0.35]; // Shrinks to 35%
const TITLE_Y_RANGE: [number, number] = [200, 0];      // Moves up 200px
const HERO_OPACITY_RANGE: [number, number] = [1, 0];
const HERO_Y_RANGE: [number, number] = [0, -100];
const CONTENT_Y_RANGE: [number, number] = [0, -100];
// -----------------------------------------

export function ScrollAnimatedContacts() {
  // Separate translators for clarity
  const { t: tHome } = useTranslation('en', 'HomePage');
  const { t: tContacts } = useTranslation('en', 'contacts');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: containerRef,
  });

  // Measure distance from top of container to the lead paragraph to end animations exactly there
  const leadRef = useRef<HTMLParagraphElement>(null);
  const [titleEnd, setTitleEnd] = useState<number>(INITIAL_TITLE_END);

  useLayoutEffect(() => {
    const leadEl = leadRef.current;
    const containerEl = containerRef.current;
    if (!leadEl || !containerEl) return;

    const offset = leadEl.offsetTop;
    // Account for hero's final upward shift (HERO_Y_RANGE[1]) so lead meets header precisely
    setTitleEnd(offset + HERO_Y_RANGE[1] - HEADER_HEIGHT);
  }, []);

  const TITLE_SCROLL_RANGE: [number, number] = [0, titleEnd];
  const HERO_FADE_RANGE: [number, number] = [0, titleEnd];

  // Transform values based on scroll for smooth animations
  const titleScale = useTransform(scrollY, TITLE_SCROLL_RANGE, TITLE_SCALE_RANGE);
  const titleYPos = useTransform(scrollY, TITLE_SCROLL_RANGE, TITLE_Y_RANGE);

  const heroOpacity = useTransform(scrollY, HERO_FADE_RANGE, HERO_OPACITY_RANGE);
  const heroY = useTransform(scrollY, HERO_FADE_RANGE, HERO_Y_RANGE);

  const contentY = useTransform(scrollY, CONTENT_SCROLL_RANGE, CONTENT_Y_RANGE);

  return (
    <div ref={containerRef} className="flex flex-1 flex-col">
      {/* Fixed Header with logo, join button, and animated title */}
      <header className="fixed left-0 right-0 top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="flex w-full items-center justify-between p-4">
          <div className="flex items-center gap-6">
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
                  title={tHome("joinUsLine1")}
                  subtitle={tHome("joinUsLine2")}
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
        </div>
      </header>

      {/* Main animated content */}
      <div className="relative pt-20">
        {/* Promoted sticky title - now outside hero wrapper */}
        <motion.div
          className="sticky top-2 z-[60] flex justify-center"
          style={{
            scale: titleScale,
            y: titleYPos,
            transformOrigin: 'center top',
          }}
        >
          <h1 className="font-bricolage-grotesque font-extrabold text-sunglow text-stroke-sunglow fix-stroke text-[clamp(3rem,10vw,9rem)]">
            {tContacts("heroTitle")}
          </h1>
        </motion.div>

        {/* Hero section wrapper */}
        <motion.div
          className="flex min-h-[80vh] flex-col justify-center px-12"
        >
          {/* Hero content (body) */}
          <motion.div
            className="mt-16 text-center"
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <Lead ref={leadRef} className="mx-auto max-w-3xl text-xl text-foreground/90 md:text-2xl">
              {tContacts("heroSubtitle")}
            </Lead>
          </motion.div>

          {/* Navigation row */}
          <motion.div
            className="mt-12 flex w-full items-center justify-end"
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <ClientNavMenu
              items={[
                { text: tHome("aboutCC"), href: "/about" },
                { text: tHome("contactBook"), href: "/contacts" },
                { text: tHome("event"), href: "/events" },
              ]}
              menuText={tHome("menu")}
            />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-16 text-center"
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-foreground/70">
              {tContacts("scrollForContacts")}
            </p>
          </motion.div>
        </motion.div>

        {/* Content section - appears as user scrolls */}
        <motion.div
          className="min-h-screen space-y-4 px-4 pb-12 md:px-12"
          style={{ y: contentY }}
        >
          <div className="mt-16">
            <div className="mt-6 px-8 md:px-0">
              <Separator className="bg-white/10" />
            </div>

            {/* Contact Directory Section */}
            <div className="mt-8">
              <div className="px-8 md:px-0">
                <H2 className="text-foreground/90">{tContacts("directory")}</H2>
                <P className="mt-2 text-foreground/70">
                  {tContacts("directorySubtitle")}
                </P>
              </div>

              {/* Contact list */}
              <div className="mt-16 flex flex-col">
                <ContactsInfinite />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}