// components/UserInfo.tsx

import { createClient } from '@/lib/supabase/server';
import { TablesInsert } from '@/types/database.types';
import { Box, Text, Heading, Spinner } from '@chakra-ui/react';
import { RedirectToSignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

// interface UserProfile {
// 	user_id: string;
// 	torn_user_id: string;
// 	role: string;
// 	faction_id: string;
// }

export async function UserInfo() {
	const { userId } = await auth();

	if (!userId) return <RedirectToSignIn />;

	const supabase = await createClient();

	let user_profile: TablesInsert<'user_profiles'> | null = null;
	if (userId) {
		const { data, error } = await supabase!
			.from('user_profiles')
			.select('*')
			.eq('clerk_id', userId)
			.single();
		if (error) {
			console.error(error);
			return <div>Error</div>;
		}
		user_profile = data;
	} else {
		return <Spinner />;
	}

	if (!user_profile) {
		// return <Spinner />;
		return <Text>No profile was found...</Text>;
	}

	return (
		<Box borderWidth="1px" borderRadius="lg" p={4}>
			<Heading size="md">User Information</Heading>
			<Text>Name: {user_profile?.name}</Text>
			<Text>Torn User ID: {user_profile?.user_id}</Text>
			<Text>Role: {user_profile?.role}</Text>
		</Box>
	);
}
