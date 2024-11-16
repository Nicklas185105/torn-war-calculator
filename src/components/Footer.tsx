'use client';

import React from 'react';
import { Box, Container, Text } from '@chakra-ui/react';

export function Footer() {
	return (
		<footer>
			<Box bg="cyan.subtle" py="10px" textAlign={'center'}>
				<Container>
					<Text>&copy; 2024 Torn War Calculator. All rights reserved.</Text>
					{/* <nav className={styles.nav}>
					<a href="/about">About</a>
					<a href="/contact">Contact</a>
					<a href="/privacy">Privacy Policy</a>
				</nav> */}
				</Container>
			</Box>
		</footer>
	);
}
