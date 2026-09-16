import ColoringCell from './ColoringCell';

export default function ColoringGrid({
  totalCells,
  cells,
  onCellClick,
}) {
  const cellMap = new Map(
    cells.map((cell) => [cell.index, cell.color])
  );

  const columns = Math.ceil(Math.sqrt(totalCells));

  return (
    <div
      className="coloring-grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {Array.from({ length: totalCells }, (_, index) => (
        <ColoringCell
          key={index}
          color={cellMap.get(index)}
          onClick={() => onCellClick(index)}
        />
      ))}
    </div>
  );
}