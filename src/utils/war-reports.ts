'use server';

import { auth } from '@clerk/nextjs/server';
import type { TablesInsert } from '@ctypes/database.types';
import { WarReport } from '@ctypes/warReport';
import { createClient } from '@lib/supabase/server';
import TornClient from '@lib/torn/client';
import { generateWarReport } from '@lib/torn/generateWarReport';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

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

export const saveReport = async (
	warId: string,
	factionId: string,
	report: WarReport
): Promise<PostgrestSingleResponse<null>> => {
	const supabase = await createClient();

	// turn the report into json string
	const json = JSON.stringify(report);

	// create an insert object
	const insert: TablesInsert<'war_reports'> = {
		war_id: warId,
		faction_id: factionId,
		data: json,
	};

	const test = await supabase!.from('war_reports').insert(insert);
	console.log('test', test);
	return test;
};
