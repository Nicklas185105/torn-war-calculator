import { Heading, Flex, Container, Grid, Table } from '@chakra-ui/react';
import { RedirectToSignIn, SignedIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@lib/supabase/server';
import { redirect } from 'next/navigation';
import { UserInfo } from '@components/UserInfo';
import { FactionInfo } from '@components/FactionInfo';

export default async function Home() {
	const { userId } = await auth();

	if (!userId) return <RedirectToSignIn />;

	const supabase = await createClient();

	const { data, error } = await supabase!
		.from('user_profiles')
		.select('*')
		.eq('clerk_id', userId)
		.single();
	if (error) {
		redirect('/auth/finish');
	}

	// get war_reports from supabase
	const { data: warReports } = await supabase
		.from('war_reports')
		.select('*')
		.eq('faction_id', data.faction_id);

	return (
		<Container p={6}>
			<Heading mb={4}>Dashboard</Heading>
			<SignedIn>
				<Flex direction="column" gap={6}>
					<Grid templateColumns="repeat(2, 1fr)" gap="6">
						{/* User Information */}
						<UserInfo />

						{/* Faction Information */}
						<FactionInfo />
					</Grid>
					{/* War Reports */}
					<Heading size="md">War Reports</Heading>
					{warReports && warReports.length === 0 && (
						<Flex justify="center">No war reports found.</Flex>
					)}
					{warReports && warReports.length > 0 && (
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Cell>War ID</Table.Cell>
									<Table.Cell>Faction ID</Table.Cell>
									{/* <Table.Cell>Report</Table.Cell> */}
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{warReports.map((report) => (
									<Table.Row key={report.id}>
										<Table.Cell>{report.war_id}</Table.Cell>
										<Table.Cell>{report.faction_id}</Table.Cell>
										{/* <Table.Cell>{report.report}</Table.Cell> */}
									</Table.Row>
								))}
							</Table.Body>
						</Table.Root>
					)}
				</Flex>
			</SignedIn>
		</Container>
	);
}
