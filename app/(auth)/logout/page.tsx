"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n/init-client";

interface LogoutPageProps {
  params: {};
  searchParams: {
    lang?: string;
  };
}

export default function LogoutPage({ searchParams }: LogoutPageProps) {
  const lang = searchParams.lang || "en";
  const { t } = useTranslation(lang, "LogoutPage");
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/signout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
      }

      return response;
    },
    onSuccess: () => {
      setTimeout(() => {
        router.push("/");
      }, 5000);
    },
    onError: (error) => {
      console.error("Error during logout:", error);
      setTimeout(() => {
        router.push("/");
      }, 5000);
    },
  });

  useEffect(() => {
    logoutMutation.mutate();
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
