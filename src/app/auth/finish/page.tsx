'use client';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import {
	Box,
	Center,
	Container,
	Fieldset,
	Heading,
	Input,
	Spinner,
	Stack,
} from '@chakra-ui/react';
import { handleSubmit } from './actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function FinishPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleOnSubmit = async (e: FormData) => {
		const route = await handleSubmit(e);
		router.push(route);
	};

	return (
		<Center>
			<Container
				maxW="lg"
				py={{ base: '12', md: '24' }}
				px={{ base: '0', sm: '8' }}
				position={'relative'}
			>
				<Stack gap="8">
					<Heading textAlign={'center'} size={'3xl'}>
						Finish Your Account
					</Heading>
					<Box
						py={{ base: '0', sm: '8' }}
						px={{ base: '4', sm: '10' }}
						bg={{ base: 'transparent', sm: 'bg.panel' }}
						boxShadow={{ base: 'none', sm: 'md' }}
						borderRadius={{ base: 'none', sm: 'xl' }}
					>
						<form
							action={(e) => {
								setLoading(true);
								handleOnSubmit(e);
							}}
						>
							<Fieldset.Root size="lg" maxW="md">
								<Fieldset.Content>
									<Field label="Torn User ID">
										<Input name="tornId" required />
									</Field>
									<Field label="Torn API Key">
										<Input name="key" required />
									</Field>
								</Fieldset.Content>
								<Button
									loading={loading}
									loadingText="Saving..."
									type="submit"
									alignSelf="flex-start"
								>
									Submit
								</Button>
							</Fieldset.Root>
						</form>
					</Box>
				</Stack>
				{loading && (
					<Box position={'absolute'}>
						<Center>
							<Spinner />
						</Center>
					</Box>
				)}
			</Container>
		</Center>
	);
}
