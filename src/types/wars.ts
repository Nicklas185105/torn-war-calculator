export interface WarsApiResponse {
	rankedwars: Record<number, RankedWar>;
}

export interface War {
	start: number;
	end: number;
	target: number;
	winner: number;
}

export interface Faction {
	name: string;
	score: number;
	chain: number;
}

export interface RankedWar {
	factions: Record<number, Faction>;
	war: War;
}
