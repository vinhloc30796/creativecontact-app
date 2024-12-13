import { contacts } from "@/drizzle/schema/contact";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";

interface IContactInfras {
  deleteContact: (userId: string, contactId: string) => Promise<{ result: boolean | null, error: Error | null }>
}
type DBType = typeof db
class ContactInfras implements IContactInfras {
  constructor(
    private readonly db: DBType
  ) { }
  async deleteContact(userId: string, contactId: string) {
    try {
      const rs = await this.db.delete(contacts).where(and(eq(contacts.contactId, contactId), eq(contacts.userId, userId)))
      if (rs.rowCount === 0) {
        return { result: null, error: new Error("Contact does not exist or does not belong to you") }
      }
      return { result: true, error: null }
    } catch (err) {
      return { result: null, error: err as Error }
    }
  }
}

export {
  ContactInfras,
  type IContactInfras
}