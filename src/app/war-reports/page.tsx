'use client';

import classNames from 'classnames';
import { useState, useCallback, useEffect } from 'react';
import { WarReport } from '../../types/warReport';
import { fetchWarIds } from '../../utils/api';
import { generateWarReport } from '../../utils/generateWarReport';
import styles from './WarReport.module.css';
import { redirect } from 'next/navigation';
import { getSession } from 'next-auth/react';

export default function GenerateWarReport() {
	const session = getSession();

	if (!session) {
		redirect('/auth/signin');
	}

	const [warId, setWarId] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [warIds, setWarIds] = useState<string[]>([]);
	const [generatedReport, setGeneratedReport] = useState<WarReport | null>(
		null
	);

	const savedApiKey = localStorage.getItem('apiKey') ?? '';

	const handleFetchWarIds = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchWarIds(savedApiKey);
			setWarIds(data);
			setWarId(parseInt(data[0], 10));
		} catch (Error: unknown) {
			setError((Error as Error).message);
		} finally {
			setLoading(false);
		}
	}, [savedApiKey]);

	useEffect(() => {
		if (savedApiKey) {
			handleFetchWarIds(); // Automatically fetch data if an API key is found
		}
	}, [savedApiKey, handleFetchWarIds]);

	const handleGenerateReport = async () => {
		setLoading(true);
		setError(null);
		try {
			setGeneratedReport(await generateWarReport(savedApiKey, warId));
		} catch (Error: unknown) {
			setError((Error as Error).message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.page}>
			<h2>Generate War Report</h2>
			<select
				value={warId}
				onChange={(e) => setWarId(parseInt(e.target.value, 10))}
			>
				<option value="" disabled>
					Select War ID
				</option>
				{warIds.map((id) => (
					<option key={id} value={id}>
						War ID {id}
					</option>
				))}
			</select>
			<button onClick={handleGenerateReport} disabled={loading}>
				{loading ? 'Generating...' : 'Generate Report'}
			</button>
			{error && <p>Error: {error}</p>}
			{generatedReport && (
				<>
					<div
						className={classNames(styles.header, {
							[styles.win]: generatedReport.outcome === 'VICTORY!',
							[styles.loss]: generatedReport.outcome === 'DEFEAT!',
						})}
					>
						<h2>
							{generatedReport.factionName}: {generatedReport.factionScore} vs{' '}
							{generatedReport.opponentFactionName}:{' '}
							{generatedReport.opponentFactionScore}
						</h2>
					</div>
					<div className={styles.container}>
						<table>
							<tbody>
								<tr>
									<td>Faction Reward Total</td>
									<td></td>
								</tr>
								<tr>
									<td>Faction Takeaway</td>
									<td>
										<div className={styles.double}>
											<p>20%</p>
											<p></p>
										</div>
									</td>
								</tr>
								<tr>
									<td>Expense - Stats Spies</td>
									<td></td>
								</tr>
								<tr>
									<td>Expense - revives</td>
									<td></td>
								</tr>
								<tr>
									<td>Expense - Bounty / Merc</td>
									<td></td>
								</tr>
								<tr>
									<td>Expense - Chain watcher</td>
									<td></td>
								</tr>
								<tr>
									<td>Expense - Xanax & other</td>
									<td></td>
								</tr>
								<tr>
									<td>Expense total</td>
									<td></td>
								</tr>
								<tr>
									<td>Net reward for payout</td>
									<td></td>
								</tr>
							</tbody>
						</table>
						<div style={{ gap: '20px' }}>
							<div className={styles.container2}>
								<div className={styles.box}>
									<h3>Respect</h3>
									<p>
										{
											generatedReport.rewards.find((r) => r.type === 'Respect')
												?.quantity
										}
									</p>
								</div>
								<div className={styles.box}>
									<h3>Points</h3>
									<p>
										{
											generatedReport.rewards.find((r) => r.type === 'Points')
												?.quantity
										}
									</p>
								</div>
								<div className={styles.box}>
									<h3>Payout per Weighted Score Point</h3>
									<p>0$</p>
								</div>
							</div>
							<div className={styles.container2}>
								<div className={styles.box}>
									<h3>Total War Hits</h3>
									<p>{generatedReport.totalWarHits}</p>
								</div>
								<div className={styles.box}>
									<h3>Total Non-War Hits</h3>
									<p>{generatedReport.totalNonWarHits}</p>
								</div>
								<div className={styles.box}>
									<h3>Rewards</h3>
									{generatedReport.rewards
										.filter((r) => r.type !== 'Respect' && r.type !== 'Points')
										.map((reward, i) => (
											<p key={i}>
												{reward.quantity} {reward.type}
											</p>
										))}
								</div>
							</div>
						</div>
					</div>
					<div>
						{/* Table showcasing all the members from the users clan */}
						<table>
							<thead>
								<tr>
									<th>Member</th>
									<th>Total Payout</th>
									<th>War Hits</th>
									<th>Non-War Hits</th>
									<th>Respect</th>
									<th>Chain Bonus</th>
									<th>Total Score</th>
								</tr>
							</thead>
							<tbody>
								{generatedReport.members
									.sort((a, b) => {
										if (b.totalPayout === a.totalPayout) {
											return b.respect - a.respect;
										}
										return b.totalPayout - a.totalPayout;
									})
									.map((member, i: number) => (
										<tr key={i}>
											<td>
												{member.name} [{member.id}]
											</td>
											<td>{member.totalPayout}</td>
											<td>{member.warHits}</td>
											<td>{member.nonWarHits}</td>
											<td>{member.respect}</td>
											<td>{member.chainBonus}</td>
											<td>{member.totalScore}</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</>
			)}
		</div>
	);
}
