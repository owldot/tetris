const { Tetris, GameOverError } = require("./src/tetris.js");
const { Board } = require("./src/board.js");

document.addEventListener('DOMContentLoaded', () => {
  const width = 10;
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  const pauseLabel = document.querySelector('#pauseLabel');
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
          pauseLabel.parentElement.classList.remove('hidden')
          document.removeEventListener('keydown', listenKeyMove);
          clearInterval(interval);
        } else {
          document.addEventListener('keydown', listenKeyMove);
          pauseLabel.parentElement.classList.add('hidden')
          interval = setInterval(nextMoveDown.bind(this), 700);
        }
        break;
    }
  }

  function startNewGame() {
    tetris = new Tetris(10, 20);
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
        tetris.moveDown();
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
        clearInterval(interval)
        console.log('caught game over')
      }
    }
  }
})