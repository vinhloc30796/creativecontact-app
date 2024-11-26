"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleLogout() {
      try {
        // Specify the correct signout route
        const response = await fetch("/signout", {
          method: "POST",
          credentials: "include", // Important for cookies
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Logout failed: ${response.statusText}`);
        }

        // Handle the redirect here instead of relying on the route
        router.push("/");
      } catch (error) {
        console.error("Error during logout:", error);
        router.push("/");
      }
    }

    handleLogout();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Logging Out
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Please wait while we sign you out...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
