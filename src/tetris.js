const { Board } = require('./board');
const { Mover } = require('./mover');
const { Piece } = require('./piece');
const { TetrisPieces } = require('./tetrisPieces');

class Tetris {
  constructor(boardWidth, boardHeight) {
    this.board = new Board(boardWidth, boardHeight);
    this.piece = this.pickRandomPiece();
    this.score = 0;
  }

  placePiece() {
    return this.board.render(this.piece);
  }

  moveRight() {
    const mover = new Mover(this.piece);

    this.board.clearPiece(this.piece)
    if (this.board.isValidMove(mover.right())) {
      this.piece = mover.right();
      return this.placePiece()
    } else {
      return this.placePiece()
    }
  }

  moveLeft() {
    const mover = new Mover(this.piece);

    this.board.clearPiece(this.piece)
    if (this.board.isValidMove(mover.left())) {
      this.piece = mover.left();
      this.placePiece()
    } else {
      this.placePiece()
    }
  }

  moveDown() {
    const mover = new Mover(this.piece);
    this.board.clearPiece(this.piece)
    if (this.board.isValidMove(mover.down())) {
      this.piece = mover.down();
      this.placePiece()
    } else {
      this.placePiece() // return back previously cleared element
      this.score += this.board.clearFullLines();
      this.piece = this.pickRandomPiece();
      if (!this.board.isValidMove(this.piece)) {
        throw new GameOverError('Game Over');
      }
    }
  }

  rotate() {
    const mover = new Mover(this.piece);

    this.board.clearPiece(this.piece)
    if (this.board.isValidMove(mover.rotateClockwise())) {
      this.piece = mover.rotateClockwise();
      this.placePiece()
    } else {
      this.placePiece()
    }
  }

  pickRandomPiece() {
    const keys = Object.keys(TetrisPieces);
    let randomKey = keys[Math.floor(Math.random() * keys.length)];
    let pieceWithAllRotations = TetrisPieces[randomKey].rotations;
    let randomRotation = Math.floor(Math.random() * pieceWithAllRotations.length);
    return new Piece(pieceWithAllRotations[Math.floor(randomRotation)], randomKey, randomRotation);
  }
}

class GameOverError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GameOver';
  }
}

module.exports.Tetris = Tetris;
module.exports.GameOverError = GameOverError;
