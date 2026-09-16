import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({
  artworks = [],
  activeArtworkId,
  onSelectArtwork,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          Moje kolorowanki
        </Link>

        <p className="sidebar-subtitle">
          Pokoloruj po swojemu.
        </p>
      </div>

      <Link to="/kolorowanka/nowa" className="new-coloring-button">
        ＋ Nowa kolorowanka
      </Link>

      <div className="sidebar-section">
        <h2>Moje prace</h2>

        {artworks.length === 0 ? (
          <p className="sidebar-empty">
            Nie masz jeszcze żadnych kolorowanek.
          </p>
        ) : (
          <div className="artworks-list">
            {artworks.map((artwork) => (
              <button
                key={artwork._id}
                type="button"
                className={
                  activeArtworkId === artwork._id
                    ? 'artwork-list-item active'
                    : 'artwork-list-item'
                }
                onClick={() => onSelectArtwork(artwork)}
              >
                <span className="artwork-list-title">
                  {artwork.title || 'Bez nazwy'}
                </span>

                <span className="artwork-list-status">
                  {artwork.isPublic ? 'Publiczna' : 'Prywatna'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        {user?.email && (
          <div className="sidebar-user">
            {user.email}
          </div>
        )}

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Wyloguj się
        </button>
      </div>
    </aside>
  );
}