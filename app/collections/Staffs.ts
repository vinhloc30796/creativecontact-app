import { CollectionConfig, IncomingAuthType } from "payload";
import { anyone } from "./access/anyone";
import { admins } from "./access/admins";
import { adminsAndUser } from "./access/adminAndUser";
import { checkRole } from "./access/checkRole";

const SHOULD_VERIFY = process.env.NODE_ENV === "production";
export const cookiePolicy = {
  secure: SHOULD_VERIFY,
  sameSite: "Lax",
  domain: process.env.COOKIE_DOMAIN,
};
export const authPolicy = {
  tokenExpiration: 7 * 24 * 60 * 60, // 1 week
  verify: SHOULD_VERIFY,
  maxLoginAttempts: 5,
  lockTime: 600 * 1000, // 10 minutes
  cookies: cookiePolicy,
} as IncomingAuthType;

// Staff collection configuration for authentication and access control
export const Staffs: CollectionConfig = {
  slug: "staffs",
  // Authentication settings with secure defaults
  auth: authPolicy,
  // Admin panel display settings
  admin: {
    useAsTitle: "email",
    group: "Admin",
  },
  // Access control - admins have full access, users can only read their own data

  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
    admin: ({ req: { user } }) => checkRole(["admin"], user || undefined),
  },
  // Collection fields defining staff member data structure
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      required: true,
      defaultValue: ["check-in", "content-creator"],
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Check-in Staff",
          value: "check-in",
        },
        {
          label: "Content Creator",
          value: "content-creator",
        },
      ],
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "If unchecked, user cannot log in",
      },
    },
    {
      name: "lastLogin",
      type: "date",
      admin: {
        readOnly: true,
      },
    },
  ],
  // Lifecycle hooks for login events
  hooks: {
    beforeLogin: [
      async ({ req, user }) => {
        if (!user.active) {
          throw new Error("Account is deactivated");
        }
      },
    ],
    afterLogin: [
      async ({ req, user }) => {
        try {
          await req.payload.update({
            collection: "staffs",
            id: user.id,
            data: {
              lastLogin: new Date().toISOString(),
            },
          });
        } catch (err) {
          console.error("Failed to update lastLogin:", err);
          // Don't throw error to allow login to complete
        }
      },
    ],
  },
};
