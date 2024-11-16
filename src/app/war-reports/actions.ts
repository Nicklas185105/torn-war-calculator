'use server';

import { auth } from '@clerk/nextjs/server';
import { createClient } from '@lib/supabase/server';
import type { TablesInsert } from '@ctypes/database.types';
import TornClient from '@lib/torn/client';
import { generateWarReport } from '@lib/torn/generateWarReport';

export async function getWarIds() {
	const { userId } = await auth();

	const supabase = await createClient();

	const { data: userProfile } = await supabase!
		.from('user_profiles')
		.select('*')
		.eq('clerk_id', userId)
		.single();
	const savedApiKey = (userProfile as TablesInsert<'user_profiles'>)?.api_key;

	const tornClient = new TornClient(savedApiKey!);
	return await tornClient.getWarIds(
		(userProfile as TablesInsert<'user_profiles'>)?.faction_id!.toString()
	);
}

export async function generateReport(warId: number) {
	const { userId } = await auth();

	const supabase = await createClient();

	const { data: userProfile } = await supabase!
		.from('user_profiles')
		.select('*')
		.eq('clerk_id', userId)
		.single();
	const savedApiKey = (userProfile as TablesInsert<'user_profiles'>)?.api_key;

	return await generateWarReport(userId!, savedApiKey!, warId);
}
