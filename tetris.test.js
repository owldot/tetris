const { Tetris, Board, Mover } = require('./src/tetris');

test('Board is created', () => {
  let board = new Board(4, 5);
  let emptyField = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
  expect(board.area).toEqual(emptyField);
  expect(board.width).toBe(4);
  expect(board.height).toBe(5);
});

test('Tetris is initiated', () => {
  let board = new Board(3, 4);
  let tetris = new Tetris(board);
  expect(tetris.nextPiece).toBeDefined();
});

test('Piece moves down', () => {
  const piece = {
    coords: [[0, 0], [0, 1], [1, 0], [2, 0]],
    name: 'lLShape',
    rotationSequence: 0
  };
  const pieceNext = {
    coords: [[1, 0], [1, 1], [2, 0], [3, 0]],
    name: 'lLShape',
    rotationSequence: 0
  };
  const mover = new Mover(piece);
  expect(mover.down()).toEqual(pieceNext);
})

test('Piece moves left', () => {
  const piece = {
    coords: [[0, 2], [1, 2], [2, 1], [2, 2]],
    name: 'lRShape',
    rotationSequence: 2
  };
  const pieceNext = {
    coords: [[0, 1], [1, 1], [2, 0], [2, 1]],
    name: 'lRShape',
    rotationSequence: 2

  };
  const mover = new Mover(piece);
  expect(mover.left()).toEqual(pieceNext);
})

test('Piece moves right', () => {
  const piece = {
    coords: [[0, 2], [1, 2], [2, 1], [2, 2]],
    name: 'lRShape',
    rotationSequence: 2
  };
  const pieceNext = {
    coords: [[0, 3], [1, 3], [2, 2], [2, 3]],
    name: 'lRShape',
    rotationSequence: 2

  };
  const mover = new Mover(piece);
  expect(mover.right()).toEqual(pieceNext);
})

test('Piece rotates clockwise', () => {
  const piece = {
    coords: [[0, 2], [1, 2], [2, 1], [2, 2]],
    name: 'lRShape',
    rotationSequence: 2
  };
  const pieceNext = {
    coords: [[0, 2], [1, 2], [2, 1], [2, 2]],
    name: 'lRShape',
    rotationSequence: 3

  };
  const mover = new Mover(piece);
  expect(mover.rotateClockwise()).toEqual(pieceNext);
})

test('Piece rotates clockwise back to 0 sequence when overflows', () => {
  const piece = {
    coords: [[0, 2], [1, 2], [2, 1], [2, 2]],
    name: 'lRShape',
    rotationSequence: 3
  };
  const pieceNext = {
    coords: [[0, 2], [1, 2], [2, 1], [2, 2]],
    name: 'lRShape',
    rotationSequence: 0

  };
  const mover = new Mover(piece);
  expect(mover.rotateClockwise()).toEqual(pieceNext);
})

test('Piece square shape doesn\'t rotate', () => {
  const piece = {
    coords: [[0, 0], [0, 1], [1, 0], [1, 1]],
    name: 'square',
    rotationSequence: 0
  };
  const pieceNext = {
    coords: [[0, 0], [0, 1], [1, 0], [1, 1]],
    name: 'square',
    rotationSequence: 0

  };
  const mover = new Mover(piece);
  expect(mover.rotateClockwise()).toEqual(pieceNext);
})