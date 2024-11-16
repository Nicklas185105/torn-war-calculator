'use client';

import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => (
	<footer className={styles.footer}>
		<p>&copy; 2024 Torn War Calculator. All rights reserved.</p>
		{/* <nav className={styles.nav}>
			<a href="/about">About</a>
			<a href="/contact">Contact</a>
			<a href="/privacy">Privacy Policy</a>
		</nav> */}
	</footer>
);

export default Footer;
