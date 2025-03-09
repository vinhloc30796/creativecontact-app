/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    staffs: StaffAuthOperations;
  };
  blocks: {};
  collections: {
    staffs: Staff;
    media: Media;
    posts: Post;
    events: Event;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    staffs: StaffsSelect<false> | StaffsSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    posts: PostsSelect<false> | PostsSelect<true>;
    events: EventsSelect<false> | EventsSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: number;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: Staff & {
    collection: 'staffs';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface StaffAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "staffs".
 */
export interface Staff {
  id: number;
  roles: ('admin' | 'check-in' | 'content-creator')[];
  name: string;
  /**
   * If unchecked, user cannot log in
   */
  active?: boolean | null;
  lastLogin?: string | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: number;
  title?: string | null;
  alt?: string | null;
  /**
   * Choose an upload to render if the visitor is using dark mode.
   */
  darkModeFallback?: (number | null) | Media;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts".
 */
export interface Post {
  id: number;
  title: string;
  /**
   * Brief summary of the post (max 149 characters)
   */
  excerpt?: string | null;
  image?: (number | null) | Media;
  useVideo?: boolean | null;
  videoUrl?: string | null;
  content?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  relatedPosts?: (number | Post)[] | null;
  slug?: string | null;
  authors: (number | Staff)[];
  publishedOn: string;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "events".
 */
export interface Event {
  id: number;
  title: string;
  slug?: string | null;
  status: 'draft' | 'upcoming' | 'active' | 'past';
  /**
   * Brief summary of the event for preview cards (max 200 characters)
   */
  summary: string;
  /**
   * When does the event take place?
   */
  eventDate: string;
  /**
   * When does the event end? (Leave empty for single-day events)
   */
  endDate?: string | null;
  /**
   * Where will the event take place?
   */
  location: string;
  /**
   * Maximum number of attendees (leave empty for unlimited)
   */
  capacity?: number | null;
  /**
   * Main image used for event cards and headers
   */
  featuredImage: number | Media;
  content: (
    | {
        heading: string;
        richText: {
          root: {
            type: string;
            children: {
              type: string;
              version: number;
              [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
          };
          [k: string]: unknown;
        };
        /**
         * Optional background image for this section
         */
        backgroundImage?: (number | null) | Media;
        layout?: ('default' | 'wide' | 'fullWidth') | null;
        id?: string | null;
        blockName?: string | null;
        blockType: 'EventDetails';
      }
    | {
        name: string;
        role?: string | null;
        bio?: string | null;
        description: {
          root: {
            type: string;
            children: {
              type: string;
              version: number;
              [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
          };
          [k: string]: unknown;
        };
        /**
         * Profile photo of the speaker
         */
        image: number | Media;
        /**
         * Social media links for this speaker
         */
        socialLinks?:
          | {
              platform: 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'youtube' | 'website' | 'other';
              url: string;
              label?: string | null;
              id?: string | null;
            }[]
          | null;
        layout?: ('standard' | 'compact' | 'expanded') | null;
        id?: string | null;
        blockName?: string | null;
        blockType: 'EventSpeaker';
      }
    | {
        heading?: string | null;
        /**
         * Add all speakers for this section
         */
        speakers: {
          name: string;
          role?: string | null;
          bio?: string | null;
          image: number | Media;
          socialLinks?:
            | {
                platform: 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'youtube' | 'website' | 'other';
                url: string;
                id?: string | null;
              }[]
            | null;
          id?: string | null;
        }[];
        columns?: ('2' | '3' | '4') | null;
        layout?: ('grid' | 'list' | 'carousel') | null;
        id?: string | null;
        blockName?: string | null;
        blockType: 'EventSpeakers';
      }
    | {
        heading?: string | null;
        description?: string | null;
        /**
         * Add images to the gallery
         */
        images: {
          image: number | Media;
          caption?: string | null;
          altText?: string | null;
          id?: string | null;
        }[];
        layout?: ('grid' | 'masonry' | 'carousel' | 'fullwidth') | null;
        columns?: ('2' | '3' | '4') | null;
        id?: string | null;
        blockName?: string | null;
        blockType: 'EventGallery';
      }
    | {
        heading?: string | null;
        /**
         * Add all contributors to this event
         */
        credits: {
          name: string;
          roles: {
            role: string;
            id?: string | null;
          }[];
          /**
           * Optional social media link or website
           */
          social?: string | null;
          id?: string | null;
        }[];
        layout?: ('standard' | 'compact' | 'detailed') | null;
        id?: string | null;
        blockName?: string | null;
        blockType: 'EventCredits';
      }
  )[];
  /**
   * Tags to categorize this event
   */
  tags?:
    | {
        tag?: string | null;
        id?: string | null;
      }[]
    | null;
  /**
   * Does this event require registration?
   */
  registrationRequired?: boolean | null;
  /**
   * External registration link (if any)
   */
  registrationLink?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: number;
  document?:
    | ({
        relationTo: 'staffs';
        value: number | Staff;
      } | null)
    | ({
        relationTo: 'media';
        value: number | Media;
      } | null)
    | ({
        relationTo: 'posts';
        value: number | Post;
      } | null)
    | ({
        relationTo: 'events';
        value: number | Event;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'staffs';
    value: number | Staff;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: number;
  user: {
    relationTo: 'staffs';
    value: number | Staff;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: number;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "staffs_select".
 */
export interface StaffsSelect<T extends boolean = true> {
  roles?: T;
  name?: T;
  active?: T;
  lastLogin?: T;
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  title?: T;
  alt?: T;
  darkModeFallback?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts_select".
 */
export interface PostsSelect<T extends boolean = true> {
  title?: T;
  excerpt?: T;
  image?: T;
  useVideo?: T;
  videoUrl?: T;
  content?: T;
  relatedPosts?: T;
  slug?: T;
  authors?: T;
  publishedOn?: T;
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "events_select".
 */
export interface EventsSelect<T extends boolean = true> {
  title?: T;
  slug?: T;
  status?: T;
  summary?: T;
  eventDate?: T;
  endDate?: T;
  location?: T;
  capacity?: T;
  featuredImage?: T;
  content?:
    | T
    | {
        EventDetails?:
          | T
          | {
              heading?: T;
              richText?: T;
              backgroundImage?: T;
              layout?: T;
              id?: T;
              blockName?: T;
            };
        EventSpeaker?:
          | T
          | {
              name?: T;
              role?: T;
              bio?: T;
              description?: T;
              image?: T;
              socialLinks?:
                | T
                | {
                    platform?: T;
                    url?: T;
                    label?: T;
                    id?: T;
                  };
              layout?: T;
              id?: T;
              blockName?: T;
            };
        EventSpeakers?:
          | T
          | {
              heading?: T;
              speakers?:
                | T
                | {
                    name?: T;
                    role?: T;
                    bio?: T;
                    image?: T;
                    socialLinks?:
                      | T
                      | {
                          platform?: T;
                          url?: T;
                          id?: T;
                        };
                    id?: T;
                  };
              columns?: T;
              layout?: T;
              id?: T;
              blockName?: T;
            };
        EventGallery?:
          | T
          | {
              heading?: T;
              description?: T;
              images?:
                | T
                | {
                    image?: T;
                    caption?: T;
                    altText?: T;
                    id?: T;
                  };
              layout?: T;
              columns?: T;
              id?: T;
              blockName?: T;
            };
        EventCredits?:
          | T
          | {
              heading?: T;
              credits?:
                | T
                | {
                    name?: T;
                    roles?:
                      | T
                      | {
                          role?: T;
                          id?: T;
                        };
                    social?: T;
                    id?: T;
                  };
              layout?: T;
              id?: T;
              blockName?: T;
            };
      };
  tags?:
    | T
    | {
        tag?: T;
        id?: T;
      };
  registrationRequired?: T;
  registrationLink?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}