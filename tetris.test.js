const { Tetris } = require('./src/tetris');
const { Board } = require('./src/board');
const { Mover } = require('./src/mover');
const { Piece } = require('./src/piece');
const { TetrisPieces } = require('./src/tetrisPieces');

describe('Board', () => {
  test('Board is created', () => {
    let board = new Board(4, 5);
    let emptyField = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    expect(board.area).toEqual(emptyField);
    expect(board.width).toBe(4);
    expect(board.height).toBe(5);
  });

  test('is valid move', () => {
    let board = new Board(4, 5);
    let piece = new Piece([[0, 0], [0, 1], [1, 0], [1, 1]], 'square', 0);
    expect(board.isValidMove(piece)).toBeTruthy();
  })

  test('is invalid move - negative x', () => {
    let board = new Board(4, 5);
    let piece = new Piece([[0, -1], [0, 0], [1, -1], [1, 0]], 'square', 0);
    expect(board.isValidMove(piece)).toBeFalsy();
  })

  test('is invalid move - negative y', () => {
    let board = new Board(4, 5);
    let piece = new Piece([[-1, 0], [0, 0], [1, 0], [1, 0]], 'square', 0);
    expect(board.isValidMove(piece)).toBeFalsy();
  })

  test('is invalid move - x too big', () => {
    let board = new Board(4, 5);
    let piece = new Piece([[0, 3], [0, 4], [1, 3], [1, 4]], 'square', 0);
    expect(board.isValidMove(piece)).toBeFalsy();
  })

  test('is valid move - x on the edge', () => {
    let board = new Board(4, 5);
    let piece = new Piece([[0, 2], [0, 3], [1, 2], [1, 3]], 'square', 0);
    expect(board.isValidMove(piece)).toBeTruthy();
  })

  test('is invalid move - place is taken', () => {
    let board = new Board(4, 5);
    board.area[1][3] = 1;
    let piece = new Piece([[0, 2], [0, 3], [1, 2], [1, 3]], 'square', 0);
    expect(board.isValidMove(piece)).toBeFalsy();
  })

  test('render piece on the board', () => {
    let board = new Board(4, 5);
    let piece = new Piece([[0, 2], [0, 3], [1, 2], [1, 3]], 'square', 0);
    const area = [[0, 0, 1, 1], [0, 0, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    expect(board.render(piece)).toEqual(area);
  })
})

describe('Tetris', () => {
  test('Tetris is initiated', () => {
    let board = new Board(3, 4);
    let tetris = new Tetris(board);
    expect(tetris.piece).toBeDefined();
  });
})

describe('Mover', () => {
  test('Piece moves down', () => {
    const piece = new Piece([[0, 0], [0, 1], [1, 0], [2, 0]], 'lLShape', 0);
    const pieceNext = new Piece([[1, 0], [1, 1], [2, 0], [3, 0]], 'lLShape', 0)

    const mover = new Mover(piece);
    expect(mover.down()).toEqual(pieceNext);
  })

  test('Piece moves left', () => {
    const piece = new Piece([[0, 2], [1, 2], [2, 1], [2, 2]], 'lRShape', 2);
    const pieceNext = new Piece([[0, 1], [1, 1], [2, 0], [2, 1]], 'lRShape', 2)

    const mover = new Mover(piece);
    expect(mover.left()).toEqual(pieceNext);
  })

  test('Piece moves right', () => {
    const piece = new Piece([[0, 2], [1, 2], [2, 1], [2, 2]], 'lRShape', 2);
    const pieceNext = new Piece([[0, 3], [1, 3], [2, 2], [2, 3]], 'lRShape', 2)

    const mover = new Mover(piece);
    expect(mover.right()).toEqual(pieceNext);
  })

  test('Piece rotates clockwise', () => {
    const piece = new Piece([[0, 1], [1, 1], [2, 0], [2, 1]], 'lRShape', 2);
    const pieceNext = new Piece([[1, 0], [2, 0], [2, 1], [2, 2]], 'lRShape', 3);

    const mover = new Mover(piece);
    expect(mover.rotateClockwise()).toEqual(pieceNext);
  })

  test('Piece rotates counterclockwise', () => {
    const piece = new Piece([[0, 2], [1, 2], [2, 1], [2, 2]], 'lRShape', 2);
    const pieceNext = new Piece([[1, 0], [1, 1], [1, 2], [2, 2]], 'lRShape', 1);

    const mover = new Mover(piece);
    expect(mover.rotateCounterClockwise()).toEqual(pieceNext);
  })

  test('Piece rotates clockwise back to 0 sequence when overflows', () => {
    const piece = new Piece([[0, 2], [1, 2], [2, 1], [2, 2]], 'lRShape', 3);
    const pieceNext = new Piece([[0, 1], [0, 2], [1, 1], [2, 1]], 'lRShape', 0);

    const mover = new Mover(piece);
    expect(mover.rotateClockwise()).toEqual(pieceNext);
  })

  test('Piece square shape doesn\'t rotate', () => {
    const piece = new Piece([[0, 0], [0, 1], [1, 0], [1, 1]], 'square', 0);
    const pieceNext = new Piece([[0, 0], [0, 1], [1, 0], [1, 1]], 'square', 0);

    const mover = new Mover(piece);
    expect(mover.rotateClockwise()).toEqual(pieceNext);
  })
})
