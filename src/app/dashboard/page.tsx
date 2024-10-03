'use client';

import { useState, useCallback, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { redirect } from 'next/navigation';
import ApiKeyInput from '../../components/ApiKeyInput';
import WarList from '../../components/WarList';
import WarSummary from '../../components/WarSummary';
import { ApiResponse } from '../../types';
import { RankedWar } from '../../types/wars';
import { fetchWars } from '../../utils/api';
import { getSession } from 'next-auth/react';

export default function Home() {
	const session = getSession();

	if (!session) {
		redirect('/auth/signin');
	}

	const [apiKey, setApiKey] = useState<string>(() => {
		return /*localStorage.getItem('apiKey') ||*/ '';
	});
	const [wars, setWars] = useState<Record<number, RankedWar>>();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleFetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchWars(apiKey);
			setWars(data.rankedwars);
		} catch (Error: unknown) {
			setError((Error as Error).message);
		} finally {
			setLoading(false);
		}
	}, [apiKey]);

	const clearApiKey = () => {
		// localStorage.removeItem('apiKey');
		setApiKey('');
	};

	useEffect(() => {
		if (apiKey) {
			handleFetchData(); // Automatically fetch data if an API key is found
		}
	}, [apiKey, handleFetchData]);

	const fetchWarReport = async (warID: number, apiKey: string) => {
		const response = await fetch(
			`https://api.torn.com/torn/${warID}?selections=rankedwarreport&key=${apiKey}`
		);
		const warData = (await response.json()) as ApiResponse;

		const factions = warData.rankedwarreport.factions;

		// Prepare an array to store each faction's details
		const factionDetails = [];

		// Iterate over the factions object
		for (const [factionId, factionData] of Object.entries(factions)) {
			const members = factionData.members;
			const memberDetails = [];

			// Iterate over the members object
			for (const [memberId, memberData] of Object.entries(members)) {
				// Add the member details to the memberDetails array
				memberDetails.push({
					memberId,
					...memberData,
				});
			}

			// Add the faction and its members to the factionDetails array
			factionDetails.push({
				factionId,
				...factionData,
				members: memberDetails,
			});
		}

		console.log(factionDetails);

		const factionAResponse = await fetch(
			`https://api.torn.com/faction/${factionDetails[0].factionId}?selections=basic,chains,attacksfull&key=${apiKey}`
		);
		const factionAData = await factionAResponse.json();

		const factionBResponse = await fetch(
			`https://api.torn.com/faction/${factionDetails[1].factionId}?selections=basic,chains,attacksfull&key=${apiKey}`
		);
		const factionBData = await factionBResponse.json();

		// Example: Fetch member data (loop over all members involved in the war)
		const memberData = [];
		for (const memberID of factionDetails[0].members.concat(
			factionDetails[1].members
		)) {
			const memberResponse = await fetch(
				`https://api.torn.com/user/${memberID}?selections=basic,attacks&key=${apiKey}`
			);
			const memberDetails = await memberResponse.json();
			memberData.push(memberDetails);
		}

		// Aggregate all the data into your war report structure
		const warReport = {
			warDetails: warData.rankedwarreport,
			factionA: factionAData,
			factionB: factionBData,
			members: memberData,
		};

		console.log(warReport);

		return warReport;
	};

	// fetchWarReport(2654, 'YOUR_API_KEY')
	// 	.then((report) => console.log(report))
	// 	.catch((error) => console.error('Error fetching war report:', error));

	return (
		<div className={styles.dashboard}>
			<ApiKeyInput
				apiKey={apiKey}
				setApiKey={setApiKey}
				handleFetchData={handleFetchData}
			/>
			{apiKey && <button onClick={clearApiKey}>Clear API Key</button>}
			{/* Run the fetchWarReport function and print the result on a button click */}
			<button onClick={() => fetchWarReport(2654, apiKey)} disabled={!apiKey}>
				Fetch War Report
			</button>
			{loading && <div>Fetching...</div>}
			{error && <div>Error: {error}</div>}
			{wars && (
				<>
					<WarSummary wars={wars} />
					<WarList wars={wars} apiKey={apiKey} />
				</>
			)}
		</div>
	);
}
