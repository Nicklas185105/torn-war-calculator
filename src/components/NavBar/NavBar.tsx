'use client';

import { Box, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import {
	RedirectToSignIn,
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
	useUser,
} from '@clerk/nextjs';
import { LinkButton } from '../ui/link-button';
import { ColorModeButton } from '../ui/color-mode';

export function NavBar() {
	const { user } = useUser();
	// const { colorMode, toggleColorMode } = useColorMode();

	user?.getSessions().then((sessions) => {
		console.log('Sessions:', sessions);
	});

	return (
		<Box bg="teal.500" px={4}>
			<Flex h={16} alignItems="center" justifyContent="space-between">
				<Box>
					<Link as={NextLink} href="/" color="white" fontWeight="bold">
						Torn War Calculator
					</Link>
				</Box>
				<Flex alignItems="center">
					{/* <Button onClick={toggleColorMode} mr={4}>
						{colorMode === 'light' ? 'Dark' : 'Light'}
					</Button> */}
					<ColorModeButton />
					<SignedOut>
						<LinkButton href="/auth">Sign In</LinkButton>
						<SignInButton />
						<RedirectToSignIn />
					</SignedOut>
					<SignedIn>
						<UserButton />
					</SignedIn>
				</Flex>
			</Flex>
		</Box>
	);
}
