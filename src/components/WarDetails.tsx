'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RankedWarReport } from '../types';
import styles from './WarDetails.module.css';

interface WarDetailsProps {
	warId: number;
	apiKey: string;
}

const WarDetails: React.FC<WarDetailsProps> = () => {
	const [warReport, setWarReport] = useState<RankedWarReport | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const handleFetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			// const data = await fetchWarReport(warId, apiKey);
			// setWarReport(data.rankedwarreport);
			setWarReport(null);
		} catch (Error: unknown) {
			setError((Error as Error).message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		handleFetchData();
	}, [handleFetchData]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error: {error}</p>;
	}

	return (
		<div className={styles.warDetails}>
			{loading && <div>Loading...</div>}
			{error && <div>Error: {error}</div>}
			{warReport && (
				<div>
					<h2>War Details</h2>
					<p>Start: {new Date(warReport.war.start * 1000).toLocaleString()}</p>
					<p>End: {new Date(warReport.war.end * 1000).toLocaleString()}</p>
					<p>Winner: {warReport.war.winner}</p>
					<h2>Factions</h2>
					{Object.entries(warReport.factions).map(
						([factionId, factionData]) => (
							<div key={factionId}>
								<h3>{factionData.name}</h3>
								<p>Score: {factionData.score}</p>
								<p>Attacks: {factionData.attacks}</p>
								<h4>Members</h4>
								<table>
									<thead>
										<tr>
											<th>Name</th>
											<th>Level</th>
											<th>Attacks</th>
											<th>Score</th>
										</tr>
									</thead>
									<tbody>
										{Object.entries(factionData.members).map(
											([memberId, memberData]) => (
												<tr key={memberId}>
													<td>{memberData.name}</td>
													<td>{memberData.level}</td>
													<td>{memberData.attacks}</td>
													<td>{memberData.score}</td>
												</tr>
											)
										)}
									</tbody>
								</table>
							</div>
						)
					)}
				</div>
			)}
		</div>
	);
};

export default WarDetails;
