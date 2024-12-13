"use server"

import { contactUc } from "../services/contact"

export default async function deleteContact(contactId: string) {
  return await contactUc.deleteContact(contactId)
}