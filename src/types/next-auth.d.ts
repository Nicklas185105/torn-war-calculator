/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';

declare module 'next-auth' {
	interface User {
		id: string;
		role: string;
		faction_id: string;
		api_key: string;
	}

	interface Session {
		user: {
			id: string;
			role: string;
			faction_id: string;
			api_key: string;
		};
	}

	interface JWT {
		id: string;
		role: string;
		faction_id: string;
		api_key: string;
	}
}
