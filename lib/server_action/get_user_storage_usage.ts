'use server'

import { createClient } from "@/utils/supabase/server"
import { getStorageUserCase } from "../services/storage"

export default async function getUserStorageUsage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    return { result: 0, error: new Error('User not logged in', { cause: session }) }
  }
  const user = session.user
  const storageUseCase = getStorageUserCase()
  return storageUseCase.getUserDataUsage(user.id)
}