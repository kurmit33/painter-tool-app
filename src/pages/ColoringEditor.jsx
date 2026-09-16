import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ColoringGrid from '../components/ColoringGrid';
import Toolbar from '../components/Toolbar';
import Sidebar from '../components/Sidebar';

import {
    getArtwork,
    getColoringPage,
    setArtworkPublic,
    updateArtwork,
    getMyArtworks,
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
    const [artworks, setArtworks] = useState([]);

    useEffect(() => {
        async function loadArtwork() {
            try {
                setLoading(true);
                setError('');

                const artworkResponse = await getArtwork(id);

                const loadedArtwork =
                    artworkResponse?.artwork ||
                    artworkResponse;

                setArtwork(loadedArtwork);
                setCells(
                    Array.isArray(loadedArtwork.cells)
                        ? loadedArtwork.cells
                        : []
                );

                if (!loadedArtwork.pageId) {
                    throw new Error(
                        'Kolorowanka nie ma przypisanej strony (brak pageId).'
                    );
                }

                const pageId =
                    typeof loadedArtwork.pageId === 'object'
                        ? loadedArtwork.pageId._id
                        : loadedArtwork.pageId;

                let page;

                if (
                    typeof loadedArtwork.pageId === 'object' &&
                    loadedArtwork.pageId.totalCells
                ) {
                    page = loadedArtwork.pageId;
                } else {
                    const pageResponse = await getColoringPage(pageId);

                    page =
                        pageResponse?.page ||
                        pageResponse;
                }

                const cellsCount = Number(
                    page?.totalCells
                );

                if (!Number.isFinite(cellsCount) || cellsCount <= 0) {
                    throw new Error(
                        `Nieprawidłowe totalCells: ${page?.totalCells}`
                    );
                }

                setTotalCells(cellsCount);
            } catch (err) {
                setError(
                    err.message ||
                    'Nie udało się załadować kolorowanki.'
                );
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            loadArtwork();
        }
        async function loadArtworks() {
            try {
                const data = await getMyArtworks();

                setArtworks(
                    Array.isArray(data)
                        ? data
                        : data?.artworks || []
                );
            } catch {
                setArtworks([]);
            }
        }

        loadArtworks();
    }, [id]);

    const paintedCount = cells.length;

    const progress = useMemo(() => {
        if (!totalCells) {
            return 0;
        }

        return Math.min(
            100,
            Math.round(
                (paintedCount / totalCells) * 100
            )
        );
    }, [paintedCount, totalCells]);

    function handleCellClick(index) {
        setSavedMessage('');

        setCells((currentCells) => {
            const existingCell = currentCells.find(
                (cell) => cell.index === index
            );

            if (eraser) {
                return currentCells.filter(
                    (cell) => cell.index !== index
                );
            }

            if (existingCell?.color === color) {
                return currentCells;
            }

            if (existingCell) {
                return currentCells.map((cell) =>
                    cell.index === index
                        ? {
                            ...cell,
                            color,
                        }
                        : cell
                );
            }

            return [
                ...currentCells,
                {
                    index,
                    color,
                },
            ];
        });
    }

    function handleSelectArtwork(selectedArtwork) {
        navigate(`/kolorowanka/${selectedArtwork._id}`);
    }
    function handleClear() {
        setCells([]);
        setSavedMessage('');
    }

    async function handleSave() {
        if (!artwork) {
            return;
        }

        try {
            setSaving(true);
            setError('');
            setSavedMessage('');

            const response = await updateArtwork(
                artwork._id,
                {
                    title: artwork.title,
                    cells,
                    totalCells,
                    palette: buildPalette(cells),
                }
            );

            const updatedArtwork =
                response?.artwork ||
                response;

            setArtwork(updatedArtwork);

            setCells(
                Array.isArray(updatedArtwork.cells)
                    ? updatedArtwork.cells
                    : []
            );

            setSavedMessage(
                'Zapisano kolorowankę.'
            );
        } catch (err) {
            setError(
                err.message ||
                'Nie udało się zapisać kolorowanki.'
            );
        } finally {
            setSaving(false);
        }
    }

    async function handlePublishToggle() {
        if (!artwork || saving) {
            return;
        }

        try {
            setError('');
            setSavedMessage('');

            const newPublicState =
                !artwork.isPublic;

            const response =
                await setArtworkPublic(
                    artwork._id,
                    newPublicState
                );

            const updatedArtwork =
                response?.artwork ||
                response;

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
                        onClick={() =>
                            navigate('/kolorowanki')
                        }
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
        <div className="service-layout">
            <Sidebar
                artworks={artworks}
                activeArtworkId={artwork._id}
                onSelectArtwork={handleSelectArtwork}
            />
            <main className="editor-page">
                <div className="editor-container">

                    <header className="editor-header">
                        <button
                            type="button"
                            className="back-button"
                            onClick={() =>
                                navigate('/kolorowanki')
                            }
                        >
                            ← Moje kolorowanki
                        </button>

                        <div className="editor-title-area">
                            <input
                                type="text"
                                className="editor-title"
                                value={
                                    artwork.title || ''
                                }
                                onChange={(event) =>
                                    setArtwork(
                                        (current) => ({
                                            ...current,
                                            title:
                                                event.target.value,
                                        })
                                    )
                                }
                                placeholder="Nazwa kolorowanki"
                            />

                            <div className="editor-progress">
                                {paintedCount} / {totalCells}
                                {' · '}
                                {progress}%
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
                        onPublishToggle={
                            handlePublishToggle
                        }
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
                                onCellClick={
                                    handleCellClick
                                }
                            />
                        ) : (
                            <div className="editor-empty">
                                Nie udało się ustalić
                                liczby pól planszy.
                            </div>
                        )}
                    </section>

                </div>
            </main>
            </div>
            );
}
