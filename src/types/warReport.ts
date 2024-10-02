export interface WarReport {
	factionName: string;
	factionScore: number;
	opponentFactionName: string;
	opponentFactionScore: number;
	outcome: string; // "Victory" or "Defeat"
	startDate: Date;
	endDate: Date;
	totalTime: number;
	factionRewardTotal: number;
	factionTakeaway: number;
	expenses: Expense[];
	netRewardForPayout: number;
	rewards: Reward[];
	totalWarHits: number;
	totalNonWarHits: number;
	weightedScoreFormula: string;
	payoutPerPoint: number;
	warId: number;
	members: WRMember[];
}

export interface Expense {
	warReportId: string;
	description: string;
	amount: number;
}

export interface Reward {
	warReportId: string;
	type: string; // "Respect", "Points", etc.
	quantity: number;
}

export interface WRMember {
	warReportId: string;
	name: string;
	id: number;
	totalPayout: number;
	weightedScore: number;
	warlord: number;
	warHits: number;
	nonWarHits: number;
	respect: number;
	chainBonus: number;
	totalScore: number;
	fairFightAverage: number;
	attackDetails: AttackDetails;
	defendDetails: DefendDetails;
}

export interface AttackDetails {
	memberId: string;
	leave: number;
	mug: number;
	hosp: number;
	assist: number;
	retal: number;
	overseas: number;
	draw: number;
	escape: number;
	loss: number;
	interrupted: number;
	stealthed: number;
}

export interface DefendDetails {
	memberId: string;
	stealthed: number;
	defendsWon: number;
	defendsLost: number;
	respectLost: number;
	enemyScoreGained: number;
}
