import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CheckinPage } from './_sections/_checkin'

export default async function Page() {
  const supabase = createClient()

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()
  if (error) {
    console.error("/staff/checkin: Error getting user: ", error)
  }
  
  if (!user) {
    redirect('/staff/login')
  }
  
  console.log("Rendering CheckinPage, user:", user);
  return <CheckinPage userEmail={user.email!} />
}