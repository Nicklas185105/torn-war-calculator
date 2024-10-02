import { ApiResponse } from '../types';
import { AttackDetailsResponse } from '../types/attacks';
import { UserProfileResponse } from '../types/profile';
import { WarsApiResponse } from '../types/wars';

const apiBaseUrl = process.env.NEXTAUTH_URL;

export const fetchWarReport = async (
	warId: number,
	apiKey: string
): Promise<ApiResponse> => {
	try {
		const response = await fetch(
			`${apiBaseUrl}/fetchWarReport?warId=${warId}&apiKey=${apiKey}`
		);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data: ApiResponse = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching war report:', error);
		throw error;
	}
};

export const fetchWars = async (apiKey: string): Promise<WarsApiResponse> => {
	try {
		const response = await fetch(`${apiBaseUrl}/fetchWars?apiKey=${apiKey}`);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data: WarsApiResponse = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching wars:', error);
		throw error;
	}
};

export const fetchWarIds = async (apiKey: string): Promise<string[]> => {
	try {
		const response: WarsApiResponse = await fetchWars(apiKey);

		const data: string[] = Object.keys(response.rankedwars).map((id) => id);
		return data.reverse();
	} catch (error) {
		console.error('Error fetching war IDs:', error);
		throw error;
	}
};

export const fetchUserProfile = async (
	apiKey: string,
	userId?: number
): Promise<UserProfileResponse> => {
	try {
		console.log(
			'fetchUserProfile',
			apiKey,
			userId,
			`${apiBaseUrl}/fetchUserProfile?${
				userId !== undefined ? `userId=${userId}&` : ''
			}apiKey=${apiKey}`
		);
		const response = await fetch(
			`${apiBaseUrl}/fetchUserProfile?${
				userId !== undefined ? `userId=${userId}&` : ''
			}apiKey=${apiKey}`
		);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data: UserProfileResponse = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching user profile:', error);
		throw error;
	}
};

export const fetchAttacks = async (
	apiKey: string,
	from: number,
	to: number
): Promise<AttackDetailsResponse> => {
	try {
		const response = await fetch(
			`${apiBaseUrl}/fetchAttacks?from=${from}&to=${to}&apiKey=${apiKey}`
		);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data: AttackDetailsResponse = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching attacks:', error);
		throw error;
	}
};
