import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import {
  deleteArtwork,
  getMyArtworks,
} from '../api/api';

export default function MyColorings() {
  const navigate = useNavigate();

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadArtworks() {
    try {
      setLoading(true);
      setError('');

      const data = await getMyArtworks();

      setArtworks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message || 'Nie udało się pobrać kolorowanek.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArtworks();
  }, []);

  function handleSelectArtwork(artwork) {
    navigate(`/kolorowanka/${artwork._id}`);
  }

  function handleNewColoring() {
    navigate('/kolorowanka/nowa');
  }

  async function handleDelete(event, artwork) {
    event.stopPropagation();

    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć "${artwork.title || 'Bez nazwy'}"?`
    );

    if (!confirmed) return;

    try {
      await deleteArtwork(artwork._id);

      setArtworks((current) =>
        current.filter(
          (item) => item._id !== artwork._id
        )
      );
    } catch (err) {
      setError(
        err.message || 'Nie udało się usunąć kolorowanki.'
      );
    }
  }

  return (
    <div className="service-layout">
      <Sidebar
        artworks={artworks}
        onSelectArtwork={handleSelectArtwork}
      />

      <main className="my-colorings-page">
        <div className="my-colorings-header">
          <div>
            <h1>Moje kolorowanki</h1>
            <p>
              Twoje zapisane prace.
            </p>
          </div>

          <button
            type="button"
            className="new-coloring-button"
            onClick={handleNewColoring}
          >
            ＋ Nowa kolorowanka
          </button>
        </div>

        {loading && (
          <div className="page-message">
            Ładowanie kolorowanek...
          </div>
        )}

        {error && (
          <div className="page-message error">
            {error}
          </div>
        )}

        {!loading && !error && artworks.length === 0 && (
          <div className="empty-state">
            <h2>Nie masz jeszcze żadnej kolorowanki</h2>

            <p>
              Utwórz pierwszą kolorowankę i zacznij ją
              kolorować.
            </p>

            <button
              type="button"
              className="new-coloring-button"
              onClick={handleNewColoring}
            >
              ＋ Utwórz kolorowankę
            </button>
          </div>
        )}

        {!loading && artworks.length > 0 && (
          <div className="my-colorings-grid">
            {artworks.map((artwork) => (
              <article
                key={artwork._id}
                className="artwork-card"
                onClick={() => handleSelectArtwork(artwork)}
              >
                <div className="artwork-preview">
                  {artwork.cells?.length > 0 ? (
                    <div className="artwork-mini-preview">
                      {artwork.cells.slice(0, 25).map((cell) => (
                        <span
                          key={cell.index}
                          style={{
                            backgroundColor: cell.color,
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span>
                      Pusta kolorowanka
                    </span>
                  )}
                </div>

                <div className="artwork-card-content">
                  <h2>
                    {artwork.title || 'Bez nazwy'}
                  </h2>

                  <p>
                    {artwork.isPublic
                      ? 'Publiczna'
                      : 'Prywatna'}
                  </p>

                  <button
                    type="button"
                    className="delete-artwork-button"
                    onClick={(event) =>
                      handleDelete(event, artwork)
                    }
                  >
                    Usuń
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}