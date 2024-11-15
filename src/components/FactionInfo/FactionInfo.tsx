// components/FactionInfo.tsx

import { createClient } from '@/lib/supabase/server';
import { TablesInsert } from '@/types/database.types';
import { Box, Text, Heading } from '@chakra-ui/react';
import { RedirectToSignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export async function FactionInfo() {
	const { userId } = await auth();

	if (!userId) return <RedirectToSignIn />;

	const supabase = await createClient();

	const fetchFaction: () => Promise<TablesInsert<'factions'>> = async () => {
		// if (!session?.user.id) {
		// 	setLoading(false);
		// 	return;
		// }

		// Fetch the user's faction ID from their profile
		const { data: profile, error: profileError } = await supabase
			.from('user_profiles')
			.select('torn_user_id, faction_id')
			.eq('clerk_id', userId)
			.single();

		console.log('[FactionInfo] profile:', profile);
		console.log('[FactionInfo] userId:', userId);

		if (profileError || !profile?.faction_id) {
			console.error(
				'Error fetching user profile or no faction ID:',
				profileError
			);
			return;
		}

		// Fetch faction data
		const { data: factionData, error: factionError } = await supabase
			.from('factions')
			.select('*')
			.eq('faction_id', profile.faction_id)
			.single();

		let factionInfo: TablesInsert<'factions'> | null = factionData || null;

		if (factionError || !factionInfo) {
			console.log('Faction not found in database. Fetching from Torn API.');

			// Fetch faction data from Torn API
			try {
				const response = await fetch(
					`https://api.torn.com/faction/${profile.faction_id}?selections=basic&key=${process.env.NEXT_PUBLIC_TORN_API_KEY}`
				);

				if (!response.ok) {
					throw new Error('Error fetching faction data from Torn API');
				}

				const tornFactionData = await response.json();

				// Check for API errors
				if (tornFactionData.error) {
					throw new Error(tornFactionData.error.error);
				}

				factionInfo = {
					faction_id: profile.faction_id,
					name: tornFactionData.name,
					leader_id: tornFactionData.leader_id.toString(),
				};

				// Insert the new faction data into Supabase
				const { error: insertError } = await supabase
					.from('factions')
					.insert(factionInfo);

				if (insertError) {
					console.error(
						'Error inserting faction data into Supabase:',
						insertError
					);
				} else {
					const { data: factionData } = await supabase
						.from('factions')
						.select('*')
						.eq('faction_id', factionInfo.faction_id)
						.single();
					return factionData;
				}
			} catch (error) {
				console.error('Error fetching faction data from Torn API:', error);
				return;
			}
		}
	};
	const fetchLeader: (
		leaderId: string | null | undefined
	) => Promise<TablesInsert<'user_profiles'>> = async (
		leaderId: string | null | undefined
	) => {
		if (leaderId) {
			return null;
		}

		// Check if the faction leader exists in user_profiles
		const { data: leaderProfile, error: leaderError } = await supabase
			.from('user_profiles')
			.select('*')
			.eq('torn_user_id', leaderId)
			.single();

		if (leaderError || !leaderProfile) {
			console.log('Leader not found in user_profiles.');
		} else {
			return leaderProfile;
		}
	};

	const faction = await fetchFaction();
	const leader = await fetchLeader(faction?.leader_id);

	if (!faction && !leader) {
		// return <Spinner />;
		return <Text>No faction data found.</Text>;
	}

	return (
		<Box borderWidth="1px" borderRadius="lg" p={4}>
			<Heading size="md">Faction Information</Heading>
			<Text>Name: {faction.name}</Text>
			<Text>Faction ID: {faction.faction_id}</Text>
			<Text>Leader: {leader ? leader.name : 'Not registered'}</Text>
		</Box>
	);
}
