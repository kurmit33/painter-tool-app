import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  getArtwork,
  getColoringPage,
} from '../api/api';

import ColoringGrid from '../components/ColoringGrid';

export default function GalleryArtwork() {
  const { id } = useParams();

  const [artwork, setArtwork] = useState(null);
  const [totalCells, setTotalCells] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadArtwork() {
      try {
        setLoading(true);
        setError('');

        const loadedArtwork =
          await getArtwork(id);

        setArtwork(loadedArtwork);

        if (loadedArtwork.pageId) {
          const page =
            await getColoringPage(
              loadedArtwork.pageId._id ||
                loadedArtwork.pageId
            );

          setTotalCells(
            Number(page.totalCells) || 0
          );
        }
      } catch (err) {
        setError(
          err.message ||
            'Nie udało się pobrać pracy.'
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadArtwork();
    }
  }, [id]);

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

  if (loading) {
    return (
      <main className="gallery-artwork-page">
        <div className="page-message">
          Ładowanie pracy...
        </div>
      </main>
    );
  }

  if (error || !artwork) {
    return (
      <main className="gallery-artwork-page">
        <div className="page-message error">
          {error || 'Nie znaleziono pracy.'}
        </div>

        <Link
          to="/galeria"
          className="gallery-back"
        >
          ← Wróć do galerii
        </Link>
      </main>
    );
  }

  return (
    <main className="gallery-artwork-page">
      <div className="gallery-artwork-container">
        <Link
          to="/galeria"
          className="gallery-back"
        >
          ← Wróć do galerii
        </Link>

        <header className="gallery-artwork-header">
          <h1>
            {artwork.title || 'Bez nazwy'}
          </h1>

          {artwork.publishedAt && (
            <p>
              Opublikowano{' '}
              {formatDate(
                artwork.publishedAt
              )}
            </p>
          )}
        </header>

        <section className="gallery-artwork-layout">
          <div className="gallery-artwork-board">
            {artwork.afterImage ? (
              <img
                src={artwork.afterImage}
                alt={
                  artwork.title ||
                  'Pokolorowana kolorowanka'
                }
              />
            ) : totalCells > 0 ? (
              <ColoringGrid
                totalCells={totalCells}
                cells={artwork.cells || []}
                onCellClick={() => {}}
              />
            ) : (
              <div className="empty-state">
                Brak podglądu pracy.
              </div>
            )}
          </div>

          <aside className="gallery-artwork-info">
            <div>
              <span className="info-label">
                Tytuł
              </span>

              <strong>
                {artwork.title ||
                  'Bez nazwy'}
              </strong>
            </div>

            {artwork.setId?.title && (
              <div>
                <span className="info-label">
                  Zestaw
                </span>

                <strong>
                  {artwork.setId.title}
                </strong>
              </div>
            )}

            {artwork.pageId?.title && (
              <div>
                <span className="info-label">
                  Strona
                </span>

                <strong>
                  {artwork.pageId.title}
                </strong>
              </div>
            )}

            {artwork.userId?.email && (
              <div>
                <span className="info-label">
                  Autor
                </span>

                <strong>
                  {artwork.userId.email}
                </strong>
              </div>
            )}

            {artwork.palette?.length > 0 && (
              <div>
                <span className="info-label">
                  Paleta
                </span>

                <div className="detail-palette">
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
          </aside>
        </section>

        {artwork.beforeImage &&
          artwork.afterImage && (
            <section className="before-after-section">
              <h2>Przed i po</h2>

              <div className="before-after-grid">
                <div>
                  <h3>Oryginał</h3>

                  <img
                    src={artwork.beforeImage}
                    alt="Oryginalna kolorowanka"
                  />
                </div>

                <div>
                  <h3>Efekt</h3>

                  <img
                    src={artwork.afterImage}
                    alt="Pokolorowana kolorowanka"
                  />
                </div>
              </div>
            </section>
          )}
      </div>
    </main>
  );
}