import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CheckinPage from './_sections/_checkin'

export default async function Page() {
  const supabase = createClient()

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()
  if (error || !user) {
    console.error("/staff/checkin: Error getting user: ", error || "No user found");
    redirect('/staff/login')
  }
  
  console.log("Rendering CheckinPage, user:", user);
  return <CheckinPage userEmail={user.email!} />
}