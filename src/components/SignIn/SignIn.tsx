'use client';

import { Box } from '@chakra-ui/react';

export const SignIn = () => {
	// const [apiKey, setApiKey] = useState('');

	// const handleSubmit = async (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	await signIn('credentials', {
	// 		apiKey: apiKey,
	// 		callbackUrl: '/',
	// 	});
	// };

	return (
		<Box maxW="md" mx="auto" mt={8}>
			{/* <form onSubmit={handleSubmit}>
				<FormControl id="apiKey" isRequired>
					<FormLabel>Torn API Key</FormLabel>
					<Input
						type="password"
						value={apiKey}
						onChange={(e) => setApiKey(e.target.value)}
					/>
				</FormControl>
				<Button mt={4} type="submit" colorScheme="teal">
					Sign In
				</Button>
			</form> */}
		</Box>
	);
};
