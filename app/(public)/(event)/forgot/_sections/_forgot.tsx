import { Card, CardContent } from '@/components/ui/card'
import styles from './_fotgot.module.scss'
import { cn } from '@/lib/utils'
import ForgotForm from './ForgotForm'
import { BackgroundDiv } from '@/app/components/BackgroundDiv';

interface ForgotPageProps {}

const ForgotPage = ({}: ForgotPageProps) => {
	return (
		<BackgroundDiv>
			<Card className="w-[400px] overflow-hidden relative z-10">
				<CardContent className="p-6">
					<ForgotForm />
				</CardContent>
			</Card>
		</BackgroundDiv>
	)
}

export default ForgotPage
