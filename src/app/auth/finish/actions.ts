// app/auth/finish/actions.ts

'use server';

import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import TornClient from '@/lib/torn/client';

export async function handleSubmit(formData: FormData) {
	const { userId } = await auth();

	if (!userId) {
		throw new Error('User not authenticated');
	}

	const tornId = formData.get('tornId') as string;
	const key = formData.get('key') as string;

	if (!tornId || !key) {
		throw new Error('Torn User ID and API Key are required.');
	}

	// Fetch data from Torn API
	const tornClient = new TornClient(key);
	const userData = await tornClient.getUserData(tornId);

	const supabase = await createClient();

	// Create the user profile in Supabase
	const { error } = await supabase.from('user_profiles').insert({
		clerk_id: userId,
		torn_user_id: userData.player_id.toString(),
		faction_id: userData.faction.faction_id.toString(),
		name: userData.name,
		role: 'member',
		// Add other fields as necessary
	});

	if (error) {
		throw new Error('Error creating user profile');
	}

	// Redirect to the dashboard or desired page after successful submission
	return '/';
}
