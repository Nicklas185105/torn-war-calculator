'use client';

import { Box, Container, Flex, Group, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import {
	RedirectToSignIn,
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
	useUser,
} from '@clerk/nextjs';
import { LinkButton } from '@ui/link-button';
import { Button } from '@ui/button';
import { ColorModeButton } from '@ui/color-mode';
import { useRouter } from 'next/navigation';

export function NavBar() {
	const { user } = useUser();
	// const { colorMode, toggleColorMode } = useColorMode();

	user?.getSessions().then((sessions) => {
		console.log('Sessions:', sessions);
	});

	const router = useRouter();

	return (
		<Box bg="teal.emphasized" px={4}>
			<Container>
				<Flex h={16} alignItems="center" justifyContent="space-between">
					<Box>
						<Link as={NextLink} href="/" fontWeight="bold">
							Torn War Calculator
						</Link>
					</Box>
					<Flex alignItems="center">
						{/* <Button onClick={toggleColorMode} mr={4}>
						{colorMode === 'light' ? 'Dark' : 'Light'}
					</Button> */}
						<Group>
							<Button
								onClick={() => router.push('/war-reports')}
								variant={'ghost'}
							>
								War Report
							</Button>
							<ColorModeButton />
							<SignedOut>
								<LinkButton href="/auth">Sign In</LinkButton>
								<SignInButton />
								<RedirectToSignIn />
							</SignedOut>
							<SignedIn>
								<UserButton />
							</SignedIn>
						</Group>
					</Flex>
				</Flex>
			</Container>
		</Box>
	);
}
