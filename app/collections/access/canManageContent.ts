import type { Access } from 'payload'
import { checkRole } from './checkRole'

// Grants access if the user is an admin or a content-creator
export const canManageContent: Access = ({ req: { user } }) =>
  checkRole(['admin', 'content-creator'], user || undefined)
