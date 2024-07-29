import styles from './_register.module.scss'
import { cn } from '@/lib/utils'
import RegisterWrapper from './wrapper'
import { EventSlot } from './types'
import RegistrationForm from './RegistrationForm'

interface RegisterPageProps {
	eventSlots: EventSlot[]
}

const RegisterPage = ({ eventSlots }: RegisterPageProps) => {
	return (
		<div className={cn('min-h-screen container flex items-center justify-center', styles.container)}>
			<RegisterWrapper>
				<RegistrationForm initialEventSlots={eventSlots} />
			</RegisterWrapper>
		</div>
	)
}

export default RegisterPage
