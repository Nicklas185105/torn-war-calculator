import { redirect } from 'next/navigation';
import { RedirectToSignIn, SignedIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import {
	Heading,
	Flex,
	Container,
	Grid,
	Table,
	Link,
	FormatNumber,
	HStack,
	Icon,
} from '@chakra-ui/react';
import { FactionInfo, UserInfo } from '@components/index';
import { createClient } from '@lib/supabase/server';
import { Tables } from '@ctypes/database.types';
import { WarReport } from '@ctypes/warReport';
import { LuDollarSign, LuExternalLink } from 'react-icons/lu';
import {
	StatHelpText,
	StatLabel,
	StatRoot,
	StatUpTrend,
	StatValueText,
} from '@ui/stat';

export default async function Home() {
	const { userId } = await auth();

	if (!userId) return <RedirectToSignIn />;

	const supabase = await createClient();

	const { data, error } = await supabase!
		.from('user_profiles')
		.select()
		.eq('clerk_id', userId)
		.single();
	if (error) {
		redirect('/auth/finish');
	}

	// get war_reports from supabase
	const { data: warReports } = await supabase
		.from('war_reports')
		.select()
		.eq('faction_id', (data as Tables<'user_profiles'>).faction_id);

	// loop through warReports and get the war_id and faction_id
	// for each warReport
	const warReportData = (warReports as Tables<'war_reports'>[])
		?.map((report) => {
			// convert the report.data into it's own object
			return {
				id: report.id,
				warId: report.war_id,
				data: JSON.parse(report.data!.toString()) as WarReport,
				link: `https://www.torn.com/war.php?step=rankreport&rankID=${report.war_id}`,
			};
		})
		.sort((a, b) => {
			return a.warId > b.warId ? -1 : 1;
		});

	const totalPayout = warReportData.reduce((acc, report) => {
		return acc + report.data.netRewardForPayout;
	}, 0);

	const trend = (
		(warReportData[0]?.data.netRewardForPayout /
			warReportData[1]?.data.netRewardForPayout) *
		100
	).toFixed(0);

	return (
		<Container p={6}>
			<Heading mb={4}>Dashboard</Heading>
			<SignedIn>
				<Flex direction="column" gap={6}>
					{/* <Grid templateColumns="repeat(3, 1fr)" gap="6"> */}
					<Grid
						templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
						gap="6"
					>
						{/* User Information */}
						<UserInfo />

						{/* Faction Information */}
						<FactionInfo />
						<StatRoot
							borderWidth="1px"
							p="4"
							rounded="md"
							justifyContent={'space-between'}
						>
							<HStack justify="space-between">
								<StatLabel>Total Payout</StatLabel>
								<Icon color="fg.muted">
									<LuDollarSign />
								</Icon>
							</HStack>
							<HStack>
								<StatValueText
									value={totalPayout}
									formatOptions={{
										style: 'currency',
										currency: 'USD',
										minimumFractionDigits: 0,
										maximumFractionDigits: 0,
									}}
								/>
								<StatUpTrend>{trend}%</StatUpTrend>
							</HStack>
							<StatHelpText>since last war</StatHelpText>
						</StatRoot>
					</Grid>
					{/* War Reports */}
					<Heading size="md">War Reports</Heading>
					{warReports && warReports.length === 0 && (
						<Flex justify="center">No war reports found.</Flex>
					)}
					{warReports && warReports.length > 0 && (
						<Table.ScrollArea borderWidth="1px" rounded="md">
							<Table.Root striped showColumnBorder>
								<Table.Header>
									<Table.Row bg="bg.subtle">
										<Table.Cell>[War ID] vs Opponent</Table.Cell>
										<Table.Cell>Payout</Table.Cell>
										<Table.Cell>Result</Table.Cell>
										<Table.Cell>New Rank</Table.Cell>
										<Table.Cell>Official Torn War Report</Table.Cell>
										{/* <Table.Cell>Report</Table.Cell> */}
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{warReportData.map((report) => (
										<Table.Row key={report.id}>
											<Table.Cell>
												[{report.warId}] vs {report.data.opponentFactionName}
											</Table.Cell>
											<Table.Cell>
												<FormatNumber
													value={report.data.netRewardForPayout}
													style="currency"
													currency="USD"
													minimumFractionDigits={0}
													maximumFractionDigits={0}
												/>
											</Table.Cell>
											<Table.Cell
												bg={
													report.data.outcome == 'VICTORY!'
														? 'green.solid'
														: 'red.solid'
												}
											>
												{report.data.outcome}
											</Table.Cell>
											<Table.Cell>{report.data.newRank}</Table.Cell>
											<Table.Cell>
												<Link
													variant={'underline'}
													href={report.link}
													target="_blank"
													rel="noopener noreferrer"
												>
													{report.data.factionName}: {report.data.factionScore}{' '}
													vs {report.data.opponentFactionName}:{' '}
													{report.data.opponentFactionScore} <LuExternalLink />
												</Link>
											</Table.Cell>
											{/* <Table.Cell>{report.report}</Table.Cell> */}
										</Table.Row>
									))}
								</Table.Body>
							</Table.Root>
						</Table.ScrollArea>
					)}
				</Flex>
			</SignedIn>
		</Container>
	);
}
