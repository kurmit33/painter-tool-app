import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { verifyEmail } from '../api/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const [status, setStatus] =
    useState('loading');

  const [message, setMessage] =
    useState('');

  useEffect(() => {
    const token =
      searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage(
        'Brakuje tokenu weryfikacyjnego.'
      );
      return;
    }

    async function verify() {
      try {
        const data =
          await verifyEmail(token);

        setStatus('success');
        setMessage(
          data.message ||
            'Adres e-mail został potwierdzony.'
        );
      } catch (err) {
        setStatus('error');
        setMessage(
          err.message ||
            'Nie udało się potwierdzić adresu e-mail.'
        );
      }
    }

    verify();
  }, [searchParams]);

  return (
    <main className="auth-page">
      <section className="auth-card">
        {status === 'loading' && (
          <>
            <h1>Weryfikacja e-mail</h1>

            <p>
              Sprawdzam link weryfikacyjny...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <h1>E-mail potwierdzony</h1>

            <p>
              {message}
            </p>

            <Link
              to="/login"
              className="auth-button-link"
            >
              Przejdź do logowania
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <h1>Nie udało się potwierdzić e-maila</h1>

            <p className="auth-error">
              {message}
            </p>

            <Link
              to="/login"
              className="auth-button-link"
            >
              Wróć do logowania
            </Link>
          </>
        )}
      </section>
    </main>
  );
}