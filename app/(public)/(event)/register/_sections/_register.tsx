import styles from './_register.module.scss'
import { cn } from '@/lib/utils'
import RegisterWrapper from './wrapper'
import { EventSlot } from '@/app/types/EventSlot'
import RegistrationForm from './RegistrationForm'
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';

interface RegisterPageProps {
	eventSlots: EventSlot[]
}

const RegisterPage = ({ eventSlots }: RegisterPageProps) => {
	return (
		<BackgroundDiv>
			<RegisterWrapper>
				<RegistrationForm initialEventSlots={eventSlots} />
			</RegisterWrapper>
		</BackgroundDiv>
	)
}

export default RegisterPage
