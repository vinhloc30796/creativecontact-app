// types.ts
export interface EventRegistration {
	id: string
	name: string
	email: string
	phone: string
	slot: string
	status: 'confirmed' | 'pending' | 'cancelled' | 'checked-in'
	qr_code: string
	created_at: string
}

export interface EventSlot {
	id: string
	time_start: string
	time_end: string
	capacity: number
}
