import { User } from 'next-auth';

export const validateTornApiKey = async (
	apiKey: string
): Promise<User | null> => {
	try {
		const response = await fetch(`https://api.torn.com/user/?key=${apiKey}`);
		const data = await response.json();

		if (data.error) {
			// Invalid API key
			return null;
		}

		// Return a user object
		return {
			id: data.player_id.toString(),
			faction_id: data.faction.faction_id.toString(),
			api_key: apiKey,
			role: '',
			name: data.name,
		};
	} catch (error) {
		console.error('Error validating Torn API Key:', error);
		return null;
	}
};
