import { Center } from '@chakra-ui/react';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <Center>{children}</Center>;
}
