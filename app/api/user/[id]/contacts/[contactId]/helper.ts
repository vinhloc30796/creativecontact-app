import { contacts } from "@/drizzle/schema/contact"
import { db } from "@/lib/db"
import { and, eq } from "drizzle-orm"

// delete contact
async function deleteContactWithContactId(
  userId: string,
  contactId: string,
)
  : Promise<{ result: boolean, error: Error | null }> {
  const rs = await db.delete(contacts)
    .where(and(
      eq(contacts.userId, userId),
      eq(contacts.contactId, contactId)
    ))
  if (rs.rowCount === 0) {
    return { result: false, error: new Error("contact does not exist or does not belong to you") }
  }
  return { result: true, error: null }
}

export {
  deleteContactWithContactId
}