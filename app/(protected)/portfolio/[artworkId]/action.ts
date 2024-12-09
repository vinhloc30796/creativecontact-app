"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleArtworkNotFound() {
  // First set the cookie
  const cookieStore = await cookies();

  cookieStore.set("error_message", "Artwork not found", {
    maxAge: 5,
    path: "/",
  });

  // Then redirect
  redirect("/profile");
}
