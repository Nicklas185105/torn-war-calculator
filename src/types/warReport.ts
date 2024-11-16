// Generated War Report Types

export interface GeneratedResponse {
	factionId: string;
	report: WarReport;
}

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
	expenseStatSpies: number;
	expenseRevives: number;
	expenseBountyMerc: number;
	expenseChainWatcher: number;
	expenseXanax: number;
	expensesTotal: number;
	netRewardForPayout: number;
	rewards: Reward[];
	totalWarHits: number;
	totalNonWarHits: number;
	weightedScoreFormula: string;
	payoutPerPoint: number;
	totalPayout: number;
	totalWeightedScore: number;
	totalWarlord: number;
	totalRespect: number;
	totalChainBonus: number;
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
