'use client';

import React from 'react';
import styles from './Header.module.css';
import Link from 'next/link';

const Header: React.FC = () => (
	<header className={styles.header}>
		<h1>Faction Overview Dashboard</h1>
		<nav className={styles.nav}>
			<Link href="/">Home</Link>
			<Link href="/war-reports">War Reports</Link>
			<Link href="/settings">Settings</Link>
		</nav>
	</header>
);

export default Header;
