// Define consistent return type
export interface AuthResult<T = unknown> {
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
}

export interface StaffUser {
  id: number | string;
  email: string;
  role?: string;
  collection: string;
  createdAt: string;
  updatedAt: string;
}