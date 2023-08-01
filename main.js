const gameBoard = () => {
  const rows = 3;
  const columns = 3;
  const cells = [];

  for (let i = 0; i < rows; i++) {
    cells[i] = [];
    for (let j = 0; j < columns; j++) {
      cells[i].push(Cell());
    }
  }

  const boardState = () => cells;

  const logBoardState = () => {
    const boardValues = cells.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardValues);
  };

  return { boardState, logBoardState };
};

function Cell() {
  let value = 0;

  const markCell = (player) => {
    value = player.marker;
  };

  const getValue = () => value;

  return { markCell, getValue };
}

const player = (name, marker) => {
    return {name, marker}
}