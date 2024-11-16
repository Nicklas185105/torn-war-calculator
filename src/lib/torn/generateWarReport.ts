import { Reward, WarReport, WRMember } from '@ctypes/warReport';
import TornClient from './client';
import { Attack } from '@ctypes/attacks';
import { Member } from '@ctypes/index';

export const generateWarReport = async (
	userId: string,
	apiKey: string,
	warId: number
): Promise<WarReport> => {
	try {
		const tornClient = new TornClient(apiKey);
		const callingUserData = await tornClient.getUserData(userId);
		const report = await tornClient.getRankedWarReport(warId.toString());

		const factions = report.rankedwarreport.factions;
		const ownFactionId = callingUserData.faction.faction_id;
		const opponentFactionId = parseInt(
			Object.keys(factions).find(
				(factionId) => factionId !== ownFactionId.toString()
			) ?? '0',
			10
		);
		let rewards: Reward[] = [
			{
				warReportId: '',
				type: 'Respect',
				quantity: factions[ownFactionId].rewards.respect,
			},
			{
				warReportId: '',
				type: 'Points',
				quantity: factions[ownFactionId].rewards.points,
			},
		];
		rewards = rewards.concat(
			Object.entries(factions[ownFactionId].rewards.items).map(
				([, { name, quantity }]) => ({
					warReportId: '',
					type: name,
					quantity: quantity,
				})
			)
		);
		const members = Object.entries(factions[ownFactionId].members);

		// This only gets the first 100 attacks, but we need to fetch all attacks between the start and end of the war
		let attacks: Attack[] = [];
		const to = report.rankedwarreport.war.end;
		let from = report.rankedwarreport.war.start;
		while (true) {
			const attackDetails = await tornClient.getAttacks(
				ownFactionId.toString(),
				from.toString(),
				to.toString()
			);
			// console.log('from', from.toString(), 'to', to.toString());
			attacks = attacks.concat(Object.values(attackDetails.attacks));
			if (Object.values(attackDetails.attacks).length < 50) break;
			// If we have 100 attacks, there might be more, so we need to fetch more
			from = attacks[attacks.length - 1].timestamp_started; // + 1
		}

		// only save all the unique attacks
		attacks = attacks.filter(
			(attack, index, self) =>
				index === self.findIndex((t) => t.code === attack.code)
		);

		// console.log(
		// 	'attacks',
		// 	attacks.filter(
		// 		(attack) =>
		// 			attack.ranked_war === 0 && attack.attacker_faction === ownFactionId
		// 	)
		// );

		// Aggregate all the data into your war report structure
		const warReport: WarReport = {
			factionName: factions[ownFactionId].name,
			factionScore: factions[ownFactionId].score,
			opponentFactionName: factions[opponentFactionId].name,
			opponentFactionScore: factions[opponentFactionId].score,
			outcome:
				report.rankedwarreport.war.winner === ownFactionId
					? 'VICTORY!'
					: 'DEFEAT!',
			startDate: new Date(report.rankedwarreport.war.start * 1000),
			endDate: new Date(report.rankedwarreport.war.end * 1000),
			totalTime:
				new Date(report.rankedwarreport.war.start * 1000).getTime() -
				new Date(report.rankedwarreport.war.end * 1000).getTime() / 1000,
			factionRewardTotal: 0,
			factionTakeaway: 20,
			expenseStatSpies: 0,
			expenseRevives: 0,
			expenseBountyMerc: 0,
			expenseChainWatcher: 0,
			expenseXanax: 0,
			expensesTotal: 0,
			netRewardForPayout: 0,
			rewards: rewards,
			totalWarHits: calculateTotalHits(attacks, ownFactionId, 1),
			totalNonWarHits: calculateTotalHits(attacks, ownFactionId, 0),
			weightedScoreFormula:
				'(2 x War Hits  x Fair Fight Average ) + Assists + Retals + (0.5 x Non-War Hits) + (0.5 x Loss)',
			payoutPerPoint: 0,
			totalPayout: 0,
			totalWeightedScore: 0,
			totalWarlord: 0,
			totalRespect: 0,
			totalChainBonus: 0,
			warId: report.rankedwarreport.war.id,
			members: members.map(
				([memberId, member]: [string, Member]) =>
					({
						warReportId: '',
						name: member.name,
						id: parseInt(memberId, 10),
						totalPayout: 0,
						weightedScore: calculateWeightedScoreFormulaA(attacks, memberId),
						warlord: calculateWarlord(attacks, memberId),
						hits: attacks.filter(
							(attack) => attack.attacker_id === parseInt(memberId, 10)
						),
						warHits: calculateHits(attacks, memberId, 1),
						nonWarHits: calculateHits(attacks, memberId, 0),
						respect: parseFloat(
							attacks
								.filter(
									(attack) =>
										attack.attacker_id === parseInt(memberId, 10) &&
										attack.modifiers.chain_bonus < 10
								)
								.reduce((sum, attack) => sum + attack.respect, 0)
								.toFixed(2)
						),
						chainBonus: attacks
							.filter(
								(attack) =>
									attack.attacker_id === parseInt(memberId, 10) &&
									attack.modifiers.chain_bonus >= 10
							)
							.reduce((sum, attack) => sum + attack.modifiers.chain_bonus, 0),
						totalScore:
							report.rankedwarreport.factions[ownFactionId].members[memberId]
								.score,
						fairFightAverage: calculateFairFightAverage(attacks, memberId),
						attackDetails: {
							leave: calculateTotalAttackType(attacks, memberId, 'Attacked'),
							mug: calculateTotalAttackType(attacks, memberId, 'Mugged'),
							hosp: calculateTotalAttackType(attacks, memberId, 'Hospitalized'),
							assist: calculateTotalAttackType(attacks, memberId, 'Assist'),
							retal: attacks.filter(
								(attack) =>
									attack.attacker_id === parseInt(memberId, 10) &&
									attack.modifiers.retaliation > 1
							).length,
							overseas: calculateTotalAttackType(attacks, memberId, 'Overseas'),
							draw: calculateTotalAttackType(attacks, memberId, 'Stalemate'),
							escape: calculateTotalAttackType(attacks, memberId, 'Escape'),
							loss: calculateTotalAttackType(attacks, memberId, 'Lost'),
							interrupted: calculateTotalAttackType(
								attacks,
								memberId,
								'Interrupted'
							),
							stealthed: attacks.filter(
								(attack) =>
									attack.attacker_id === parseInt(memberId, 10) &&
									attack.stealthed === 1
							).length,
						},
						defendDetails: {
							stealthed: 0,
							defendsWon: 0,
							defendsLost: 0,
							respectLost: 0,
							enemyScoreGained: 0,
						},
					} as WRMember)
			),
		};

		// calculate the total payout, total weighted score, total warlord, total respect, and total chain bonus
		// warReport.totalPayout = warReport.members.reduce(
		// 	(sum, member) => sum + member.totalPayout,
		// 	0
		// );
		warReport.totalWeightedScore = warReport.members.reduce(
			(sum, member) => sum + member.weightedScore,
			0
		);
		warReport.totalWarlord = warReport.members.reduce(
			(sum, member) => sum + member.warlord,
			0
		);
		warReport.totalRespect = warReport.members.reduce(
			(sum, member) => sum + member.respect,
			0
		);
		warReport.totalChainBonus = warReport.members.reduce(
			(sum, member) => sum + member.chainBonus,
			0
		);
		// warReport.payoutPerPoint =
		// 	warReport.netRewardForPayout / warReport.totalWeightedScore;

		// console.log(
		// 	'warReport',
		// 	warReport.members.filter((member) => member.id === 2540367)[0].hits[0]
		// );
		return warReport;
	} catch (error) {
		console.error('Error generating war report:', error);
		throw error;
	}
};

const calculateTotalHits = (
	attacks: Attack[],
	ownFactionId: number,
	warHit: number
): number => {
	return attacks.filter(
		(attack) =>
			attack.attacker_faction === ownFactionId &&
			attack.ranked_war === warHit &&
			(attack.result === 'Attacked' ||
				attack.result === 'Mugged' ||
				attack.result === 'Hospitalized' ||
				attack.result === 'Special')
	).length;
};

const calculateHits = (
	attacks: Attack[],
	memberId: string,
	warHit: number
): number => {
	return attacks.filter(
		(attack) =>
			attack.attacker_id === parseInt(memberId, 10) &&
			attack.ranked_war === warHit &&
			(attack.result === 'Attacked' ||
				attack.result === 'Mugged' ||
				attack.result === 'Hospitalized' ||
				attack.result === 'Special')
	).length;
};

const calculateFairFightAverage = (
	attacks: Attack[],
	memberId: string
): number => {
	const filteredAttacks = attacks.filter(
		(attack) =>
			attack.attacker_id === parseInt(memberId, 10) &&
			(attack.result === 'Attacked' ||
				attack.result === 'Mugged' ||
				attack.result === 'Hospitalized' ||
				attack.result === 'Special')
	);

	const fairFightSum = filteredAttacks.reduce(
		(sum, attack) => sum + attack.modifiers.fair_fight,
		0
	);

	return filteredAttacks.length > 0 ? fairFightSum / filteredAttacks.length : 0;
};

const calculateTotalAttackType = (
	attacks: Attack[],
	memberId: string,
	attackType: string
): number => {
	return attacks.filter(
		(attack) =>
			attack.attacker_id === parseInt(memberId, 10) &&
			attack.result === attackType
	).length;
};

const calculateWeightedScoreFormulaA = (
	attacks: Attack[],
	memberId: string
): number => {
	const warHits =
		2 *
		calculateHits(attacks, memberId, 1) *
		calculateFairFightAverage(attacks, memberId);
	const assists = calculateTotalAttackType(attacks, memberId, 'Assist');
	const retals = attacks.filter(
		(attack) =>
			attack.attacker_id === parseInt(memberId, 10) &&
			attack.modifiers.retaliation > 1
	).length;
	const nonWarHits = 0.5 * calculateHits(attacks, memberId, 0);
	const loss = 0.5 * calculateTotalAttackType(attacks, memberId, 'Lost');
	return warHits + assists + retals + nonWarHits + loss;
};

const calculateWarlord = (attacks: Attack[], memberId: string): number => {
	const warHits = calculateHits(attacks, memberId, 1);
	const nonWarHits = 0.5 * calculateHits(attacks, memberId, 0);
	return warHits + nonWarHits;
};

// enum attackResults {
// 	'Attacked' = 'leave',
// 	'Mugged' = 'mug',
// 	'Hospitalized' = 'hosp',
// 	'Assist' = 'assist',
// 	// retal
// 	// overseas
// 	'Stalemate' = 'draw',
// 	'Escape' = 'escape',
// 	'Lost' = 'loss',
// 	'Interrupted' = 'interrupted',
// 	'stealthed' = "stealthed = 1",
// }
