import { ThemeProvider, useTheme } from './ThemeContext';

const ThemeToggle = () => {
  const { dark, setDark } = useTheme();
  return <button onClick={() => setDark(!dark)}>{dark ? 'Açık Tema' : 'Koyu Tema'}</button>;
};

export default function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}
