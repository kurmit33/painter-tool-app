import ColoringCell from './ColoringCell';

function getColumns(totalCells) {
  if (!Number.isInteger(totalCells) || totalCells <= 0) {
    return 1;
  }

  const root = Math.floor(Math.sqrt(totalCells));

  // Szukamy najlepszego prostokątnego układu.
  // 100 -> 10 x 10
  // 50  -> 5 x 10
  // 48  -> 6 x 8
  // 30  -> 5 x 6
  for (let columns = root; columns >= 1; columns -= 1) {
    if (totalCells % columns === 0) {
      return totalCells / columns;
    }
  }

  // Dla liczby pierwszej zostawiamy możliwie kwadratowy układ.
  return Math.ceil(Math.sqrt(totalCells));
}

export default function ColoringGrid({
  totalCells,
  cells,
  onCellClick,
}) {
  const safeTotalCells = Number(totalCells) || 0;
  const safeCells = Array.isArray(cells) ? cells : [];

  const cellMap = new Map(
    safeCells.map((cell) => [
      Number(cell.index),
      cell.color,
    ])
  );

  const columns = getColumns(safeTotalCells);

  if (safeTotalCells <= 0) {
    return null;
  }

  return (
    <div
      className="coloring-grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {Array.from(
        { length: safeTotalCells },
        (_, index) => {
          const number = index + 1;

          return (
            <ColoringCell
              key={number}
              number={number}
              color={cellMap.get(number)}
              onClick={() => onCellClick(number)}
            />
          );
        }
      )}
    </div>
  );
}