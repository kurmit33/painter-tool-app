export default function ColoringCell({ color, onClick }) {
  return (
    <button
      type="button"
      className="coloring-cell"
      style={{
        backgroundColor: color || '#ffffff',
      }}
      onClick={onClick}
      aria-label="Pole kolorowanki"
    />
  );
}