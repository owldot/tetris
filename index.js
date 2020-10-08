const { Tetris, GameOverError } = require("./src/tetris.js");
const { Board } = require("./src/board.js");

document.addEventListener('DOMContentLoaded', () => {
  const width = 10;
  // const scoreDisplay = document.querySelector('#score');
  // const startBtn = document.querySelector('#start-button');

  let squares = Array.from(document.querySelectorAll('.grid div'))
  let tetris = new Tetris(10, 20);

  let interval = setInterval(nextMoveDown.bind(this), 1000);
  document.addEventListener('keydown', keyPush);
  function keyPush(event) {
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
      render()
    } catch (e) {
      if (e instanceof GameOverError) {
        clearInterval(interval)
        console.log('caught game over')
      }
    }
  }
})