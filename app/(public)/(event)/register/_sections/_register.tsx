import { EventSlot } from '@/app/types/EventSlot'
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv'
import RegistrationForm from './RegistrationForm'
import RegisterWrapper from './wrapper'

interface RegisterPageProps {
  eventSlots: EventSlot[]
  lang?: string
}

const RegisterPage = ({ eventSlots, lang = 'en' }: RegisterPageProps) => {
  return (
    <BackgroundDiv>
      <RegisterWrapper>
        <RegistrationForm initialEventSlots={eventSlots} lang={lang} />
      </RegisterWrapper>
    </BackgroundDiv>
  )
}

export default RegisterPage
