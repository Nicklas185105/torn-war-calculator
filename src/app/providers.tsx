'use client';

import { ChakraProvider } from '@/components/ui/chakraProvider';
import { ColorModeProvider } from '@/components/ui/color-mode';
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
