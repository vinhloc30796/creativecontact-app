import { IContactInfras } from "./infras"

interface IContactUC {
  deleteContact: (contactId: string) => Promise<{ result: boolean | null, error: Error | null }>
}

class ContactUC implements IContactUC {
  constructor(
    private readonly contactInfras: IContactInfras,
    private readonly getUserId: () => Promise<string>
  ) { }
  async deleteContact(contactId: string) {
    try {
      const userId = await this.getUserId()
      return await this.contactInfras.deleteContact(userId, contactId)
    } catch (err) {
      return { result: null, error: err as Error }
    }
  }
}

export {
  ContactUC,
  type IContactUC
}