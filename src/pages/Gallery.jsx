import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getMyArtworks } from '../api/api';

import {
  getColoringSets,
  getGallery,
} from '../api/api';

export default function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [sets, setSets] = useState([]);

  const [search, setSearch] = useState('');
  const [selectedSetId, setSelectedSetId] = useState('');

  const [loading, setLoading] = useState(true);
  const [loadingSets, setLoadingSets] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGallery();
    loadSets();
  }, []);

  async function loadGallery(setId = '') {
    try {
      setLoading(true);
      setError('');

      const data = await getGallery(
        setId ? { setId } : {}
      );

      setArtworks(
        Array.isArray(data)
          ? data
          : data?.artworks || []
      );
    } catch (err) {
      setError(
        err.message ||
          'Nie udało się pobrać galerii.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadSets(searchText = '') {
    try {
      setLoadingSets(true);

      const data = await getColoringSets(
        searchText
      );

      setSets(
        Array.isArray(data)
          ? data
          : data?.sets || []
      );
    } catch {
      setSets([]);
    } finally {
      setLoadingSets(false);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();

    await loadSets(search);
  }

  async function handleSetChange(event) {
    const value = event.target.value;

    setSelectedSetId(value);

    await loadGallery(value);
  }

  function formatDate(date) {
    if (!date) {
      return '';
    }

    return new Date(date).toLocaleDateString(
      'pl-PL',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );
  }

  return (
    <main className="gallery-page">
      <div className="gallery-container">
        <header className="gallery-header">
          <div>
            <Link
              to="/"
              className="gallery-back"
            >
              ← Moje kolorowanki
            </Link>

            <h1>Galeria</h1>

            <p>
              Zobacz kolorowanki opublikowane przez
              społeczność.
            </p>
          </div>
        </header>

        <section className="gallery-filters">
          <form
            className="gallery-search"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Szukaj zestawu kolorowanek..."
            />

            <button
              type="submit"
              disabled={loadingSets}
            >
              {loadingSets
                ? 'Szukam...'
                : 'Szukaj'}
            </button>
          </form>

          <select
            value={selectedSetId}
            onChange={handleSetChange}
          >
            <option value="">
              Wszystkie zestawy
            </option>

            {sets.map((set) => (
              <option
                key={set._id}
                value={set._id}
              >
                {set.title}
              </option>
            ))}
          </select>
        </section>

        {error && (
          <div className="page-message error">
            {error}
          </div>
        )}

        {loading && (
          <div className="page-message">
            Ładowanie galerii...
          </div>
        )}

        {!loading &&
          !error &&
          artworks.length === 0 && (
            <div className="gallery-empty">
              <h2>
                Nie ma jeszcze opublikowanych prac
              </h2>

              <p>
                Gdy ktoś opublikuje swoją kolorowankę,
                pojawi się tutaj.
              </p>
            </div>
          )}

        {!loading &&
          artworks.length > 0 && (
            <div className="gallery-grid">
              {artworks.map((artwork) => (
                <article
                  key={artwork._id}
                  className="gallery-card"
                >
                  <div className="gallery-card-preview">
                    {artwork.afterImage ? (
                      <img
                        src={artwork.afterImage}
                        alt={
                          artwork.title ||
                          'Pokolorowana kolorowanka'
                        }
                      />
                    ) : artwork.cells?.length > 0 ? (
                      <div className="gallery-mini-grid">
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
                        Brak podglądu
                      </span>
                    )}
                  </div>

                  <div className="gallery-card-content">
                    <h2>
                      {artwork.title ||
                        'Bez nazwy'}
                    </h2>

                    <div className="gallery-meta">
                      {artwork.setId?.title && (
                        <span>
                          Zestaw:{' '}
                          <strong>
                            {artwork.setId.title}
                          </strong>
                        </span>
                      )}

                      {artwork.pageId?.title && (
                        <span>
                          Strona:{' '}
                          <strong>
                            {artwork.pageId.title}
                          </strong>
                        </span>
                      )}

                      {artwork.userId?.email && (
                        <span>
                          Autor:{' '}
                          <strong>
                            {artwork.userId.email}
                          </strong>
                        </span>
                      )}

                      {artwork.publishedAt && (
                        <span>
                          Opublikowano:{' '}
                          {formatDate(
                            artwork.publishedAt
                          )}
                        </span>
                      )}
                    </div>

                    {artwork.palette?.length > 0 && (
                      <div className="gallery-palette">
                        <span>Paleta:</span>

                        <div className="palette-colors">
                          {artwork.palette.map(
                            (paletteColor) => (
                              <span
                                key={paletteColor}
                                className="palette-color"
                                style={{
                                  backgroundColor:
                                    paletteColor,
                                }}
                                title={
                                  paletteColor
                                }
                              />
                            )
                          )}
                        </div>
                      </div>
                    )}

                    <Link
                      to={`/galeria/${artwork._id}`}
                      className="gallery-view-button"
                    >
                      Zobacz pracę
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
      </div>
    </main>
  );
}