import { db } from "@/lib/db"
import { ContactInfras } from "./infras"
import { ContactUC } from "./uc"
import { getServerSideUserId } from "@/lib/serverSideGetUserId"

const contactInfras = new ContactInfras(db)
const contactUc = new ContactUC(contactInfras, getServerSideUserId)

export {
  contactUc
}