import { Navigate, Route, Routes, Link } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';

function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <main>
      <h1>Painter Tool</h1>

      {isAuthenticated ? (
        <>
          <p>
            Zalogowany jako: <strong>{user.email}</strong>
          </p>

          <button onClick={logout}>
            Wyloguj się
          </button>
        </>
      ) : (
        <>
          <p>Nie jesteś zalogowany.</p>

          <div>
            <Link to="/login">Zaloguj się</Link>
          </div>

          <div>
            <Link to="/register">Zarejestruj się</Link>
          </div>
        </>
      )}
    </main>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <p>Ładowanie...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function LoggedInTest() {
  const { user } = useAuth();

  return (
    <main>
      <h1>Panel użytkownika</h1>

      <p>
        Witaj, <strong>{user.email}</strong>
      </p>

      <p>
        Ta strona jest dostępna tylko dla zalogowanych użytkowników.
      </p>

      <Link to="/">Wróć na stronę główną</Link>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/panel"
        element={
          <ProtectedRoute>
            <LoggedInTest />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}