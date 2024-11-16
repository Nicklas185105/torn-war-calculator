'use client';

import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { Field } from '@ui/field';
import { PasswordInput } from '@ui/password-input';
import {
	Box,
	Container,
	Heading,
	HStack,
	Input,
	Link,
	Spinner,
	Stack,
	Text,
} from '@chakra-ui/react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
	const { isLoaded, signUp } = useSignUp();
	const router = useRouter();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [tornId, setTornId] = useState('');
	const [key, setKey] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSignUp = async () => {
		if (!isLoaded) return;

		setLoading(true);

		try {
			await signUp.create({
				username,
				password,
			});

			router.push(`/`);

			// await signUp.prepareVerification();

			// Wait for the user to complete username verification
			// Once verified, the user is signed in
			// const { createdSessionId } = signUp;
			// if (createdSessionId) {
			// 	const response = await axios.get(
			// 		`https://api.torn.com/user/${tornId}?key=${key}`
			// 	);

			// 	if (response.data.error) {
			// 		throw new Error(response.data.error.error);
			// 	}

			// 	const userData = response.data as UserProfileResponse;

			// 	// Create the user profile in Supabase
			// 	const { id } = signUp;
			// 	const supabase = createClient();

			// 	const { error } = await supabase.from('user_profiles').insert({
			// 		clerk_id: id,
			// 		torn_id: userData.player_id.toString(),
			// 		faction_id: userData.faction.faction_id.toString(),
			// 		role: 'member',
			// 		// Add other fields as necessary
			// 	});

			// 	if (error) {
			// 		console.error('Error creating user profile:', error);
			// 	} else {
			// 		// Redirect to dashboard or desired page
			// 		router.push('/dashboard');
			// 	}
			// }
		} catch (error) {
			console.error('Error signing up:', error);
		}
	};
	return (
		<>
			{loading && <Spinner />}
			{!loading && (
				<Container
					maxW="lg"
					py={{ base: '12', md: '24' }}
					px={{ base: '0', sm: '8' }}
				>
					<Stack gap="8">
						<Stack gap="6">
							{/* <Logo /> */}
							<Stack gap={{ base: '2', md: '3' }} textAlign="center">
								<Heading size={{ base: 'xs', md: 'sm' }}>
									Log in to your account
								</Heading>
								<Text color="fg.muted">
									Don&apos;t have an account? <Link href="#">Sign up</Link>
								</Text>
							</Stack>
						</Stack>
						<Box
							py={{ base: '0', sm: '8' }}
							px={{ base: '4', sm: '10' }}
							bg={{ base: 'transparent', sm: 'bg.panel' }}
							boxShadow={{ base: 'none', sm: 'md' }}
							borderRadius={{ base: 'none', sm: 'xl' }}
						>
							<Stack gap="6">
								<Stack gap="5">
									<Field label="Torn User ID">
										<Input
											id="torn-id"
											type="text"
											placeholder="Enter your Torn User ID"
											value={tornId}
											onChange={(e) => setTornId(e.target.value)}
										/>
									</Field>
									<Field label="Torn API Key">
										<Input
											id="torn-api-key"
											type="text"
											placeholder="Enter your Torn API Key"
											value={key}
											onChange={(e) => setKey(e.target.value)}
										/>
									</Field>
									<Field label="username">
										<Input
											id="username"
											type="username"
											value={username}
											onChange={(e) => setUsername(e.target.value)}
										/>
									</Field>
									<Field label="Password">
										<PasswordInput
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
									</Field>
								</Stack>
								<HStack justify="space-between">
									<Checkbox defaultChecked>Remember me</Checkbox>
									<Button variant="plain" size="sm" disabled>
										Forgot password?
									</Button>
								</HStack>
								<Stack gap="6">
									<Button onClick={handleSignUp}>Sign in</Button>
								</Stack>
							</Stack>
						</Box>
					</Stack>
				</Container>
			)}
		</>
	);
}
