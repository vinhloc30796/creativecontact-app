import { headers, cookies } from "next/headers";
import { AuthResult, StaffUser } from "./types";


export async function logoutStaff(): Promise<AuthResult<StaffUser>> {
    try {
        const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const logoutURL = `${baseURL}/payload-cms/api/staff/logout`;

        const requestHeaders = await headers();
        const res = await fetch(logoutURL, {
            method: "POST",
            credentials: "include",
            headers: new Headers({
                "Content-Type": "application/json",
                cookie: requestHeaders.get("cookie") || "",
            }),
        });

        if (!res.ok) {
            throw new Error("Logout request failed", { cause: res });
        }

        // Clear the payloadStaffAuth cookie
        console.debug(
            "[logoutStaff] POST-ed successfully to Payload CMS /logout, next: clearing payloadStaffAuth and payload-token cookies"
        );
        const cookieStore = await cookies();
        cookieStore.delete("payload-token"); // remove the token cookie

        return {
            data: null,
            error: null,
        };
    } catch (error) {
        console.error("Staff logout error:", error);
        return {
            data: null,
            error: {
                code: "AUTH_ERROR",
                message: "Failed to sign out",
            },
        };
    }
}
