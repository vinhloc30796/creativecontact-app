import styles from './_register.module.scss'
import { cn } from '@/lib/utils'
import RegisterWrapper from './wrapper'
import RegisterForm from './form'

interface RegisterPageProps {}

const RegisterPage: React.FC<RegisterPageProps> = () => {
	return (
		<div className={cn('min-h-screen container flex items-center justify-center', styles.container)}>
			<RegisterWrapper>
				<RegisterForm />
			</RegisterWrapper>
		</div>
	)
}

export default RegisterPage
