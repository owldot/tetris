

document.addEventListener('DOMContentLoaded', () => {
  const width = 10;
  const grid = document.querySelector('.grid');
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  let squares = Array.from(document.querySelectorAll('.grid div'))
  // let board = new Board(10, 20);
  // let tetris = new Tetris(board);

  squares.forEach((square, index) => {
    square.innerText = index;
  })
})