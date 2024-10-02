'use client';

import React, { useState, useEffect } from 'react';
import { WarSum } from '../types';
import styles from './WarSummary.module.css';
import { RankedWar } from '../types/wars';

interface WarSummaryProps {
	wars: Record<number, RankedWar>;
}

const WarSummary: React.FC<WarSummaryProps> = ({ wars }) => {
	const [summary, setSummary] = useState<WarSum | null>(null);

	useEffect(() => {
		if (wars) {
			// count total wars
			const totalWars = Object.keys(wars).length;

			// find ongoing war
			const ongoingWar = Object.values(wars).find((war) => war.war.end === 0);

			setSummary({
				total: totalWars,
				ongoingWar,
			});
		}
	}, [wars]);

	return (
		<div className={styles.warSummary}>
			<h2>War Summary</h2>
			{summary ? (
				<div>
					<p>Total Wars: {summary.total}</p>
					<p>Ongoing War: {summary.ongoingWar ? 'ONGOING' : 'NO WAR'}</p>
				</div>
			) : (
				<p>No data available</p>
			)}
		</div>
	);
};

export default WarSummary;
