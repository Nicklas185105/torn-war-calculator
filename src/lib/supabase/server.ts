import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { auth } from '@clerk/nextjs/server';

export async function createClient() {
	const cookieStore = await cookies();
	const { getToken } = await auth();

	if (!getToken) {
		throw new Error('No Clerk token found');
	}

	const token = await getToken({
		template: 'supabase',
	});

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						);
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
			global: {
				// Get the custom Supabase token from Clerk
				fetch: async (url: RequestInfo | URL, options = {} as RequestInit) => {
					// The Clerk `session` object has the getToken() method
					const clerkToken = token;

					// Insert the Clerk Supabase token into the headers
					const headers = new Headers(options?.headers);
					headers.set('Authorization', `Bearer ${clerkToken}`);

					// Call the default fetch
					return fetch(url, {
						...options,
						headers,
					});
				},
			},
		}
	);
}
