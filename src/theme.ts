import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
	colors: {
		brand: {
			500: '#0D74FF',
		},
	},
	fonts: {
		heading: 'Open Sans, sans-serif',
		body: 'Inter, sans-serif',
	},
});

export default theme;
