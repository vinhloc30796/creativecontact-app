import type { User } from 'payload'

/**
 * Checks if a user has any of the specified roles
 * @param allRoles - Array of roles to check against
 * @param user - User object to check roles for
 * @returns true if user has any of the specified roles, false otherwise
 */
export const checkRole = (allRoles: User['roles'] = [], user: User | undefined): boolean =>
  Boolean(user?.roles?.some((role: string) => allRoles.includes(role)))