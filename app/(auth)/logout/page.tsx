"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useEffect, use, useRef } from "react";
import { useTranslation } from "@/lib/i18n/init-client";

interface LogoutPageProps {
  params: Promise<{}>;
  searchParams: Promise<{
    lang?: string;
  }>;
}

export default function LogoutPage(props: LogoutPageProps) {
  const searchParams = use(props.searchParams);
  const lang = searchParams.lang || "en";
  const { t } = useTranslation(lang, "LogoutPage");
  const router = useRouter();
  const hasMutated = useRef(false);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/signout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      return response;
    },
    onSettled: () => {
      setTimeout(() => router.push("/"), 3000);
    },
  });

  // We use a timeout and ref to prevent double mutation on strict mode
  // See: https://github.com/TanStack/query/issues/5341
  // Without this, React 18 Strict Mode would cause the mutation to fire twice
  // during development, potentially causing issues with the auth state.
  // The ref ensures we only mutate once, while the timeout helps prevent
  // any race conditions during component mount.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasMutated.current) {
        logoutMutation.mutate();
        hasMutated.current = true;
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  if (logoutMutation.status === "pending") {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              {t("states.pending.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-center text-muted-foreground">
              {t("states.pending.description")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (logoutMutation.status === "error") {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              {t("states.error.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-center text-muted-foreground">
              {t("states.error.description")}
            </p>
            <Button onClick={() => router.push("/")}>
              {t("states.error.returnHome")}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t("states.error.redirecting")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            {t("states.success.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center text-muted-foreground">
            {t("states.success.description")}
          </p>
          <Button onClick={() => router.push("/")}>
            {t("states.success.returnHome")}
          </Button>
          <p className="text-sm text-muted-foreground">
            {t("states.success.redirecting")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
