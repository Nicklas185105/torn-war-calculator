import { redirect } from 'next/navigation';
import { getServerAuthSession } from './api/auth/[...nextauth]/authOptions';

export default async function Home() {
	const session = await getServerAuthSession();

	if (!session) {
		redirect('/auth/signin');
	}

	return (
		<div>
			{/* <p>Api Key: {session.user.api_key}</p>
			<p>Faction Id: {session.user.faction_id}</p>
			<p>ID: {session.user.id}</p>
			<p>Role: {session.user.role}</p> */}
		</div>
	);
}
