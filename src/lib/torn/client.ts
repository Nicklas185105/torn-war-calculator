/* eslint-disable @typescript-eslint/no-explicit-any */
// tornClient.ts

import { ApiResponse } from '@ctypes/index';
import { UserProfileResponse } from '@ctypes/profile';
import axios, { AxiosInstance } from 'axios';

class TornClient {
	private apiKey: string;
	private axiosInstance: AxiosInstance;
	private baseUrl: string = 'https://api.torn.com';

	constructor(apiKey: string) {
		this.apiKey = apiKey;

		this.axiosInstance = axios.create({
			baseURL: this.baseUrl,
			params: {
				key: this.apiKey,
			},
		});
	}

	private async makeRequest(
		selection: string,
		endpoint: string,
		params?: Record<string, any>
	): Promise<any> {
		try {
			const response = await this.axiosInstance.get(
				`/${selection}/${endpoint}`,
				{
					params: {
						key: this.apiKey,
						...params,
					},
				}
			);
			if (response.data.error) {
				throw new Error(response.data.error.error);
			}
			return response.data;
		} catch (error) {
			console.error('Torn API Error:', error);
			throw error;
		}
	}

	public async getUserData(userId: string = '0'): Promise<UserProfileResponse> {
		return this.makeRequest('user', userId);
	}

	public async getRankedWarReport(warId: string): Promise<ApiResponse> {
		const selections = 'rankedwarreport';
		return this.makeRequest('torn', warId, { selections });
	}

	public async getWars(factionId: string): Promise<any> {
		const selections = 'rankedwars';
		return this.makeRequest('faction', factionId, { selections });
	}

	public async getWarIds(factionId: string): Promise<string[]> {
		const wars = await this.getWars(factionId);
		const data: string[] = Object.keys(wars.rankedwars).map((id) => id);
		return data;
	}

	public async getAttacks(
		factionId: string,
		from: string,
		to: string
	): Promise<any> {
		const selections = 'attacks';
		return this.makeRequest('faction', factionId, { selections, from, to });
	}
}

export default TornClient;
