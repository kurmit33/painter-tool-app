import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import { deleteArtwork, getMyArtworks } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function MyColorings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadArtworks() {
    try {
      setLoading(true);
      setError('');

      const data = await getMyArtworks();

      setArtworks(
        Array.isArray(data)
          ? data
          : data?.artworks || []
      );
    } catch (err) {
      setError(
        err.message ||
          'Nie udało się pobrać kolorowanek.'
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

  async function handleDelete(event, artwork) {
    event.stopPropagation();

    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć "${artwork.title || 'Bez nazwy'}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteArtwork(artwork._id);

      setArtworks((current) =>
        current.filter(
          (item) => item._id !== artwork._id
        )
      );
    } catch (err) {
      setError(
        err.message ||
          'Nie udało się usunąć kolorowanki.'
      );
    }
  }

  function handleAddPhoto(event, artwork) {
    event.stopPropagation();

    navigate(`/kolorowanka/${artwork._id}?photo=1`);
  }

  return (
    <div className="service-layout">
      <Sidebar
        artworks={artworks}
        onSelectArtwork={handleSelectArtwork}
      />

      <main className="my-colorings-page">
        <div className="profile-header">
          <div>
            <p className="profile-label">
              MÓJ PROFIL
            </p>

            <h1>
              {user?.email || 'Moje kolorowanki'}
            </h1>

            <p>
              Tutaj znajdziesz wszystkie swoje
              kolorowanki i możesz zarządzać swoimi
              pracami.
            </p>
          </div>

          <button
            type="button"
            className="profile-new-button"
            onClick={() =>
              navigate('/kolorowanka/nowa')
            }
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

        {!loading &&
          !error &&
          artworks.length === 0 && (
            <div className="empty-state profile-empty">
              <h2>
                Nie masz jeszcze żadnej kolorowanki
              </h2>

              <p>
                Utwórz pierwszą pracę, a pojawi się
                tutaj.
              </p>

              <button
                type="button"
                className="new-coloring-button"
                onClick={() =>
                  navigate('/kolorowanka/nowa')
                }
              >
                ＋ Utwórz kolorowankę
              </button>
            </div>
          )}

        {!loading &&
          artworks.length > 0 && (
            <>
              <div className="profile-section-header">
                <div>
                  <h2>Moje kolorowanki</h2>

                  <p>
                    {artworks.length === 1
                      ? '1 praca'
                      : `${artworks.length} prac`}
                  </p>
                </div>
              </div>

              <div className="my-colorings-grid">
                {artworks.map((artwork) => (
                  <article
                    key={artwork._id}
                    className="artwork-card"
                  >
                    <button
                      type="button"
                      className="artwork-card-main"
                      onClick={() =>
                        handleSelectArtwork(
                          artwork
                        )
                      }
                    >
                      <div className="artwork-preview">
                        {artwork.cells?.length > 0 ? (
                          <div className="artwork-mini-preview">
                            {artwork.cells
                              .slice(0, 25)
                              .map((cell) => (
                                <span
                                  key={cell.index}
                                  style={{
                                    backgroundColor:
                                      cell.color,
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
                          {artwork.title ||
                            'Bez nazwy'}
                        </h2>

                        <p>
                          {artwork.isPublic
                            ? '🌐 Publiczna'
                            : '🔒 Prywatna'}
                        </p>
                      </div>
                    </button>

                    <div className="artwork-card-actions">
                      <button
                        type="button"
                        className="artwork-action-button primary"
                        onClick={() =>
                          handleSelectArtwork(
                            artwork
                          )
                        }
                      >
                        🎨 Koloruj
                      </button>

                      {!artwork.isPublic && (
                        <button
                          type="button"
                          className="artwork-action-button"
                          onClick={() =>
                            handleSelectArtwork(
                              artwork
                            )
                          }
                        >
                          🌐 Opublikuj
                        </button>
                      )}

                      <button
                        type="button"
                        className="artwork-action-button"
                        onClick={(event) =>
                          handleAddPhoto(
                            event,
                            artwork
                          )
                        }
                      >
                        🖼 Dodaj zdjęcie
                      </button>

                      <button
                        type="button"
                        className="artwork-action-button danger"
                        onClick={(event) =>
                          handleDelete(
                            event,
                            artwork
                          )
                        }
                      >
                        Usuń
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
      </main>
    </div>
  );
}