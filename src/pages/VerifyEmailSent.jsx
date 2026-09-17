import { Link } from 'react-router-dom';

export default function VerifyEmailSent() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Sprawdź swoją skrzynkę</h1>

        <p>
          Konto zostało utworzone.
        </p>

        <p>
          Wysłaliśmy wiadomość z linkiem
          potwierdzającym adres e-mail.
        </p>

        <p>
          Link jest ważny przez 24 godziny.
        </p>

        <Link
          to="/login"
          className="auth-button-link"
        >
          Przejdź do logowania
        </Link>
      </section>
    </main>
  );
}