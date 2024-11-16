'use client';

import { ChakraProvider } from '@ui/chakraProvider';
import { ColorModeProvider } from '@ui/color-mode';
import { ClerkProvider } from '@clerk/nextjs';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<ColorModeProvider>
				<ChakraProvider>{children}</ChakraProvider>
			</ColorModeProvider>
		</ClerkProvider>
	);
}
