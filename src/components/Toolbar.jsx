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
    <div className="editor-tools">
      <div className="toolbar toolbar-tools">
        <div className="toolbar-group color-picker-group">
          <label htmlFor="color-picker">
            Kolor
          </label>

          <input
            id="color-picker"
            type="color"
            value={color}
            onClick={() => {
              if (eraser) {
                onEraserToggle(false);
              }
            }}
            onChange={(event) => {
              onColorChange(event.target.value);

              if (eraser) {
                onEraserToggle(false);
              }
            }}
          />
        </div>

        <button
          type="button"
          className={
            eraser
              ? 'toolbar-button active eraser-button'
              : 'toolbar-button eraser-button'
          }
          onClick={() => onEraserToggle(!eraser)}
        >
          🧽 Gumka
        </button>
      </div>

      <div className="toolbar toolbar-actions">
        <button
          type="button"
          className="toolbar-button clear-button"
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
          {saving ? 'Zapisywanie...' : '💾 Zapisz'}
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
    </div>
  );
}