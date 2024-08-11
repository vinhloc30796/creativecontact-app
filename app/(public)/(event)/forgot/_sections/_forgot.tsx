import { Card, CardContent } from '@/components/ui/card'
import RegisterWrapper from '../../register/_sections/wrapper'
import styles from './_fotgot.module.scss'
import { cn } from '@/lib/utils'
import ForgotForm from './ForgotForm'

interface ForgotPageProps {}

const ForgotPage = ({}: ForgotPageProps) => {
	return (
		<div className={cn('min-h-screen flex items-center justify-center', styles.container)} style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover' }}>
			<Card className="w-[400px] overflow-hidden relative z-10">
				<CardContent className="p-6">
					<ForgotForm />
				</CardContent>
			</Card>
		</div>
	)
}

export default ForgotPage
