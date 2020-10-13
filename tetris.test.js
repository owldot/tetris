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

  test('detectFullRows no rows', () => {
    let board = new Board(4, 5);
    board.area = [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 1, 1], [0, 1, 1, 1]];
    expect(board.detectFullRows()).toEqual([])
  })

  test('detectFullRows row 4 only', () => {
    let board = new Board(4, 5);
    board.area = [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 1, 1], [1, 1, 1, 1]];
    expect(board.detectFullRows()).toEqual([4])
  })

  test('detectFullRows #3 and #4 rows', () => {
    let board = new Board(4, 5);
    board.area = [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 1], [1, 1, 1, 1], [1, 1, 1, 1]];
    expect(board.detectFullRows()).toEqual([3, 4])
  })

  test('clearRow #3', () => {
    let board = new Board(4, 5);
    board.area = [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 1], [1, 1, 1, 1], [1, 1, 1, 1]];
    const expectedArea = [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 0], [1, 1, 1, 1]];
    board.clearRow(3);
    expect(board.area).toEqual(expectedArea);
  })

  test('clearFullRow 0', () => {
    let board = new Board(4, 5);
    board.area = [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 1, 1], [1, 1, 0, 1]];
    const expectedArea = [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 1, 1], [1, 1, 0, 1]];
    expect(board.clearFullLines()).toBe(0);
    expect(board.area).toEqual(expectedArea);
  })

  test('clearFullRow 1 row', () => {
    let board = new Board(4, 5);
    board.area = [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 1, 1], [1, 1, 1, 1]];
    const expectedArea = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 1, 1]];
    expect(board.clearFullLines()).toBe(1);
    expect(board.area).toEqual(expectedArea);
  })

  test('clearFullRow 2 rows', () => {
    let board = new Board(4, 5);
    board.area = [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]];
    const expectedArea = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 1, 1]];
    expect(board.clearFullLines()).toBe(2);
    console.log(board.area)
    expect(board.area).toEqual(expectedArea);
  })

  test('clearFullRow 2 rows with hole in the middle', () => {
    let board = new Board(4, 5);
    board.area = [[0, 0, 0, 0], [0, 0, 0, 1], [1, 1, 1, 1], [1, 1, 0, 1], [1, 1, 1, 1]];
    const expectedArea = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 1], [1, 1, 0, 1]];
    expect(board.clearFullLines()).toBe(2);
    expect(board.area).toEqual(expectedArea);
  })

  test('getYOfFirstFilledLineInXRange - find the most top y of filled cells', () => {
    let board = new Board(4, 5);
    board.area = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [1, 1, 1, 0]];
    expect(board.getYOfFirstFilledLineInXRange(0, 2)).toBe(2);
    expect(board.getYOfFirstFilledLineInXRange(1, 2)).toBe(3);
    expect(board.getYOfFirstFilledLineInXRange(3, 3)).toBe(4);
  })
})

describe('Tetris', () => {
  test('Tetris is initiated', () => {
    let board = new Board(3, 4);
    let tetris = new Tetris(board);
    expect(tetris.piece).toBeDefined();
  });

  test('Vertical I-shape rotates near right border', () => {
    let tetris = new Tetris(5, 6);

    const piece = new Piece([[1, 4], [2, 4], [3, 4], [4, 4]], 'iShape', 1);
    tetris.piece = piece;
    tetris.placePiece();
    const expectedArea = [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ];
    tetris.rotate();
    expect(tetris.board.area).toEqual(expectedArea);
  })

  test('Drop shape - empty board', () => {
    let tetris = new Tetris(5, 6);

    const piece = new Piece([[1, 4], [2, 4], [3, 4], [4, 4]], 'iShape', 1);
    tetris.piece = piece;
    tetris.placePiece();
    const expectedArea = [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ];
    tetris.rotate();
    expect(tetris.board.area).toEqual(expectedArea);
  })
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
    expect(mover._rotateClockwise()).toEqual(pieceNext);
  })

  test('Piece rotates clockwise back to 0 sequence when overflows', () => {
    const piece = new Piece([[0, 2], [1, 2], [2, 1], [2, 2]], 'lRShape', 3);
    const pieceNext = new Piece([[0, 1], [0, 2], [1, 1], [2, 1]], 'lRShape', 0);

    const mover = new Mover(piece);
    expect(mover._rotateClockwise()).toEqual(pieceNext);
  })

  test('Piece square shape doesn\'t rotate', () => {
    const piece = new Piece([[0, 0], [0, 1], [1, 0], [1, 1]], 'square', 0);
    const pieceNext = new Piece([[0, 0], [0, 1], [1, 0], [1, 1]], 'square', 0);

    const mover = new Mover(piece);
    expect(mover._rotateClockwise()).toEqual(pieceNext);
  })

  test('Piece rotates clockwise considering it\'s current coordinates', () => {
    const piece = new Piece([[4, 5], [5, 5], [6, 5], [6, 4]], 'lRShape', 2);
    const pieceNext = new Piece([[5, 4], [6, 4], [6, 5], [6, 6]], 'lRShape', 3);

    const mover = new Mover(piece);
    expect(mover._rotateClockwise()).toEqual(pieceNext);
  })

  test('Piece shifts from wall', () => {
    const piece = new Piece([[1, 4], [2, 4], [3, 4], [4, 4]], 'iShape', 1);
    const pieceExpected = new Piece([[1, 1], [1, 2], [1, 3], [1, 4]], 'iShape', 0);

    const mover = new Mover(piece);
    expect(mover.rotateClockwiseWithShift(4)).toEqual(pieceExpected);
  })

})
