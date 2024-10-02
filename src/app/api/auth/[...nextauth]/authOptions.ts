import { getServerSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { createClient } from '../../../../lib/supabaseClient';
import { UserProfileResponse } from '../../../../types/profile';

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Torn API',
			credentials: {
				apiKey: { label: 'Torn API Key', type: 'text' },
			},
			async authorize(credentials) {
				try {
					const response = await axios.get(
						`https://api.torn.com/user/?key=${credentials?.apiKey}`
					);

					if (response.data.error) {
						throw new Error(response.data.error.error);
					}

					const userData = response.data as UserProfileResponse;

					const supabaseClient = createClient();

					const { data: user, error } = await supabaseClient
						.from('users')
						.select('*')
						.eq('torn_id', userData.player_id)
						.single();

					if (error || !user) {
						const { data: newUser, error: insertError } = await supabaseClient
							.from('users')
							.insert([
								{
									torn_id: userData.player_id.toString(),
									faction_id: userData.faction.faction_id.toString(),
									role: 'member',
								},
							])
							.select('*')
							.single();

						if (insertError) {
							throw new Error(insertError.message);
						}

						return newUser;
					}

					return user;
				} catch (error) {
					console.error('Error authorizing user:', error);
					return null;
				}
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.faction_id = user.faction_id;
				token.api_key = user.api_key;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id as string;
			session.user.role = token.role as string;
			session.user.faction_id = token.faction_id as string;
			session.user.api_key = token.api_key as string;
			return session;
		},
	},
	pages: {
		signIn: '/auth/signin',
	},
};

export const getServerAuthSession = () => getServerSession(authOptions);
