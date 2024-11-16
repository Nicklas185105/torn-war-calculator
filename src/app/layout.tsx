import '@styles/globals.css';
import localFont from 'next/font/local';
import { Metadata } from 'next/types';
import { Footer, NavBar, Providers } from '@components/index';
import { Toaster } from '@ui/toaster';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	title: 'Torn War Calculator',
	description: 'A Torn war extension',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<Providers>
					<NavBar />
					<main>{children}</main>
					<Footer />
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
