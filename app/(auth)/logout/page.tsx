"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export default function LogoutPage() {
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
      // Redirect after 5 seconds
      setTimeout(() => {
        router.push("/");
      }, 5000);
    },
    onError: (error) => {
      console.error("Error during logout:", error);
      // Redirect after 5 seconds
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
              Logging Out
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-center text-muted-foreground">
              Please wait while we sign you out...
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
              Logout Error
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-center text-muted-foreground">
              There was an error signing you out.
            </p>
            <Button onClick={() => router.push("/")}>
              Return to Home
            </Button>
            <p className="text-sm text-muted-foreground">
              Redirecting in 5 seconds...
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
            Logged Out Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center text-muted-foreground">
            You have been successfully signed out.
          </p>
          <Button onClick={() => router.push("/")}>
            Return to Home
          </Button>
          <p className="text-sm text-muted-foreground">
            Redirecting in 5 seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
