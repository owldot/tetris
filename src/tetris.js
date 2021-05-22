const { Board } = require('./board');
const { Mover } = require('./mover');
const { Piece } = require('./piece');
const { TetrisPieces } = require('./tetrisPieces');
const LevelSpeed = {
  1: 600,
  2: 550,
  3: 500,
  4: 450,
  5: 400,
  6: 350,
  7: 300,
  8: 250,
  9: 200,
  10: 150
};

class Tetris {
  constructor(boardWidth, boardHeight) {
    this.board = new Board(boardWidth, boardHeight);
    this.piece = this.pickRandomPiece();
    this.prepareNextPiece();
    this.score = 0;
    this.timesLinesWereClearted = 0;
    this.level = 1;
    this.speed = LevelSpeed[this.level];
  }

  prepareNextPiece() {
    const windowWidth = 4;
    this.nextPiece = this.pickRandomPiece();
    const shift =
      this.nextPiece.width == 1
        ? (windowWidth - this.nextPiece.width) / 2 - 2
        : (windowWidth - this.nextPiece.width) / 2;
    this.nextPiece.shiftXCoordBy(Math.round(shift));
  }

  placePiece() {
    return this.board.render(this.piece);
  }

  moveRight() {
    const mover = new Mover(this.piece);

    this.board.clearPiece(this.piece);
    if (this.board.isValidMove(mover.right())) {
      this.piece = mover.right();
      return this.placePiece();
    } else {
      return this.placePiece();
    }
  }

  moveLeft() {
    const mover = new Mover(this.piece);

    this.board.clearPiece(this.piece);
    if (this.board.isValidMove(mover.left())) {
      this.piece = mover.left();
      this.placePiece();
    } else {
      this.placePiece();
    }
  }

  moveDown() {
    const mover = new Mover(this.piece);
    this.board.clearPiece(this.piece);
    if (this.board.isValidMove(mover.down())) {
      this.piece = mover.down();
      this.placePiece();
    } else {
      this.placePiece(); // return back previously cleared element

      this.calculateScore();
      this.setSpeed();

      this.settleAndPrepareNext();
    }
  }

  settleAndPrepareNext() {
    // prepare shape for assigning to current piece
    if (this.nextPiece.width <= 2) {
      this.nextPiece.shiftXCoordBy(-1);
    }

    this.piece = this.nextPiece;
    this.piece = this.board.shiftToCenter(this.piece);
    this.prepareNextPiece();

    if (!this.board.isValidMove(this.piece)) {
      throw new GameOverError('Game Over');
    }

    this.placePiece();
  }

  calculateScore() {
    const linesCleared = this.board.clearFullLines();
    if (linesCleared > 0) {
      this.score +=
        this.getScoreMultiplier(linesCleared) * this.getSpeedMultiplier();
      this.timesLinesWereClearted += 1;
    }
  }
  getSpeedMultiplier() {
    if (this.level < 5) {
      return 10;
    } else if (this.level >= 5 && this.level < 10) {
      return 15;
    } else if (this.level >= 10) {
      return 20 + (this.level - 10);
    }
  }

  getScoreMultiplier(linesCleared) {
    switch (linesCleared) {
      case 1:
        return 1;
      case 2:
        return 3;
      case 3:
        return 5;
      case 4:
        return 10;
    }
  }

  setSpeed() {
    this.level =
      this.timesLinesWereClearted == 0
        ? 1
        : Math.ceil(this.timesLinesWereClearted / 10);

    this.speed =
      this.level < 11
        ? LevelSpeed[this.level]
        : LevelSpeed[Object.keys(LevelSpeed).length];
  }

  drop() {
    let mover = new Mover(this.piece);
    while (true) {
      this.board.clearPiece(this.piece);
      if (this.board.isValidMove(mover.down())) {
        this.piece = mover.down();
        this.placePiece();
        mover = new Mover(this.piece);
      } else {
        this.placePiece(); // return back previously cleared element
        this.calculateScore();
        this.setSpeed();
        break;
      }
    }
  }

  rotate() {
    const mover = new Mover(this.piece);

    this.board.clearPiece(this.piece);
    const limitX = this.board.width - 1;
    if (this.board.isValidMove(mover.rotateClockwiseWithShift(limitX))) {
      this.piece = mover.rotateClockwiseWithShift(limitX);
      this.placePiece();
    } else {
      this.placePiece();
    }
  }

  pickRandomPiece() {
    const keys = Object.keys(TetrisPieces);
    let randomKey = keys[Math.floor(Math.random() * keys.length)];
    let pieceWithAllRotations = TetrisPieces[randomKey].rotations;
    let randomRotation = Math.floor(
      Math.random() * pieceWithAllRotations.length
    );
    return new Piece(
      pieceWithAllRotations[Math.floor(randomRotation)].shape,
      randomKey,
      randomRotation
    );
  }

  positionInCentre() {
    this.board.clearPiece(this.piece);
    this.piece = this.board.shiftToCenter(this.piece);
    this.placePiece();
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
