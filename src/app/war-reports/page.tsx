'use client';

import { useState, useCallback, useEffect } from 'react';
import {
	Box,
	Card,
	Container,
	createListCollection,
	Grid,
	Heading,
	Input,
	ListCollection,
	Table,
	Text,
	VStack,
} from '@chakra-ui/react';
import {
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectRoot,
	SelectTrigger,
	SelectValueText,
} from '@ui/select';
import { Button } from '@ui/button';
import { WarReport } from '@ctypes/warReport';
import { generateReport, getWarIds } from '@utils/war-reports';

export default function GenerateWarReport() {
	const [warId, setWarId] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [warIds, setWarIds] = useState<ListCollection>(
		createListCollection({ items: [] })
	);
	const [generatedReport, setGeneratedReport] = useState<WarReport | null>(
		null
	);

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0, // No minimum decimal digits
		maximumFractionDigits: 0, // No maximum decimal digits
	});

	const handleFetchWarIds = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getWarIds();
			data.reverse();
			setWarIds(
				createListCollection({
					items: data.map((id) => ({ label: `War ID ${id}`, value: id })),
				})
			);
			setWarId([data[0]]);
		} catch (Error: unknown) {
			console.log('handleFetchWarIds:', Error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		handleFetchWarIds();
	}, [handleFetchWarIds]);

	const handleGenerateReport = async () => {
		setLoading(true);
		try {
			console.log('warId:', warId);
			setGeneratedReport(await generateReport(parseInt(warId[0], 10)));
		} catch (Error: unknown) {
			console.log('handleGenerateReport:', Error);
		} finally {
			setLoading(false);
		}
	};

	const handleUpdatePayout = () => {
		if (!generatedReport) return;
		setLoading(true);
		generatedReport.factionTakeaway = 0.2 * generatedReport.factionRewardTotal;
		generatedReport.expensesTotal =
			generatedReport.factionTakeaway +
			generatedReport.expenseStatSpies +
			generatedReport.expenseRevives +
			generatedReport.expenseBountyMerc +
			generatedReport.expenseChainWatcher +
			generatedReport.expenseXanax;
		generatedReport.netRewardForPayout =
			generatedReport.factionRewardTotal - generatedReport.expensesTotal;
		generatedReport.payoutPerPoint =
			generatedReport.netRewardForPayout / generatedReport.totalWeightedScore;

		// calculate payout for each member
		generatedReport.members.forEach((member) => {
			member.totalPayout =
				member.weightedScore * generatedReport.payoutPerPoint;
		});

		generatedReport.totalPayout = generatedReport.members.reduce(
			(sum, member) => sum + member.totalPayout,
			0
		);

		setGeneratedReport({ ...generatedReport });
		setLoading(false);
	};

	return (
		<Container p={6}>
			<VStack mb={'10'}>
				<Heading mb={4}>Generate War Report</Heading>
				<SelectRoot
					collection={warIds}
					value={warId}
					onValueChange={(e) => setWarId(e.value)}
				>
					<SelectLabel>Select War</SelectLabel>
					<SelectTrigger>
						<SelectValueText placeholder="Select War ID" />
					</SelectTrigger>
					<SelectContent>
						{warIds.items.map((movie) => (
							<SelectItem item={movie} key={movie.value}>
								{movie.label}
							</SelectItem>
						))}
					</SelectContent>
				</SelectRoot>
				<Button
					onClick={handleGenerateReport}
					loading={loading}
					loadingText="Generating..."
				>
					Generate Report
				</Button>
			</VStack>
			{generatedReport && (
				<VStack alignItems={'unset'}>
					<Box
						borderRadius={'10px'}
						background={
							generatedReport.outcome == 'VICTORY!'
								? 'green.solid'
								: 'red.solid'
						}
						padding={'10px'}
						shadow="md"
					>
						{/* className={classNames(styles.header, {
							[styles.win]: generatedReport.outcome === 'VICTORY!',
							[styles.loss]: generatedReport.outcome === 'DEFEAT!',
						})} */}
						<Heading textAlign={'center'} size={'2xl'}>
							{generatedReport.factionName}: {generatedReport.factionScore} vs{' '}
							{generatedReport.opponentFactionName}:{' '}
							{generatedReport.opponentFactionScore}
						</Heading>
					</Box>
					<Grid templateColumns="repeat(2, 1fr)" gap="6">
						{/* className={styles.container} */}
						<table>
							<tbody>
								<tr>
									<td>Faction Reward Total</td>
									<td>
										<Input
											value={formatter.format(
												generatedReport.factionRewardTotal
											)}
											onChange={(e) =>
												setGeneratedReport((prev) => {
													if (!prev) return null;
													return {
														...prev,
														factionRewardTotal: parseFloat(e.target.value),
													};
												})
											}
										/>
									</td>
								</tr>
								<tr>
									<td>Faction Takeaway</td>
									<td>
										<div>
											{/* className={styles.double} */}
											<p>20%</p>
											<p>{formatter.format(generatedReport.factionTakeaway)}</p>
										</div>
									</td>
								</tr>
								<tr>
									<td>Expense - Stats Spies</td>
									<td>
										<Input
											value={formatter.format(generatedReport.expenseStatSpies)}
											onChange={(e) =>
												setGeneratedReport((prev) => {
													if (!prev) return null;
													return {
														...prev,
														expenseStatSpies: parseFloat(e.target.value),
													};
												})
											}
										/>
									</td>
								</tr>
								<tr>
									<td>Expense - revives</td>
									<td>
										<Input
											value={formatter.format(generatedReport.expenseRevives)}
											onChange={(e) =>
												setGeneratedReport((prev) => {
													if (!prev) return null;
													return {
														...prev,
														expenseRevives: parseFloat(e.target.value),
													};
												})
											}
										/>
									</td>
								</tr>
								<tr>
									<td>Expense - Bounty / Merc</td>
									<td>
										<Input
											value={formatter.format(
												generatedReport.expenseBountyMerc
											)}
											onChange={(e) =>
												setGeneratedReport((prev) => {
													if (!prev) return null;
													return {
														...prev,
														expenseBountyMerc: parseFloat(e.target.value),
													};
												})
											}
										/>
									</td>
								</tr>
								<tr>
									<td>Expense - Chain watcher</td>
									<td>
										<Input
											value={formatter.format(
												generatedReport.expenseChainWatcher
											)}
											onChange={(e) =>
												setGeneratedReport((prev) => {
													if (!prev) return null;
													return {
														...prev,
														expenseChainWatcher: parseFloat(e.target.value),
													};
												})
											}
										/>
									</td>
								</tr>
								<tr>
									<td>Expense - Xanax & other</td>
									<td>
										<Input
											value={formatter.format(generatedReport.expenseXanax)}
											onChange={(e) =>
												setGeneratedReport((prev) => {
													if (!prev) return null;
													return {
														...prev,
														expenseXanax: parseFloat(e.target.value),
													};
												})
											}
										/>
									</td>
								</tr>
								<tr>
									<td>Expense total</td>
									<td>{formatter.format(generatedReport.expensesTotal)}</td>
								</tr>
								<tr>
									<td>Net reward for payout</td>
									<td>
										{formatter.format(generatedReport.netRewardForPayout)}
									</td>
								</tr>
							</tbody>
						</table>
						<Grid templateColumns="repeat(3, 1fr)" gap="6">
							{/* className={styles.container2} */}
							<Card.Root>
								{/* className={styles.box} */}
								<Card.Header>Respect</Card.Header>
								<Card.Body>
									{
										generatedReport.rewards.find((r) => r.type === 'Respect')
											?.quantity
									}
								</Card.Body>
							</Card.Root>
							<Card.Root>
								{/* className={styles.box} */}
								<Card.Header>Points</Card.Header>
								<Card.Body>
									{
										generatedReport.rewards.find((r) => r.type === 'Points')
											?.quantity
									}
								</Card.Body>
							</Card.Root>
							<Card.Root>
								{/* className={styles.box} */}
								<Card.Header>Payout per Weighted Score Point</Card.Header>
								<Card.Body>
									{formatter.format(generatedReport.payoutPerPoint)}
								</Card.Body>
							</Card.Root>
							{/* className={styles.container2} */}
							<Card.Root>
								{/* className={styles.box} */}
								<Card.Header>Total War Hits</Card.Header>
								<Card.Body>{generatedReport.totalWarHits}</Card.Body>
							</Card.Root>
							<Card.Root>
								{/* className={styles.box} */}
								<Card.Header>Total Non-War Hits</Card.Header>
								<Card.Body>{generatedReport.totalNonWarHits}</Card.Body>
							</Card.Root>
							<Card.Root>
								{/* className={styles.box} */}
								<Card.Header>Rewards</Card.Header>
								<Card.Body>
									{generatedReport.rewards
										.filter((r) => r.type !== 'Respect' && r.type !== 'Points')
										.map((reward, i) => (
											<Text key={i}>
												{reward.quantity} {reward.type}
											</Text>
										))}
								</Card.Body>
							</Card.Root>
						</Grid>
					</Grid>
					<Button
						variant={'subtle'}
						onClick={handleUpdatePayout}
						disabled={loading}
					>
						Update Payout
					</Button>
					<div>
						{/* Table showcasing all the members from the users clan */}
						<Table.ScrollArea borderWidth="1px" rounded="md" height="500px">
							<Table.Root
								// variant={'outline'}
								striped
								stickyHeader
								showColumnBorder
							>
								<Table.Header>
									<Table.Row bg="bg.subtle">
										<Table.ColumnHeader>Member</Table.ColumnHeader>
										<Table.ColumnHeader>Total Payout</Table.ColumnHeader>
										<Table.ColumnHeader>Weighted Score</Table.ColumnHeader>
										<Table.ColumnHeader>Warlord</Table.ColumnHeader>
										<Table.ColumnHeader>War Hits</Table.ColumnHeader>
										<Table.ColumnHeader>Non-War Hits</Table.ColumnHeader>
										<Table.ColumnHeader>Respect</Table.ColumnHeader>
										<Table.ColumnHeader>Chain Bonus</Table.ColumnHeader>
										<Table.ColumnHeader>Total Score</Table.ColumnHeader>
										<Table.ColumnHeader>Fair Fight Average</Table.ColumnHeader>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{generatedReport.members
										.sort((a, b) => {
											if (b.totalPayout === a.totalPayout) {
												return b.respect - a.respect;
											}
											return b.totalPayout - a.totalPayout;
										})
										.map((member, i: number) => (
											<Table.Row key={i}>
												<Table.Cell>
													{member.name} [{member.id}]
												</Table.Cell>
												<Table.Cell>
													{formatter.format(member.totalPayout)}
												</Table.Cell>
												<Table.Cell>
													{member.weightedScore.toFixed(2)}
												</Table.Cell>
												<Table.Cell>{member.warlord}</Table.Cell>
												<Table.Cell>{member.warHits}</Table.Cell>
												<Table.Cell>{member.nonWarHits}</Table.Cell>
												<Table.Cell>{member.respect}</Table.Cell>
												<Table.Cell>{member.chainBonus}</Table.Cell>
												<Table.Cell>{member.totalScore}</Table.Cell>
												<Table.Cell>
													{member.fairFightAverage.toFixed(2)}
												</Table.Cell>
											</Table.Row>
										))}
									<Table.Row bg="bg.subtle">
										<Table.Cell>Total</Table.Cell>
										<Table.Cell>
											{formatter.format(generatedReport.totalPayout)}
										</Table.Cell>
										<Table.Cell>
											{generatedReport.totalWeightedScore.toFixed(2)}
										</Table.Cell>
										<Table.Cell>{generatedReport.totalWarlord}</Table.Cell>
										<Table.Cell>{generatedReport.totalWarHits}</Table.Cell>
										<Table.Cell>{generatedReport.totalNonWarHits}</Table.Cell>
										<Table.Cell>
											{generatedReport.totalRespect.toFixed(2)}
										</Table.Cell>
										<Table.Cell>{generatedReport.totalChainBonus}</Table.Cell>
										<Table.Cell>{generatedReport.factionScore}</Table.Cell>
										<Table.Cell></Table.Cell>
									</Table.Row>
								</Table.Body>
							</Table.Root>
						</Table.ScrollArea>
						{/* Showcase a single members hits */}
						{/* <Table.Root variant={'outline'} striped mt="5">
							<Table.Header>
								<Table.Row>
									<Table.ColumnHeader>Started</Table.ColumnHeader>
									<Table.ColumnHeader>Ended</Table.ColumnHeader>
									<Table.ColumnHeader>Attacker Name</Table.ColumnHeader>
									<Table.ColumnHeader>Attacker Faction</Table.ColumnHeader>
									<Table.ColumnHeader>Defender Name</Table.ColumnHeader>
									<Table.ColumnHeader>Defender Faction</Table.ColumnHeader>
									<Table.ColumnHeader>Result</Table.ColumnHeader>
									<Table.ColumnHeader>Ranked War</Table.ColumnHeader>
									<Table.ColumnHeader>Stealthed</Table.ColumnHeader>
									<Table.ColumnHeader>Raid</Table.ColumnHeader>
									<Table.ColumnHeader>Retal</Table.ColumnHeader>
									<Table.ColumnHeader>Group</Table.ColumnHeader>
									<Table.ColumnHeader>Overseas</Table.ColumnHeader>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{generatedReport.members
									.filter((member) => member.id === 3395845)[0]
									.hits.map((hit, i: number) => (
										<Table.Row key={i}>
											<Table.Cell>{hit.timestamp_started}</Table.Cell>
											<Table.Cell>{hit.timestamp_ended}</Table.Cell>
											<Table.Cell>{hit.attacker_name}</Table.Cell>
											<Table.Cell>{hit.attacker_factionname}</Table.Cell>
											<Table.Cell>{hit.defender_name}</Table.Cell>
											<Table.Cell>{hit.defender_factionname}</Table.Cell>
											<Table.Cell>{hit.result}</Table.Cell>
											<Table.Cell>{hit.ranked_war}</Table.Cell>
											<Table.Cell>{hit.stealthed}</Table.Cell>
											<Table.Cell>{hit.raid}</Table.Cell>
											<Table.Cell>{hit.modifiers.retaliation}</Table.Cell>
											<Table.Cell>{hit.modifiers.group_attack}</Table.Cell>
											<Table.Cell>{hit.modifiers.overseas}</Table.Cell>
										</Table.Row>
									))}
							</Table.Body>
						</Table.Root> */}
					</div>
				</VStack>
			)}
		</Container>
	);
}
