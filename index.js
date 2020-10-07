const { Tetris, GameOverError } = require("./src/tetris.js");
const { Board } = require("./src/board.js");

document.addEventListener('DOMContentLoaded', () => {
  const width = 10;
  // const scoreDisplay = document.querySelector('#score');
  // const startBtn = document.querySelector('#start-button');

  let squares = Array.from(document.querySelectorAll('.grid div'))
  let tetris = new Tetris(10, 20);

  let interval = setInterval(render.bind(this), 100);

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

    try {
      tetris.nextMove();
    } catch (e) {
      if (e instanceof GameOverError) {
        clearInterval(interval)
        console.log('caught game over')
      }
    }

  }
})