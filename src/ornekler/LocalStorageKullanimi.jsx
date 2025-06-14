import { useLocalStorage } from './useLocalStorage';

export default function App() {
  const [name, setName] = useLocalStorage('kullaniciAdi', '');

  return (
    <input value={name} onChange={(e) => setName(e.target.value)} />
  );
}
