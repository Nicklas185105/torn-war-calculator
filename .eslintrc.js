module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json', // Specify it only if you have rules which require type information
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	extends: [
		// Your existing configurations
		'plugin:@typescript-eslint/recommended',
		// 'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'next/core-web-vitals',
		'next/typescript',
	],
	rules: {
		// Your custom rules
	},
	ignorePatterns: ['src/types/database.types.ts'], // Exclude the generated types if needed
};
