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

  const state = () => cells;
  const getCell = (row, column) => cells[row][column];

  const isFull = () => {
    for (let row of cells) {
      for (let cell of row) {
        if (cell.getValue() === 0) {
          return false; // Found an empty cell, so the board is not full
        }
      }
    }
    return true; // No empty cells found, so the board is full
  };

  const checkWinner = () => {
    // Check rows
    for (let i = 0; i < rows; i++) {
      if (
        cells[i].every(
          (cell) =>
            cell.getValue() === cells[i][0].getValue() && cell.getValue() !== 0
        )
      ) {
        return {
          winner: cells[i][0].getValue(),
          line: cells[i].map((_, j) => [i, j]),
        };
      }
    }

    // Check columns
    for (let j = 0; j < columns; j++) {
      if (
        cells.every(
          (row) =>
            row[j].getValue() === cells[0][j].getValue() &&
            row[j].getValue() !== 0
        )
      ) {
        return {
          winner: cells[0][j].getValue(),
          line: Array.from({ length: rows }, (_, i) => [i, j]),
        };
      }
    }

    // Check main diagonal
    if (
      cells.every(
        (row, i) =>
          row[i].getValue() === cells[0][0].getValue() &&
          row[i].getValue() !== 0
      )
    ) {
      return {
        winner: cells[0][0].getValue(),
        line: Array.from({ length: rows }, (_, i) => [i, i]),
      };
    }

    // Check secondary diagonal
    if (
      cells.every(
        (row, i) =>
          row[columns - i - 1].getValue() ===
            cells[0][columns - 1].getValue() &&
          row[columns - i - 1].getValue() !== 0
      )
    ) {
      return {
        winner: cells[0][columns - 1].getValue(),
        line: Array.from({ length: rows }, (_, i) => [i, columns - i - 1]),
      };
    }

    // No winner
    return null;
  };

  const logBoardState = () => {
    const boardValues = cells.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardValues);
  };

  return { state, logBoardState, getCell, checkWinner, isFull };
};

function Cell() {
  let value = 0;

  const markCell = (player) => {
    value = player.marker;
  };

  const getValue = () => value;

  return { markCell, getValue };
}

const player = (name, marker, color) => {
  return { name, marker, color };
};

function gameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const interactionsDiv = document.querySelector(".interactions");
  interactionsDiv.innerHTML = "";
  let whoseTurnElement = document.createElement("h2");
  whoseTurnElement.classList.add("whose-turn");
  interactionsDiv.appendChild(whoseTurnElement);

  const board = gameBoard();

  const colors = [
    "#08D9D6",
    "#FF2E63",
    "#6528F7",
    "#00DFA2",
    "#FFD93D",
    "#332FD0",
    "#FF4949",
  ];

  function getRandomColor() {
    const index = Math.floor(Math.random() * colors.length);
    let color = colors[index];
    colors.splice(index, 1);
    return color;
  }

  let playerOne = player(playerOneName, "X", getRandomColor());
  let playerTwo = player(playerTwoName, "O", getRandomColor());
  const players = [playerOne, playerTwo];

  let activePlayer = playerTwo;

  let whoseTurn = document.querySelector(".whose-turn");

  const resetHTML = () => {
    let cellButtons = document.querySelectorAll(".cell-btn");
    cellButtons.forEach((button) => {
      button.innerHTML = "";
      button.classList.remove("highlight");
      button.closest(".grid-cell").classList.remove("occupied");
      button.closest(".grid").classList.remove("game-over");
    });
    let resetButton = document.querySelector("button");
    resetButton.remove();
  };

  const switchPlayerTurn = () => {
    if (activePlayer == playerOne) {
      activePlayer = playerTwo;
    } else {
      activePlayer = playerOne;
    }
    if (!board.isFull()) {
      applyMarkers();
      whoseTurn.textContent = `It's ${activePlayer.name}'s turn!`;
    }
  };

  const playTurn = (row, column) => {
    const cell = board.getCell(row, column);
    if (cell.getValue() !== 0) {
      return;
    }
    cell.markCell(activePlayer);

    const highlightWinningLine = (line) => {
      line.forEach(([row, column]) => {
        let cellButton = document.querySelector(
          `.cell-btn[data-row='${row}'][data-column='${column}']`
        );
        cellButton.classList.add("highlight"); // Add a CSS class to change the appearance of the cell
      });
    };

    const result = board.checkWinner();

    if (result || board.isFull()) {
      if (result) {
        const winner = players.find(
          (player) => player.marker === result.winner
        );
        whoseTurn.textContent = `${winner.name} wins!`;
        highlightWinningLine(result.line);
      } else {
        whoseTurn.textContent = "It's a tie!";
      }
      document.querySelector(".grid").classList.add("game-over");
      let resetButton = document.createElement("button");
      resetButton.textContent = "Play Again";
      interactionsDiv.appendChild(resetButton);
      resetButton.addEventListener("click", () => {
        resetHTML();
        let cellButtons = document.querySelectorAll(".cell-btn");

        cellButtons.forEach((button) => {
          let clone = button.cloneNode(true);
          button.parentNode.replaceChild(clone, button);
        });
        gameController();
      });
    } else {
      switchPlayerTurn();
    }
  };

  const applyMarkers = () => {
    let svgCircle = `<svg fill="#FFFFFF" height="75%" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-19.8 -19.8 369.60 369.60" xml:space="preserve" stroke="${playerTwo.color}" stroke-width="33"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="XMLID_520_" d="M165,0C74.019,0,0,74.019,0,165s74.019,165,165,165s165-74.019,165-165S255.982,0,165,0z M165,300 C90.561,300,30,239.44,30,165S90.561,30,165,30c74.439,0,135,60.561,135,135S239.439,300,165,300z"></path></g></svg>`;

    let svgX = `<svg viewBox="0 0 1024.00 1024.00" height="95%" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" stroke="${playerOne.color}" stroke-width="51.2"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="${playerOne.color}" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"></path></g></svg>`;
    let cellButtons = document.querySelectorAll(
      ".grid-cell:not(.occupied) .cell-btn"
    );
    cellButtons.forEach((button) => {
      if (activePlayer == playerOne) {
        button.innerHTML = svgX;
      } else {
        button.innerHTML = svgCircle;
      }
    });
  };

  let cellButtons = document.querySelectorAll(
    ".grid-cell:not(.occupied) .cell-btn"
  );
  cellButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      let row = e.currentTarget.dataset.row;
      let column = e.currentTarget.dataset.column;
      e.target.closest(".grid-cell").classList.add("occupied");
      playTurn(row, column);
    });
  });

  switchPlayerTurn();
}

gameController();

const darkModeToggle = document.querySelector(".dark-mode-toggle");
darkModeToggle.addEventListener("click", (e) => {
  e.target.closest("body").classList.toggle("dark-mode");
});
