// Function to get display name from first and last name
export function getDisplayName(firstName: string, lastName: string, lastBeforefirst: boolean = true): string {
  return lastBeforefirst ? `${lastName} ${firstName}` : `${firstName} ${lastName}`;
}