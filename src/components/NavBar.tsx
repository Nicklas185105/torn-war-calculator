'use client';

import { Box, Container, Flex, Group, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import {
	RedirectToSignIn,
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from '@clerk/nextjs';
import { LinkButton } from '@ui/link-button';
import { Button } from '@ui/button';
import { ColorModeButton } from '@ui/color-mode';
import { useRouter } from 'next/navigation';

export function NavBar() {
	const router = useRouter();

	return (
		<header>
			<Box bg="teal.emphasized" px={4}>
				<Container>
					<Flex h={16} alignItems="center" justifyContent="space-between">
						<Box>
							<Link as={NextLink} href="/" fontWeight="bold">
								Torn War Calculator
							</Link>
						</Box>
						<Flex alignItems="center">
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
		</header>
	);
}
