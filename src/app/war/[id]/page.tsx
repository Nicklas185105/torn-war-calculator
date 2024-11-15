'use client';

import { useRouter } from 'next/router';
import WarDetails from '../../../components/WarDetails';
import styles from './WarDetailsPage.module.css';

export default function WarDetailsPage() {
	const router = useRouter();
	const { id, apiKey } = router.query;

	const parsedId = id ? parseInt(id.toString(), 10) : 0;

	return (
		<div className={styles.warDetailsPage}>
			<WarDetails warId={parsedId} apiKey={apiKey as string} />
		</div>
	);
}
