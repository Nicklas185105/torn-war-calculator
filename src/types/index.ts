// import type { RankedWar } from './wars';

// export { RankedWar };

// export interface Member {
// 	name: string;
// 	faction_id: number;
// 	level: number;
// 	attacks: number;
// 	score: number;
// }

// export interface Faction {
// 	name: string;
// 	score: number;
// 	attacks: number;
// 	rank_before: string;
// 	rank_after: string;
// 	rewards: {
// 		respect: number;
// 		points: number;
// 		items: { [key: string]: Item };
// 	};
// 	members: { [key: string]: Member };
// }

// export interface Item {
// 	name: string;
// 	quantity: number;
// }

// export interface War {
// 	start: number;
// 	end: number;
// 	winner: number;
// 	forfeit: number;
// }

// export interface RankedWarReport {
// 	war: War;
// 	factions: { [key: string]: Faction };
// }

// export interface RankedWarReportResponse {
// 	rankedwarreport: RankedWarReport;
// }

// export interface War {
// 	id: number;
// 	factionName: string;
// 	startDate: string;
// 	endDate: string;
// 	status: string;
// }

// export interface WarDetails {
// 	warId: number;
// 	factionName: string;
// 	startDate: number;
// 	endDate: number;
// 	winner: string;
// 	loser: string;
// 	status: string;
// 	members: Array<{
// 		name: string;
// 		level: number;
// 		attacks: number;
// 		score: number;
// 	}>;
// }
// export interface WarSum {
// 	total: number;
// 	ongoingWar: RankedWar | undefined;
// }
