import { CollectionConfig } from 'payload'

const SHOULD_VERIFY = process.env.NODE_ENV === 'production'

// Staff collection configuration for authentication and access control
export const Staff: CollectionConfig = {
  slug: 'staff',
  // Authentication settings with secure defaults
  auth: {
    tokenExpiration: 7 * 24 * 60 * 60, // 1 week
    verify: SHOULD_VERIFY,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutes
    cookies: {
      secure: SHOULD_VERIFY,
      sameSite: 'Lax',
      domain: process.env.COOKIE_DOMAIN,
    },
  },
  // Admin panel display settings
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  // Access control - admins have full access, users can only read their own data
  access: {
    read: ({ req: { user } }) => {
      if (user?.roles?.includes('admin')) return true
      return {
        id: {
          equals: user?.id
        }
      }
    },
    create: ({ req: { user } }) => user?.roles?.includes('admin'),
    update: ({ req: { user } }) => user?.roles?.includes('admin'),
    delete: ({ req: { user } }) => user?.roles?.includes('admin'),
  },
  // Collection fields defining staff member data structure
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['check-in'],
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Check-in Staff',
          value: 'check-in',
        },
      ],
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'If unchecked, user cannot log in',
      }
    },
    {
      name: 'lastLogin',
      type: 'date',
      admin: {
        readOnly: true,
      }
    }
  ],
  // Lifecycle hooks for login events
  hooks: {
    beforeLogin: [
      async ({ req, user }) => {
        if (!user.active) {
          throw new Error('Account is deactivated')
        }
      }
    ],
    afterLogin: [
      async ({ req, user }) => {
        try {
          await req.payload.update({
            collection: 'staff',
            id: user.id,
            data: {
              lastLogin: new Date(),
            }
          })
        } catch (err) {
          console.error('Failed to update lastLogin:', err)
          // Don't throw error to allow login to complete
        }
      }
    ]
  }
}