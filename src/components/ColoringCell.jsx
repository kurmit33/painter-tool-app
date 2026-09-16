export default function ColoringCell({ number, color, onClick }) {
  return (
    <button
      type="button"
      className="coloring-cell"
      style={{
        backgroundColor: color || '#ffffff',
      }}
      onClick={onClick}
      aria-label={`Pole ${number}`}
    >
      <span className="coloring-cell-number">
        {number}
      </span>
    </button>
  );
}