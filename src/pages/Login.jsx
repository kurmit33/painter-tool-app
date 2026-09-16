import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');

    if (!email || !password) {
      setError('Wypełnij wszystkie pola.');
      return;
    }

    try {
      setLoading(true);

      await login(email, password);

      navigate('/profil');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Logowanie</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-mail</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password">Hasło</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>

      <p>
        Nie masz konta? <Link to="/register">Zarejestruj się</Link>
      </p>
    </main>
  );
}