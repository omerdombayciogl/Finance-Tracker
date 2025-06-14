import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const Home = () => <h2>Ana Sayfa</h2>;
const About = () => <h2>Hakkında</h2>;

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Ana</Link> | <Link to="/about">Hakkında</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
