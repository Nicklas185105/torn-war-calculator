// Interface for User
export interface User {
	id: string; // UUID
	torn_id: string; // Torn user ID (Clan ID)
	faction_id: string; // Torn faction ID
	role: 'admin' | 'owner' | 'member'; // Role-based access
	created_at: string; // Timestamp when the user joined
	email?: string; // Optional email for notifications
}

// Interface for Whitelisted Factions
export interface WhitelistedFaction {
	id: string; // UUID
	faction_id: string; // Torn faction ID
	owner_id: string; // UUID of the user who owns this faction
	whitelisted_at: string; // Timestamp of when faction was whitelisted
	is_active: boolean; // Access status for this faction
}

// Interface for Payment
export interface Payment {
	id: string; // UUID
	faction_id: string; // Torn faction ID
	amount: number; // Amount paid in Torn currency
	payment_date: string; // Timestamp of the payment date
	next_due_date: string; // Timestamp for next payment due
	created_by: string; // UUID of the admin who recorded the payment
	created_at: string; // Timestamp when the payment record was created
}

// Interface for Invites
export interface Invite {
	id: string; // UUID
	report_id: string; // UUID of the related war report
	invited_user_id: string; // UUID of the invited user
	invite_token: string; // Unique token for accepting the invite
	created_at: string; // Timestamp when the invite was created
	accepted: boolean; // Whether the invite has been accepted
}
