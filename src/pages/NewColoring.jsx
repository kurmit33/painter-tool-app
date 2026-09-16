import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import {
  createColoringPage,
  createColoringSet,
  createArtwork,
  getColoringPages,
  getColoringSets,
  getMyArtworks,
} from '../api/api';

export default function NewColoring() {
  const navigate = useNavigate();

  const [artworks, setArtworks] = useState([]);

  const [sets, setSets] = useState([]);
  const [pages, setPages] = useState([]);

  const [search, setSearch] = useState('');
  const [selectedSet, setSelectedSet] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);

  const [newSetTitle, setNewSetTitle] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [totalCells, setTotalCells] = useState('');

  const [loadingSets, setLoadingSets] = useState(false);
  const [loadingPages, setLoadingPages] = useState(false);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    loadArtworks();
    loadSets();
  }, []);

  async function loadArtworks() {
    try {
      const data = await getMyArtworks();
      setArtworks(Array.isArray(data) ? data : []);
    } catch {
      // Sidebar nie może blokować tworzenia kolorowanki.
    }
  }

  async function loadSets(searchText = '') {
    try {
      setLoadingSets(true);
      setError('');

      const data = await getColoringSets(searchText);

      setSets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message || 'Nie udało się pobrać zestawów.'
      );
    } finally {
      setLoadingSets(false);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    await loadSets(search);
  }

  async function handleSelectSet(set) {
    setSelectedSet(set);
    setSelectedPage(null);
    setPages([]);

    try {
      setLoadingPages(true);
      setError('');

      const data = await getColoringPages(set._id);

      setPages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message || 'Nie udało się pobrać stron kolorowanki.'
      );
    } finally {
      setLoadingPages(false);
    }
  }

  async function handleCreateSet(event) {
    event.preventDefault();

    const title = newSetTitle.trim();

    if (!title) {
      setError('Podaj nazwę zestawu.');
      return;
    }

    try {
      setCreating(true);
      setError('');

      const createdSet = await createColoringSet(title);

      setNewSetTitle('');
      setSearch('');

      await loadSets('');

      await handleSelectSet(createdSet);
    } catch (err) {
      setError(
        err.message || 'Nie udało się utworzyć zestawu.'
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleCreatePage(event) {
    event.preventDefault();

    if (!selectedSet) {
      setError('Najpierw wybierz zestaw.');
      return;
    }

    const title = newPageTitle.trim();
    const cells = Number(totalCells);

    if (!title) {
      setError('Podaj nazwę strony.');
      return;
    }

    if (!Number.isInteger(cells) || cells < 1) {
      setError('Liczba pól musi być liczbą całkowitą większą od 0.');
      return;
    }

    try {
      setCreating(true);
      setError('');

      const createdPage = await createColoringPage({
        setId: selectedSet._id,
        title,
        totalCells: cells,
      });

      setNewPageTitle('');
      setTotalCells('');

      await handleSelectSet(selectedSet);

      setSelectedPage(createdPage);
    } catch (err) {
      setError(
        err.message || 'Nie udało się utworzyć strony.'
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleCreateArtwork() {
    if (!selectedSet || !selectedPage) {
      setError('Wybierz zestaw oraz stronę.');
      return;
    }

    try {
      setCreating(true);
      setError('');

      const artwork = await createArtwork({
        setId: selectedSet._id,
        pageId: selectedPage._id,
        title: selectedPage.title,
        cells: [],
        palette: [],
        beforeImage: selectedPage.originalImage || '',
        afterImage: '',
        isPublic: false,
      });

      navigate(`/kolorowanka/${artwork._id}`);
    } catch (err) {
      setError(
        err.message || 'Nie udało się utworzyć kolorowanki.'
      );
    } finally {
      setCreating(false);
    }
  }

  function handleSelectArtwork(artwork) {
    navigate(`/kolorowanka/${artwork._id}`);
  }

  return (
    <div className="service-layout">
      <Sidebar
        artworks={artworks}
        onSelectArtwork={handleSelectArtwork}
      />

      <main className="new-coloring-page">
        <div className="new-coloring-container">
          <header className="page-header">
            <h1>Nowa kolorowanka</h1>
            <p>
              Wybierz zestaw i stronę, którą chcesz pokolorować.
            </p>
          </header>

          {error && (
            <div className="page-message error">
              {error}
            </div>
          )}

          <section className="new-coloring-section">
            <h2>1. Wybierz zestaw</h2>

            <form
              className="set-search"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Wyszukaj zestaw..."
              />

              <button type="submit" disabled={loadingSets}>
                {loadingSets ? 'Szukam...' : 'Szukaj'}
              </button>
            </form>

            <div className="sets-list">
              {sets.length === 0 && !loadingSets ? (
                <p className="empty-message">
                  Nie znaleziono zestawów.
                </p>
              ) : (
                sets.map((set) => (
                  <button
                    key={set._id}
                    type="button"
                    className={
                      selectedSet?._id === set._id
                        ? 'set-item active'
                        : 'set-item'
                    }
                    onClick={() => handleSelectSet(set)}
                  >
                    <strong>{set.title}</strong>
                  </button>
                ))
              )}
            </div>

            <div className="create-set">
              <h3>Nie ma zestawu?</h3>

              <form onSubmit={handleCreateSet}>
                <input
                  type="text"
                  value={newSetTitle}
                  onChange={(event) =>
                    setNewSetTitle(event.target.value)
                  }
                  placeholder="Nazwa nowego zestawu"
                />

                <button
                  type="submit"
                  disabled={creating}
                >
                  Dodaj zestaw
                </button>
              </form>
            </div>
          </section>

          {selectedSet && (
            <section className="new-coloring-section">
              <h2>
                2. Wybierz stronę
              </h2>

              <p className="selected-info">
                Zestaw: <strong>{selectedSet.title}</strong>
              </p>

              {loadingPages ? (
                <p>Ładowanie stron...</p>
              ) : (
                <div className="pages-list">
                  {pages.length === 0 ? (
                    <p className="empty-message">
                      Ten zestaw nie ma jeszcze żadnych stron.
                    </p>
                  ) : (
                    pages.map((page) => (
                      <button
                        key={page._id}
                        type="button"
                        className={
                          selectedPage?._id === page._id
                            ? 'page-item active'
                            : 'page-item'
                        }
                        onClick={() =>
                          setSelectedPage(page)
                        }
                      >
                        <strong>{page.title}</strong>
                        <span>
                          {page.totalCells} pól
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}

              <div className="create-page">
                <h3>Dodaj nową stronę</h3>

                <form onSubmit={handleCreatePage}>
                  <input
                    type="text"
                    value={newPageTitle}
                    onChange={(event) =>
                      setNewPageTitle(event.target.value)
                    }
                    placeholder="Nazwa strony"
                  />

                  <input
                    type="number"
                    min="1"
                    value={totalCells}
                    onChange={(event) =>
                      setTotalCells(event.target.value)
                    }
                    placeholder="Liczba pól"
                  />

                  <button
                    type="submit"
                    disabled={creating}
                  >
                    Dodaj stronę
                  </button>
                </form>
              </div>
            </section>
          )}

          {selectedPage && (
            <section className="new-coloring-section selected-page-section">
              <h2>3. Gotowe</h2>

              <div className="selected-page">
                <strong>{selectedPage.title}</strong>

                <span>
                  {selectedPage.totalCells} pól
                </span>
              </div>

              <button
                type="button"
                className="start-coloring-button"
                onClick={handleCreateArtwork}
                disabled={creating}
              >
                {creating
                  ? 'Tworzenie...'
                  : '🎨 Zacznij kolorować'}
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}