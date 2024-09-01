import styles from './_register.module.scss'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface RegisterWrapperProps {
	children: React.ReactNode
}

const RegisterWrapper: React.FC<RegisterWrapperProps> = ({ children }) => {
	return (
		<Card className="w-[400px] overflow-hidden relative z-10">
			<CardHeader
				className="border-b aspect-video bg-accent-foreground text-accent-foreground"
				style={{
					backgroundImage: 'url(/hoantat-2024-background.png)',
					backgroundSize: 'cover',
				}}
			></CardHeader>
			<CardContent className="p-6">{children}</CardContent>
		</Card>
	)
}

export default RegisterWrapper
