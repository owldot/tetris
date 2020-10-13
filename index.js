const { Tetris, GameOverError } = require("./src/tetris.js");
const { Board } = require("./src/board.js");

document.addEventListener('DOMContentLoaded', () => {
  const width = 10;
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  const label = document.querySelector('#label');
  const labelDrop = document.querySelector('.centerLabel');
  document.addEventListener('keydown', listenKeyMove);
  document.addEventListener('keydown', listenKeyPause);
  startBtn.addEventListener('click', startNewGame);

  let squares = Array.from(document.querySelectorAll('.grid div'))
  let tetris = new Tetris(10, 20);

  let togglePause = false;
  let interval = setInterval(nextMoveDown.bind(this), 600);

  function listenKeyPause(event) {
    switch (event.keyCode) {
      case 27:
        togglePause = !togglePause;
        if (togglePause) {
          labelDrop.classList.remove('hidden');
          label.innerText = 'Paused';
          startBtn.classList.add('hidden');
          document.removeEventListener('keydown', listenKeyMove);
          clearInterval(interval);
        } else {
          document.addEventListener('keydown', listenKeyMove);
          labelDrop.classList.add('hidden')
          interval = setInterval(nextMoveDown.bind(this), 700);
        }
        break;
    }
  }

  function startNewGame() {
    tetris = new Tetris(10, 20);
    clearInterval(interval);
    togglePause = false;
    labelDrop.classList.add('hidden');
    document.addEventListener('keydown', listenKeyMove);
    document.addEventListener('keydown', listenKeyPause);
    interval = setInterval(nextMoveDown.bind(this), 600);
  }

  function gameOver() {
    clearInterval(interval);
    labelDrop.classList.remove('hidden')
    label.innerText = 'Game Over'
    startBtn.classList.remove('hidden');
    document.removeEventListener('keydown', listenKeyMove);
    document.removeEventListener('keydown', listenKeyPause);
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
    }
    render()
  }

  function render() {
    let state = tetris.placePiece();

    squares.forEach((square, index) => {
      let matrixElement = state[Math.floor(index / 10)][index % 10];
      if (matrixElement === 1) {
        square.classList.add('filled')
      }
      else {
        square.classList.remove('filled')
      }
    })
  }

  function nextMoveDown() {
    try {
      tetris.moveDown();
      render();
      scoreDisplay.innerText = tetris.score;
    } catch (e) {
      if (e instanceof GameOverError) {
        gameOver();
      }
    }
  }
})