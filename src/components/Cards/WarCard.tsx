'use client';

import { Box, Heading, Text, Button } from '@chakra-ui/react';

interface WarCardProps {
	title: string;
	description: string;
	onClick?: () => void;
}

export function WarCard({ title, description, onClick }: WarCardProps) {
	return (
		<Box borderWidth="1px" borderRadius="lg" p={6} m={4}>
			<Heading size="md" mb={2}>
				{title}
			</Heading>
			<Text mb={4}>{description}</Text>
			<Button onClick={onClick}>View Details</Button>
		</Box>
	);
}
