import { Box, Heading, Flex } from '@chakra-ui/react';
import { UserInfo, FactionInfo, WarUpdates } from '@/components';
import { RedirectToSignIn, SignedIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import axios from 'axios';
import { UserProfileResponse } from '@/types/profile';

interface PageProps {
	searchParams: {
		[key: string]: string | string[] | undefined;
	};
}

export default async function Home({ searchParams }: PageProps) {
	const { tornId, key } = searchParams;

	const { userId } = await auth();

	if (!userId) return <RedirectToSignIn />;

	const supabase = await createClient();

	const { error } = await supabase!
		.from('user_profiles')
		.select('*')
		.eq('clerk_id', userId)
		.single();
	if (error) {
		const response = await axios.get(
			`https://api.torn.com/user/${tornId}?key=${key}`
		);

		if (response.data.error) {
			// console.log(response.data.error);
			// throw new Error(response.data.error.error);
		}

		const userData = response.data as UserProfileResponse;

		// Create the user profile in Supabase
		const { error } = await supabase.from('user_profiles').insert({
			clerk_id: userId,
			torn_user_id: userData.player_id.toString(),
			faction_id: userData.faction.faction_id.toString(),
			role: 'member',
			// Add other fields as necessary
		});
		if (error) {
			console.error('Error creating user profile:', error);
		}
	}

	return (
		<Box p={6}>
			<Heading mb={4}>Dashboard</Heading>
			<Flex direction="column" gap={6}>
				<SignedIn>
					{/* User Information */}
					<UserInfo />

					{/* Faction Information */}
					<FactionInfo />

					{/* War Updates */}
					<WarUpdates />
				</SignedIn>
			</Flex>
		</Box>
	);
}
