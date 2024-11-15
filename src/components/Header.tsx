'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import React from 'react';
import styles from './Header.module.css';
import Link from 'next/link';

const Header: React.FC = () => {
	const { data: session } = useSession();

	return (
		<header className={styles.header}>
			<h1>Faction Overview Dashboard</h1>
			<nav className={styles.nav}>
				<Link href="/">Home</Link>
				<Link href="/war-reports">War Reports</Link>
				<Link href="/settings">Settings</Link>
				{session ? (
					<>
						{session.user.role === 'leader' && <a href="/admin">Admin Panel</a>}
						<button onClick={() => signOut()}>Sign Out</button>
					</>
				) : (
					<button onClick={() => signIn()}>Sign In</button>
				)}
			</nav>
		</header>
	);
};

export default Header;
