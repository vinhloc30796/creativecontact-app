import styles from './_register.module.scss'
import { cn } from '@/lib/utils'
import RegisterWrapper from './wrapper'
import EventSlotsFetcher from './EventSlotsFetcher'

interface RegisterPageProps {
  eventId: string; // Add this prop to receive the event ID
}

const RegisterPage: React.FC<RegisterPageProps> = async ({ eventId }) => {
  return (
    <div className={cn('min-h-screen container flex items-center justify-center', styles.container)}>
      <RegisterWrapper>
        <EventSlotsFetcher eventId={eventId} />
      </RegisterWrapper>
    </div>
  )
}

export default RegisterPage
