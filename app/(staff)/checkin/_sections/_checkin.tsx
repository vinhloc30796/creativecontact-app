import styles from './_checkin.module.scss'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from 'lucide-react'
import QRScanButton from './QRScanButton'

interface CheckinPageProps {}

const CheckinPage: React.FC<CheckinPageProps> = () => {
	return (
		<div className={cn('min-h-screen container flex items-center justify-center bg-slate-50', styles.container)}>
			<Card className="w-[400px] overflow-hidden relative z-10">
				<CardHeader className="border-b">
					<div className="flex gap-4 items-center">
						<div className="aspect-square border rounded w-20 flex-shrink-0" style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover' }}></div>
						<div className="flex flex-col">
							<CardTitle className="text-xl font-bold">Check-in for Event</CardTitle>
							<CardDescription className="text-muted-foreground">Lorem Ipsum</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-6 bg-slate-100">
					<div className="flex flex-col gap-4 w-full">
						<div className="flex gap-4 w-full">
              <QRScanButton />
							<div className="flex flex-col items-center justify-center aspect-square border rounded w-full bg-white p-4">
								<Search />
								<span className="text-xs uppercase font-bold mt-2">Manual Search</span>
							</div>
						</div>
						<div className="flex flex-col border rounded w-full bg-white p-4">
							<h3 className={cn('text-lg font-bold', styles.title)}>Event statistics</h3>
							<p>Event statistics will be displayed here.</p>
						</div>
						<div className="flex flex-col border rounded w-full bg-white p-4">
							<h3 className={cn('text-lg font-bold', styles.title)}>Timeslot statistics</h3>
							<p>Event statistics will be displayed here.</p>
						</div>
						<div className="flex flex-col border rounded w-full bg-white p-4">
							<h3 className={cn('text-lg font-bold', styles.title)}>Event log</h3>
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="">
									<strong>Guest A</strong> checked in at <strong>10:00</strong> by <strong>Staff A</strong>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default CheckinPage
