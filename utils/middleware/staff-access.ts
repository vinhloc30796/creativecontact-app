import { getCustomPayload } from "@/lib/payload/getCustomPayload";
import { NextResponse } from "next/server";
import { User } from "payload";

const payload = await getCustomPayload();

export async function validateStaffAccess(request: Request): Promise<{
  isValid: boolean;
  user?: User;
  error?: { message: string; status: number };
}> {
  try {
    const cookies = request.headers.get("cookie");
    const token = cookies?.match(/payload-token=([^;]+)/)?.[1];

    if (!token) {
      return {
        isValid: false,
        error: { message: "Unauthorized - No token provided", status: 401 },
      };
    }

    try {
      const { user } = await payload.auth({
        headers: new Headers({ cookie: `payload-token=${token}` }),
      });

      if (!user || !user.active) {
        return {
          isValid: false,
          error: {
            message: "Unauthorized - Invalid or inactive user",
            status: 401,
          },
        };
      }

      const hasStaffRole = user.roles?.some((role: string) =>
        ["admin", "check-in", "content-creator"].includes(role),
      );

      if (!hasStaffRole) {
        return {
          isValid: false,
          error: {
            message: "Forbidden - Insufficient permissions",
            status: 403,
          },
        };
      }

      return {
        isValid: true,
        user: {
          ...user,
          id: String(user.id),
        },
      };
    } catch (tokenError) {
      console.error("Token verification failed:", tokenError);
      return {
        isValid: false,
        error: { message: "Unauthorized - Invalid token", status: 401 },
      };
    }
  } catch (error) {
    console.error("Staff API protection error:", error);
    return {
      isValid: false,
      error: { message: "Internal server error", status: 500 },
    };
  }
}

export function protectStaffAPI(
  handler: (
    request: Request,
    context: { params: { [key: string]: string | string[] } },
  ) => Promise<NextResponse>,
) {
  return async (
    request: Request,
    context: { params: { [key: string]: string | string[] } },
  ) => {
    const validation = await validateStaffAccess(request);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error?.message },
        { status: validation.error?.status },
      );
    }

    return handler(Object.assign(request, { user: validation.user }), context);
  };
}
