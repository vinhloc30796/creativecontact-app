import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CheckinPage from './_sections/_checkin'

export default async function Page() {
  const supabase = createClient()

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()
  if (error) {
    console.error("/staff/checkin: Error getting user: ", error);
    redirect('/staff/login')
  } else if (!user) {
    console.error("/staff/checkin: Error getting user: No user found");
    redirect('/staff/login')
  } else if (!user.email) {
    console.error("/staff/checkin: User has no email: ", user);
    redirect('/staff/login')
  } else {
    console.log("Rendering CheckinPage, user:", user);
    return <CheckinPage userEmail={user.email} />
  }
}