// ----- Response Types -----

export interface UserProfileResponse {
	user_id: number;
	name: string;
	level: number;
	gender: string;
	age: number;
	rank: string;
	property: string;
	signup: string;
	awards: number;
	friends: number;
	enemies: number;
	forum_posts: number;
	karma: number;
	role: string;
	donator: number;
	player_id: number;
	status: string;
	last_action: LastAction;
	faction: Faction;
	job: Job;
	married: Married;
	profile: string;
}

export interface RankedWarsResponse {
	rankedwars: Record<number, RankedWar>;
}

export interface AttacksResponse {
	attacks: {
		[key: string]: Attack;
	};
}

export interface RankedWarReportResponse {
	rankedwarreport: RankedWar;
}

// ----- Extra Types -----

export interface LastAction {
	status: string;
	timestamp: number;
}

export interface Faction {
	faction_id: number;
	faction_name: string;
	position: string;
	days_in_faction: number;
}

export interface Job {
	company_id: number;
	company_name: string;
	position: string;
	days_in_company: number;
}

export interface Married {
	spouse_id: number;
	spouse_name: string;
	duration: number;
}

export interface War {
	id: number;
	factionName: string;
	start: number;
	end: number;
	target: number;
	winner: number;
	status: string;
}

export interface Faction {
	name: string;
	score: number;
	chain: number;
}

export interface Faction {
	name: string;
	score: number;
	chain: number;
	attacks: number;
	rank_before: string;
	rank_after: string;
	rewards: {
		respect: number;
		points: number;
		items: { [key: string]: Item };
	};
	members: { [key: string]: Member };
}

export interface Item {
	name: string;
	quantity: number;
}

export interface Member {
	name: string;
	faction_id: number;
	level: number;
	attacks: number;
	score: number;
}

export interface RankedWar {
	factions: Record<number, Faction>;
	war: War;
}

export interface Attack {
	code: string;
	timestamp_started: number;
	timestamp_ended: number;
	attacker_id: number;
	attacker_name: string;
	attacker_faction: number;
	attacker_factionname: string;
	defender_id: number;
	defender_name: string;
	defender_faction: number;
	defender_factionname: string;
	result: string;
	stealthed: number;
	respect: number;
	chain: number;
	raid: number;
	ranked_war: number;
	respect_gain: number;
	respect_loss: number;
	modifiers: Modifiers;
}

export interface Modifiers {
	fair_fight: number;
	war: number;
	retaliation: number;
	group_attack: number;
	overseas: number;
	chain_bonus: number;
}
