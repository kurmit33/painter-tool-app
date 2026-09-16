import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ColoringGrid from '../components/ColoringGrid';
import Toolbar from '../components/Toolbar';
import {
    getArtwork,
    getColoringPage,
    getMyArtworks,
    setArtworkPublic,
    updateArtwork,
} from '../api/api';

const DEFAULT_COLOR = '#ff0000';
function buildPalette(cells) {
  return [
    ...new Set(
      cells
        .map((cell) => cell.color)
        .filter(Boolean)
    ),
  ];
}

export default function ColoringEditor() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [artwork, setArtwork] = useState(null);
    const [totalCells, setTotalCells] = useState(0);
    const [cells, setCells] = useState([]);

    const [color, setColor] = useState(DEFAULT_COLOR);
    const [eraser, setEraser] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [savedMessage, setSavedMessage] = useState('');

    useEffect(() => {
        async function loadArtwork() {
            try {
                setLoading(true);
                setError('');

                const loadedArtwork = await getArtwork(id);

                setArtwork(loadedArtwork);
                setCells(loadedArtwork.cells || []);

                if (loadedArtwork.pageId) {
                    const page = await getColoringPage(loadedArtwork.pageId);

                    setTotalCells(page.totalCells || 0);
                }
            } catch (err) {
                setError(err.message || 'Nie udało się załadować kolorowanki.');
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            loadArtwork();
        }
    }, [id]);

    const paintedCount = cells.length;

    const progress = useMemo(() => {
        if (!totalCells) return 0;

        return Math.round((paintedCount / totalCells) * 100);
    }, [paintedCount, totalCells]);

    function handleCellClick(index) {
        setSavedMessage('');

        setCells((currentCells) => {
            const existingCell = currentCells.find(
                (cell) => cell.index === index
            );

            // Gumka
            if (eraser) {
                return currentCells.filter(
                    (cell) => cell.index !== index
                );
            }

            // Pole już ma wybrany kolor — nic nie zmieniamy.
            if (existingCell?.color === color) {
                return currentCells;
            }

            // Pole istnieje — zmieniamy jego kolor.
            if (existingCell) {
                return currentCells.map((cell) =>
                    cell.index === index
                        ? { ...cell, color }
                        : cell
                );
            }

            // Nowe pokolorowane pole.
            return [
                ...currentCells,
                {
                    index,
                    color,
                },
            ];
        });
    }

    function handleClear() {
        setCells([]);
        setSavedMessage('');
    }

    async function handleSave() {
        if (!artwork) return;

        try {
            setSaving(true);
            setError('');
            setSavedMessage('');

            const updatedArtwork = await updateArtwork(
                artwork._id,
                {
                    title: artwork.title,
                    cells,
                    totalCells,
                    palette: buildPalette(cells),
                }
            );


            setArtwork(updatedArtwork);
            setCells(updatedArtwork.cells || []);

            setSavedMessage('Zapisano kolorowankę.');
        } catch (err) {
            setError(err.message || 'Nie udało się zapisać kolorowanki.');
        } finally {
            setSaving(false);
        }
    }

    async function handlePublishToggle() {
        if (!artwork) {
            return;
        }

        if (saving) {
            return;
        }

        try {
            setError('');
            setSavedMessage('');

            const newPublicState = !artwork.isPublic;

            const result = await setArtworkPublic(
                artwork._id,
                newPublicState
            );

            const updatedArtwork =
                result?.artwork ||
                result;

            setArtwork(updatedArtwork);

            setSavedMessage(
                newPublicState
                    ? 'Kolorowanka została opublikowana w galerii.'
                    : 'Kolorowanka została wycofana z galerii.'
            );
        } catch (err) {
            setError(
                err.message ||
                'Nie udało się zmienić statusu publikacji.'
            );
        }
    }

    if (loading) {
        return (
            <main className="editor-page">
                <div className="editor-loading">
                    Ładowanie kolorowanki...
                </div>
            </main>
        );
    }

    if (error && !artwork) {
        return (
            <main className="editor-page">
                <div className="editor-error">
                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={() => navigate('/kolorowanki')}
                    >
                        Wróć do moich kolorowanek
                    </button>
                </div>
            </main>
        );
    }

    if (!artwork) {
        return null;
    }

    return (
        <main className="editor-page">
            <div className="editor-container">
                <header className="editor-header">
                    <button
                        type="button"
                        className="back-button"
                        onClick={() => navigate('/kolorowanki')}
                    >
                        ← Moje kolorowanki
                    </button>

                    <div className="editor-title-area">
                        <input
                            type="text"
                            className="editor-title"
                            value={artwork.title || ''}
                            onChange={(event) =>
                                setArtwork((current) => ({
                                    ...current,
                                    title: event.target.value,
                                }))
                            }
                            placeholder="Nazwa kolorowanki"
                        />

                        <div className="editor-progress">
                            {paintedCount} / {totalCells} · {progress}%
                        </div>
                    </div>
                </header>

                <Toolbar
                    color={color}
                    onColorChange={setColor}
                    eraser={eraser}
                    onEraserToggle={setEraser}
                    onClear={handleClear}
                    onSave={handleSave}
                    saving={saving}
                    isPublic={artwork.isPublic}
                    onPublishToggle={handlePublishToggle}
                />

                {error && (
                    <div className="editor-message error">
                        {error}
                    </div>
                )}

                {savedMessage && (
                    <div className="editor-message success">
                        {savedMessage}
                    </div>
                )}

                <section className="coloring-board">
                    {totalCells > 0 ? (
                        <ColoringGrid
                            totalCells={totalCells}
                            cells={cells}
                            onCellClick={handleCellClick}
                        />
                    ) : (
                        <div className="editor-empty">
                            Ta kolorowanka nie ma jeszcze zdefiniowanej planszy.
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}