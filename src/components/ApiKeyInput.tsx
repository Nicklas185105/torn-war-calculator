'use client';

import React, { useEffect } from 'react';
import styles from './ApiKeyInput.module.css';

interface ApiKeyInputProps {
	apiKey: string;
	setApiKey: (apiKey: string) => void;
	handleFetchData: () => Promise<void>;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
	apiKey,
	setApiKey,
	handleFetchData,
}) => {
	useEffect(() => {
		// const savedApiKey = localStorage.getItem('apiKey');
		// if (savedApiKey) {
		// 	setApiKey(savedApiKey);
		// }
	}, [setApiKey]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newApiKey = e.target.value;
		setApiKey(newApiKey);
		// localStorage.setItem('apiKey', newApiKey); // Save the API key to localStorage
	};

	return (
		<div className={styles.inputContainer}>
			<input
				type="text"
				placeholder="Enter API Key"
				value={apiKey}
				onChange={handleInputChange}
				className={styles.input}
			/>
			<button onClick={handleFetchData}>Fetch Data</button>
		</div>
	);
};

export default ApiKeyInput;
