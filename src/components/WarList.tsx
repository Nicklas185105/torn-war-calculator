'use client';

import React, { useState, useEffect } from 'react';
import styles from './WarList.module.css';
import { RankedWar } from '../types/wars';
import he from 'he';
import { useRouter } from 'next/router';

interface WarListProps {
	wars: Record<number, RankedWar>;
	apiKey: string;
}

const WarList: React.FC<WarListProps> = ({ wars, apiKey }) => {
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [filteredWars, setFilteredWars] = useState<Record<number, RankedWar>>(
		{}
	);

	const router = useRouter();

	useEffect(() => {
		const filtered: Record<number, RankedWar> = {};
		Object.entries(wars).forEach(([id, war]) => {
			if (
				Object.values(war.factions).some((faction) =>
					faction.name.toLowerCase().includes(searchTerm.toLowerCase())
				)
			) {
				filtered[parseInt(id, 10)] = war;
			}
		});
		setFilteredWars(filtered);
	}, [searchTerm, wars]);

	const sortedWars = Object.entries(filteredWars).sort(
		([, a], [, b]) => b.war.start - a.war.start
	);

	const handleRowClick = (id: number) => {
		router.push({
			pathname: `/war/${id}`,
			query: { apiKey },
		});
	};

	return (
		<div className={styles.warList}>
			<h2>All Wars</h2>
			<input
				type="text"
				placeholder="Search by Faction Name"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className={styles.searchInput}
			/>
			<table className={styles.table}>
				<thead>
					<tr>
						<th className={styles.th}>War ID</th>
						<th className={styles.th}>Faction Names</th>
						<th className={styles.th}>Start Date</th>
						<th className={styles.th}>End Date</th>
						<th className={styles.th}>Result</th>
					</tr>
				</thead>
				<tbody>
					{sortedWars.map(([id, war]) => (
						<tr
							key={id}
							className={styles.tr}
							onClick={() => handleRowClick(parseInt(id, 10))}
						>
							<td className={styles.td}>{id}</td>
							<td className={styles.td}>
								{Object.values(war.factions)
									.map((faction) => he.decode(faction.name))
									.join(', ')}
							</td>
							<td className={styles.td}>
								{new Date(war.war.start * 1000).toLocaleString()}
							</td>
							<td className={styles.td}>
								{war.war.end === 0
									? ''
									: new Date(war.war.end * 1000).toLocaleString()}
							</td>
							<td className={styles.td}>
								{/* {war.war.winner === war.factions ? 'Ongoing' : 'Completed'} */}
								{/* Find the war.war.winner in the war.factions record by the number */}
								{war.war.winner === 0
									? 'Ongoing'
									: he.decode(war.factions[war.war.winner].name)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default WarList;
