'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignIn() {
	const [apiKey, setApiKey] = useState('');

	const handleSignIn = async () => {
		// You can now pass the API key to the signIn function, or handle it manually
		if (apiKey) {
			// Optionally, use the API key for custom sign-in logic
			await signIn('credentials', { apiKey, callbackUrl: '/' });
		} else {
			alert('Please enter your API key');
		}
	};

	return (
		<div>
			<h1>Sign In</h1>
			<input
				type="text"
				placeholder="Enter your Torn API key"
				value={apiKey}
				onChange={(e) => setApiKey(e.target.value)}
			/>
			<button onClick={handleSignIn}>Sign In with Torn API</button>
		</div>
	);
}
