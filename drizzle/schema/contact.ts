import { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";
import { authUsers } from "./user";

// Schema for contacts
/*                              Table "public.contacts"
   Column   |           Type           | Collation | Nullable |      Default      
------------+--------------------------+-----------+----------+-------------------
 id         | uuid                     |           | not null | gen_random_uuid()
 user_id    | uuid                     |           | not null | 
 contact_id | uuid                     |           | not null | 
 created_at | timestamp with time zone |           | not null | now()
 updated_at | timestamp with time zone |           | not null | now()
Indexes:
    "contacts_pkey" PRIMARY KEY, btree (id)
    "contacts_user_id_contact_id_key" UNIQUE CONSTRAINT, btree (user_id, contact_id)
    "idx_contacts_contact_id" btree (contact_id)
    "idx_contacts_user_id" btree (user_id)
Check constraints:
    "contact_id_cannot_be_user_id" CHECK (contact_id <> user_id)
Foreign-key constraints:
    "contacts_contact_id_fkey" FOREIGN KEY (contact_id) REFERENCES auth.users(id) ON DELETE CASCADE
    "contacts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
*/

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => authUsers.id),
  contactId: uuid('contact_id').references(() => authUsers.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Contact = InferSelectModel<typeof contacts>;
