import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AlgorithmPage } from './pages/AlgorithmPage';
import { MenacePage } from './pages/MenacePage';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-base-200">
      <nav className="navbar bg-base-100 shadow-sm px-4">
        <div className="flex-1 gap-2">
          <Link
            to="/"
            className={`btn btn-sm ${location.pathname === '/' ? 'btn-active' : 'btn-ghost'}`}
          >
            Tabuleiros
          </Link>
          <Link
            to="/algorithm"
            className={`btn btn-sm ${location.pathname === '/algorithm' ? 'btn-active' : 'btn-ghost'}`}
          >
            Algoritmo
          </Link>
          <Link
            to="/menace"
            className={`btn btn-sm ${location.pathname === '/menace' ? 'btn-active' : 'btn-ghost'}`}
          >
            MENACE
          </Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/algorithm" element={<AlgorithmPage />} />
        <Route path="/menace" element={<MenacePage />} />
      </Routes>
    </div>
  );
}

export default App;
