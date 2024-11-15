import { useTheme } from 'next-themes';
import { Button } from './ui/button';

const ThemeChanger = () => {
	const { theme, setTheme } = useTheme();

	return (
		<div>
			The current theme is: {theme}
			<Button onClick={() => setTheme('light')}>Light Mode</Button>
			<Button onClick={() => setTheme('dark')}>Dark Mode</Button>
		</div>
	);
};

export default ThemeChanger;
