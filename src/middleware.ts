// import { withAuth } from 'next-auth/middleware';
// import { updateSession } from '@/lib/middleware';

// export default withAuth(
// 	async function middleware(req) {
// 		return await updateSession(req);
// 	},
// 	{
// 		callbacks: {
// 			authorized: ({ token }) => !!token,
// 		},
// 	}
// );

// export const config = {
// 	matcher: [
// 		'/admin/:path*',
// 		'/dashboard/:path*',
// 		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
// 	],
// };

import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
	// publicRoutes: ['/', '/signin(.*)', '/signup(.*)'],
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
