// components/WarUpdates.tsx

import { Box, Text, Heading, VStack } from '@chakra-ui/react';
import { createClient } from '@/lib/supabase/server';
import { TablesInsert } from '@/types/database.types';
import { RedirectToSignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

// interface War {
// 	id: number;
// 	war_id: string;
// 	factions_involved: string[];
// 	status: string;
// 	started_at: string;
// }

export async function WarUpdates() {
	const { userId } = await auth();

	if (!userId) return <RedirectToSignIn />;

	const supabase = await createClient();

	const fetchWars: () => Promise<TablesInsert<'wars'>[]> = async () => {
		const { data, error } = await supabase.from('wars').select('*');

		if (error) {
			console.error('Error fetching wars:', error);
			return [];
		} else {
			return data || [];
		}
	};

	let wars = await fetchWars();

	// Set up real-time subscriptions using the new API
	const channel = supabase
		.channel('public:wars')
		.on(
			'postgres_changes',
			{ event: '*', schema: 'public', table: 'wars' },
			(payload) => {
				const newWar = payload.new as TablesInsert<'wars'>;
				const oldWar = payload.old as TablesInsert<'wars'>;

				if (payload.eventType === 'INSERT') {
					wars = [...wars, newWar];
				} else if (payload.eventType === 'UPDATE') {
					wars = wars.map((war) => (war.id === newWar.id ? newWar : war));
				} else if (payload.eventType === 'DELETE') {
					wars = wars.filter((war) => war.id !== oldWar.id);
				}
			}
		)
		.subscribe((status) => {
			if (status === 'SUBSCRIBED') {
				console.log('Subscribed to wars updates');
			}
		});

	supabase.removeChannel(channel);

	// if (loading) {
	// 	return <Spinner />;
	// }

	if (wars.length === 0) {
		return <Text>No war updates available.</Text>;
	}

	return (
		<Box borderWidth="1px" borderRadius="lg" p={4}>
			<Heading size="md" mb={4}>
				War Updates
			</Heading>
			<VStack gap={4} align="stretch">
				{wars.map((war) => (
					<Box key={war.id} borderWidth="1px" borderRadius="md" p={3}>
						<Text>War ID: {war.war_id}</Text>
						<Text>Status: {war.status}</Text>
						<Text>Factions Involved: {war.factions_involved.join(', ')}</Text>
						<Text>
							Started At: {new Date(war.started_at!).toLocaleString()}
						</Text>
					</Box>
				))}
			</VStack>
		</Box>
	);
}
