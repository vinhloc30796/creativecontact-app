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
      name: "status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
        { label: "Inactive", value: "inactive" },
      ],
      defaultValue: "pending",
      required: true,
      admin: {
        position: "sidebar",
      },
      access: {
        create: () => false, // Prevent setting on create, will be defaulted
        read: () => true, // Everyone can read
        update: ({ req }) => checkRole(["admin"], req.user || undefined), // Only admins can update
      },
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
        if (user.status === 'pending') {
          throw new Error("Account is pending approval. Please wait for an admin to approve your account.");
        }
        if (user.status === 'rejected') {
          throw new Error("Your account registration was rejected. Please contact an administrator for more information.");
        }
        if (user.status === 'inactive') {
          throw new Error("Your account is currently inactive. Please contact an administrator.");
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
    afterChange: [
      async ({ doc, operation, req }) => {
        // Only trigger on create operations for pending users
        if (operation === 'create' && doc.status === 'pending') {
          try {
            // Construct the full URL for the internal API endpoint
            const notifyUrl = new URL('/api/discord/notify-signup', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

            const response = await fetch(notifyUrl.toString(), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                // Potentially add a secret header for security if this endpoint is exposed
                // 'X-Internal-Secret': process.env.DISCORD_INTERNAL_API_SECRET,
                'Authorization': `Bearer ${process.env.DISCORD_INTERNAL_API_SECRET}`,
              },
              body: JSON.stringify({
                userId: doc.id,
                email: doc.email,
                name: doc.name,
              }),
            });

            if (!response.ok) {
              const errorBody = await response.text();
              console.error(`Failed to notify Discord for user ${doc.id}. Status: ${response.status}, Body: ${errorBody}`);
              // Depending on requirements, you might want to throw an error here
              // or handle it in a way that doesn't block the user creation process.
            } else {
              console.log(`Successfully sent Discord notification for new staff: ${doc.email} (ID: ${doc.id})`);
            }
          } catch (error) {
            console.error(`Error sending Discord notification for user ${doc.id}:`, error);
            // Handle error appropriately
          }
        }
        return doc;
      },
    ],
  },
};
