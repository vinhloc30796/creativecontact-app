// File: app/(auth)/login/page.tsx
"use client";

// UI components
import { MagicSignIn } from "@/components/auth/MagicSignIn";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loading } from "@/components/Loading";
import { HeroTitle } from "@/components/ui/typography";

// React imports
import { Suspense } from "react";

// Utility
import { cn } from "@/lib/utils";

export default function LoginPage() {
  return (
    <BackgroundDiv
      shouldCenter={false}
      className={cn(
        "flex flex-col md:flex-row h-screen w-full overflow-hidden"
      )}
    >
      {/* Hero / Illustration section */}
      <div
        className={cn(
          "order-2 md:order-1 flex-1 hidden md:block",
          "bg-[url('/banner.jpg')] bg-cover bg-center"
        )}
      />

      {/* Login form section */}
      <div
        className={cn(
          "order-1 md:order-2 flex-1",
          "flex items-center justify-center"
        )}
      >
        <Suspense fallback={<Loading />}>
          <Card className="w-[90%] max-w-[420px] overflow-hidden border-4 border-black shadow-[4px_4px_0_0_#000]">
            {/* Mobile banner */}
            <CardHeader
              className="aspect-video md:hidden bg-[url('/banner.jpg')] bg-cover bg-center relative"
            />
            <CardContent className="p-6 flex flex-col gap-6">
              {/* Brand heading */}
              <HeroTitle
                size="small"
                bordered="black"
                variant="accent"
                className="text-black text-center"
              >
                LOG&nbsp;IN
              </HeroTitle>
              <MagicSignIn purpose="login" />
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </BackgroundDiv>
  );
}
