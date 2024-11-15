// app/finish/route.ts (Server Route Handler)

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { UserProfileResponse } from '@/types/profile';

export async function POST(request: Request) {
	const { userId } = await auth();

	if (!userId) {
		return NextResponse.redirect('/signin');
	}

	const formData = await request.formData();
	const tornId = formData.get('tornId') as string;
	const key = formData.get('key') as string;

	if (!tornId || !key) {
		return NextResponse.json(
			{ error: 'Torn User ID and API Key are required.' },
			{ status: 400 }
		);
	}

	try {
		const response = await fetch(
			`https://api.torn.com/user/${tornId}?key=${key}`
		);
		const data = await response.json();

		if (data.error) {
			console.error('Torn API Error:', data.error);
			return NextResponse.json({ error: data.error.error }, { status: 400 });
		}

		const userData = data as UserProfileResponse;

		const supabase = await createClient();

		// Create the user profile in Supabase
		const { error } = await supabase.from('user_profiles').insert({
			clerk_id: userId,
			torn_user_id: userData.player_id.toString(),
			faction_id: userData.faction.faction_id.toString(),
			role: 'member',
			// Add other fields as necessary
		});

		if (error) {
			console.error('Supabase Insert Error:', error);
			return NextResponse.json(
				{ error: 'Error creating user profile' },
				{ status: 500 }
			);
		}

		// Redirect to the dashboard or desired page after successful submission
		return NextResponse.redirect('/dashboard');
	} catch (error) {
		console.error('Unexpected Error:', error);
		return NextResponse.json(
			{ error: 'An unexpected error occurred' },
			{ status: 500 }
		);
	}
}
