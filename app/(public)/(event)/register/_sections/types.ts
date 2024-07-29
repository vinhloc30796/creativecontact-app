export interface EventSlot {
	id: string
	created_at: string
	time_start: string
	time_end: string
	capacity: number
}

export interface EventRegistration {
	id: string
	slot: string
	created_at: string
	created_by: string
	signature: string
	status: 'confirmed' | 'unconfirmed' | 'none' | 'cancelled'
}

export type FormData = {
	email: string
	firstName: string
	lastName: string
	phone: string
	slot: string
}
