export default function Toolbar({
  color,
  onColorChange,
  eraser,
  onEraserToggle,
  onClear,
  onSave,
  saving,
  isPublic,
  onPublishToggle,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <label htmlFor="color-picker">
          Kolor
        </label>

        <input
          id="color-picker"
          type="color"
          value={color}
          onChange={(event) => {
            onColorChange(event.target.value);

            if (eraser) {
              onEraserToggle(false);
            }
          }}
          disabled={eraser}
        />
      </div>

      <button
        type="button"
        className={
          eraser
            ? 'toolbar-button active'
            : 'toolbar-button'
        }
        onClick={() =>
          onEraserToggle(!eraser)
        }
      >
        🧽 Gumka
      </button>

      <button
        type="button"
        className="toolbar-button"
        onClick={onClear}
      >
        🗑 Wyczyść
      </button>

      <button
        type="button"
        className="toolbar-button save-button"
        onClick={onSave}
        disabled={saving}
      >
        {saving
          ? 'Zapisywanie...'
          : '💾 Zapisz'}
      </button>

      <button
        type="button"
        className={
          isPublic
            ? 'toolbar-button publish-button published'
            : 'toolbar-button publish-button'
        }
        onClick={onPublishToggle}
      >
        {isPublic
          ? '🌐 Wycofaj publikację'
          : '🌐 Opublikuj'}
      </button>
    </div>
  );
}