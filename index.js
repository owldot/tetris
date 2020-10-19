const { Tetris, GameOverError } = require("./src/tetris.js");
const { Board } = require("./src/board.js");

document.addEventListener('DOMContentLoaded', () => {
  const scoreDisplay = document.getElementById('score');
  const startBtn = document.getElementById('start-button');
  const resumeBtn = document.getElementById('resume-button');
  const label = document.getElementById('label');
  const labelDrop = document.querySelector('.centerLabel');

  document.addEventListener('keydown', listenKeyMove);
  document.addEventListener('keydown', listenKeyPause);
  startBtn.addEventListener('click', startNewGame);
  resumeBtn.addEventListener('click', pauseGame);

  let squares = Array.from(document.querySelectorAll('.grid.game div'))
  let nextPieceSquares = Array.from(document.querySelectorAll('#next-piece div'))
  let tetris;
  let interval;
  let togglePause = false;
  startNewGame();

  function listenKeyPause(event) {
    switch (event.keyCode) {
      case 27:
        pauseGame();
        break;
    }
  }

  function startNewGame() {
    tetris = new Tetris(10, 20);
    tetris.positionInCentre();
    clearInterval(interval);
    togglePause = false;
    labelDrop.classList.add('hidden');
    document.addEventListener('keydown', listenKeyMove);
    document.addEventListener('keydown', listenKeyPause);
    interval = setInterval(nextMoveDown.bind(this), 600);
    renderNextPiece();
  }

  function gameOver() {
    clearInterval(interval);
    labelDrop.classList.remove('hidden')
    label.innerText = 'Game Over';
    resumeBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    document.removeEventListener('keydown', listenKeyMove);
    document.removeEventListener('keydown', listenKeyPause);
  }

  function pauseGame() {
    togglePause = !togglePause;
    if (togglePause) {
      labelDrop.classList.remove('hidden');
      label.innerText = 'Paused';
      startBtn.classList.add('hidden');
      resumeBtn.classList.remove('hidden');
      document.removeEventListener('keydown', listenKeyMove);
      clearInterval(interval);
    } else {
      document.addEventListener('keydown', listenKeyMove);
      labelDrop.classList.add('hidden');
      resumeBtn.classList.remove('hidden');
      interval = setInterval(nextMoveDown.bind(this), 700);
    }
  }

  function listenKeyMove(event) {
    switch (event.keyCode) {
      case 37:
        tetris.moveLeft();
        break;
      case 38:
        tetris.rotate();
        break;
      case 39:
        tetris.moveRight()
        break;
      case 40:
        try {
          tetris.moveDown();
        }
        catch (e) {
          if (e instanceof GameOverError) {
            gameOver();
          }
        }
        break;
      case 32:
        tetris.drop()
    }
    render()
  }

  function render() {
    let state = tetris.board.area;

    squares.forEach((square, index) => {
      let matrixElement = state[Math.floor(index / 10)][index % 10];
      if (matrixElement === 1) {
        const cssClassName = tetris.piece.color;
        square.classList.add('filled');
        if (square.classList.length == 1) { // Testing if color was already assigned
          square.classList.add(cssClassName);
        }
      }
      else {
        square.className = ''; // Clear all colors
      }
    })
  }

  function renderNextPiece() {
    nextPieceSquares.forEach((el) => el.className = '');
    tetris.nextPiece.coords.forEach(([y, x]) => {
      nextPieceSquares[y * 4 + x].className = `filled ${tetris.nextPiece.color}`;
    })
  }

  function nextMoveDown() {
    try {
      tetris.moveDown();
      render();
      renderNextPiece();
      scoreDisplay.innerText = tetris.score;
    } catch (e) {
      if (e instanceof GameOverError) {
        gameOver();
      }
    }
  }
})