import { Box, Heading, Flex } from '@chakra-ui/react';
import { UserInfo, FactionInfo, WarUpdates } from '@/components';
import { RedirectToSignIn, SignedIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
	const { userId } = await auth();

	if (!userId) return <RedirectToSignIn />;

	const test = async () => {
		const supabase = await createClient();

		const { error } = await supabase!
			.from('user_profiles')
			.select('*')
			.eq('clerk_id', userId)
			.single();
		if (error) {
			redirect('/auth/finish');
		}
	};

	await test();

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
