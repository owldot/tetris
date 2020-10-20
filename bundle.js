(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { Tetris, GameOverError } = require('./src/tetris.js');
const { Board } = require('./src/board.js');

document.addEventListener('DOMContentLoaded', () => {
  const scoreDisplay = document.getElementById('score');
  const startBtn = document.getElementById('start-button');
  const resumeBtn = document.getElementById('resume-button');
  const label = document.getElementById('label');
  const labelDrop = document.querySelector('.centerLabel');

  document.addEventListener('keydown', listenKeyMove);
  document.addEventListener('keydown', listenKeyPause);
  startBtn.addEventListener('click', startNewGame);
  resumeBtn.addEventListener('click', pauseGame);

  let squares = Array.from(document.querySelectorAll('.grid.game div'));
  let nextPieceSquares = Array.from(
    document.querySelectorAll('#next-piece div')
  );
  let tetris;
  let interval;
  let intervalMs;
  let togglePause = false;
  startNewGame();

  function listenKeyPause(event) {
    switch (event.keyCode) {
      case 27:
        pauseGame();
        break;
    }
  }

  function startNewGame() {
    tetris = new Tetris(10, 20);
    tetris.positionInCentre();
    render();
    clearInterval(interval);
    togglePause = false;
    labelDrop.classList.add('hidden');
    document.addEventListener('keydown', listenKeyMove);
    document.addEventListener('keydown', listenKeyPause);
    intervalMs = tetris.speed;
    interval = setInterval(nextMoveDown.bind(this), intervalMs);
    renderNextPiece();
  }

  function gameOver() {
    clearInterval(interval);
    labelDrop.classList.remove('hidden');
    label.innerText = 'Game Over';
    resumeBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    document.removeEventListener('keydown', listenKeyMove);
    document.removeEventListener('keydown', listenKeyPause);
  }

  function pauseGame() {
    togglePause = !togglePause;
    if (togglePause) {
      labelDrop.classList.remove('hidden');
      label.innerText = 'Paused';
      startBtn.classList.add('hidden');
      resumeBtn.classList.remove('hidden');
      document.removeEventListener('keydown', listenKeyMove);
      clearInterval(interval);
    } else {
      document.addEventListener('keydown', listenKeyMove);
      labelDrop.classList.add('hidden');
      resumeBtn.classList.remove('hidden');
      interval = setInterval(nextMoveDown.bind(this), tetris.speed);
    }
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
        tetris.moveRight();
        break;
      case 40:
        try {
          tetris.moveDown();
        } catch (e) {
          if (e instanceof GameOverError) {
            gameOver();
          }
        }
        break;
      case 32:
        tetris.drop();
    }
    render();
  }

  function render() {
    let state = tetris.board.area;

    squares.forEach((square, index) => {
      let matrixElement = state[Math.floor(index / 10)][index % 10];
      if (matrixElement === 1) {
        const cssClassName = tetris.piece.color;
        square.classList.add('filled');
        // Testing if color was already assigned
        if (square.classList.length == 1) {
          square.classList.add(cssClassName);
        }
      } else {
        square.className = ''; // Clear all colors
      }
    });
  }

  function renderNextPiece() {
    nextPieceSquares.forEach((el) => (el.className = ''));
    tetris.nextPiece.coords.forEach(([y, x]) => {
      nextPieceSquares[
        y * 4 + x
      ].className = `filled ${tetris.nextPiece.color}`;
    });
  }

  function nextMoveDown() {
    try {
      tetris.moveDown();
      render();
      renderNextPiece();
      scoreDisplay.innerText = tetris.score;
      if (intervalMs != tetris.speed) {
        clearInterval(interval);
        intervalMs = tetris.speed;
        interval = setInterval(nextMoveDown.bind(this), intervalMs);
      }
    } catch (e) {
      if (e instanceof GameOverError) {
        gameOver();
      }
    }
  }
});

},{"./src/board.js":2,"./src/tetris.js":5}],2:[function(require,module,exports){
class Board {
  constructor(width = 10, height = 20) {
    this.width = width;
    this.height = height;
    this.area = new Array(height);
    for (let row = 0; row < this.height; row++) {
      this.area[row] = new Array(width).fill(0);
    }
  }

  isValidMove(piece) {
    return piece.coords.every(this.isValidCoordinate);
  }

  render(piece) {
    if (this.isValidMove(piece)) {
      piece.coords.forEach(([y, x]) => (this.area[y][x] = 1));
    }
    return this.area;
  }

  shiftToCenter(piece) {
    let centerX = Math.floor((this.width - piece.width) / 2);
    piece.shiftXCoordBy(centerX);
    return piece;
  }

  clearPiece(piece) {
    piece.coords.forEach(([y, x]) => (this.area[y][x] = 0));
  }

  isValidCoordinate = ([y, x]) => {
    return (
      x >= 0 &&
      y >= 0 &&
      x < this.width &&
      y < this.height &&
      this.area[y][x] == 0
    );
  };

  clearFullLines() {
    const rowIndexes = this.detectFullRows();
    rowIndexes.forEach((index) => {
      this.clearRow(index);
    });

    if (rowIndexes.length > 0) {
      rowIndexes.forEach((index) => {
        this.area.splice(index, 1);
        this.area.splice(0, 0, new Array(this.width).fill(0));
      });
    }

    return rowIndexes.length;
  }

  getYOfFirstFilledLineInXRange(fromX, toX) {
    for (let y = 0; y < this.height; y++) {
      for (let x = fromX; x <= toX; x++)
        if (this.area[y][x] == 1) {
          return y;
        }
    }
    return this.height - 1;
  }

  clearRow(index) {
    this.area[index] = new Array(this.width).fill(0);
  }

  detectFullRows() {
    let rows = [];
    this.area.forEach((row, index) => {
      if (row.every((cell) => cell == 1)) {
        rows.push(index);
      }
    });
    return rows;
  }
}

module.exports.Board = Board;

},{}],3:[function(require,module,exports){
const { Piece } = require('./piece');
const { TetrisPieces } = require('./tetrisPieces');

class Mover {
  constructor(piece) {
    this.coords = piece.coords;
    this.nameOfShape = piece.nameOfShape;
    this.rotationSequence = piece.rotationSequence;
  }

  down() {
    let coords = this.coords.map((coords) => {
      let [row, col] = coords;
      return [row + 1, col]
    });
    return new Piece(coords, this.nameOfShape, this.rotationSequence);
  }

  left() {
    let coords = this.coords.map((coords) => {
      let [row, col] = coords;
      return [row, col - 1]
    })

    return new Piece(coords, this.nameOfShape, this.rotationSequence);
  }

  right() {
    let coords = this.coords.map((coords) => {
      let [row, col] = coords;
      return [row, col + 1]
    })

    return new Piece(coords, this.nameOfShape, this.rotationSequence);
  }

  rotateClockwiseWithShift(maxAllowedX) {
    let piece = this._rotateClockwise();

    let maxX = piece.mostRightX();

    if (maxX >= maxAllowedX) {
      piece.shiftXCoordBy(-(maxX - maxAllowedX)); // Shift away from the right edge
    }

    return piece;
  }

  calculateShift() {
    let shiftX = Infinity;
    let shiftY = Infinity;
    this.coords.forEach(([y, x]) => {
      shiftX = (shiftX > x) ? x : shiftX;
      shiftY = (shiftY > y) ? y : shiftY;
    })
    return [shiftX, shiftY]
  }

  _rotateClockwise() {
    const [shiftX, shiftY] = this.calculateShift();
    const allRotations = TetrisPieces[this.nameOfShape].rotations;
    const nextRotation = (this.rotationSequence + allRotations.length + 1) % allRotations.length;
    const coords = TetrisPieces[this.nameOfShape].rotations[nextRotation].shape.map(([row, col]) => [row + shiftY, col + shiftX])
    return new Piece(coords,
      this.nameOfShape,
      nextRotation);
  }
}

module.exports.Mover = Mover;

},{"./piece":4,"./tetrisPieces":6}],4:[function(require,module,exports){
const { TetrisPieces } = require("./tetrisPieces");

const Colors = {
  lRShape: 'red',
  lLShape: 'yellow',
  tShape: 'blue',
  zLShape: 'white',
  zRShape: 'green',
  iShape: 'purple',
  square: 'cyan'
}

class Piece {
  constructor(coords, nameOfShape, rotationSequence) {
    this.coords = coords;
    this.nameOfShape = nameOfShape;
    this.rotationSequence = rotationSequence;
    this.color = Colors[nameOfShape];
    this.width = TetrisPieces[nameOfShape].rotations[rotationSequence].width
  }

  mostRightX() {
    let max = 0;
    this.coords.forEach(([y, x]) => {
      max = (max < x) ? x : max;
    })
    return max;
  }

  mostLeftX() {
    let min = Infinity;
    this.coords.forEach(([y, x]) => {
      min = (min > x) ? x : min;
    })
    return min;
  }

  shiftXCoordBy(units) {
    const shiftedCoords = this.coords.map((coords) => {
      let [row, col] = coords;
      return [row, col + units]
    })
    this.coords = shiftedCoords;
  }
}

module.exports.Piece = Piece;

},{"./tetrisPieces":6}],5:[function(require,module,exports){
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
  }

  calculateScore() {
    const linesCleared = this.board.clearFullLines();

    if (linesCleared > 0) {
      this.score += this.getScoreMultiplier(linesCleared);
      this.timesLinesWereClearted += 1;
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
    this.level = this.score == 0 ? 1 : Math.ceil(this.score / 10);

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

},{"./board":2,"./mover":3,"./piece":4,"./tetrisPieces":6}],6:[function(require,module,exports){
const TetrisPieces = {
  square: {
    rotations: [
      {
        shape: [[0, 0], [0, 1], [1, 0], [1, 1]],
        width: 2
      }
    ]
  },
  lRShape: {
    rotations: [
      {
        shape: [[0, 0], [0, 1], [1, 0], [2, 0]],
        width: 2
      },

      {
        shape: [[1, 0], [1, 1], [1, 2], [2, 2]],
        width: 3
      },
      {
        shape: [[0, 1], [1, 1], [2, 0], [2, 1]],
        width: 2
      },
      {
        shape: [[1, 0], [2, 0], [2, 1], [2, 2]],
        width: 3
      }
    ]
  },
  lLShape: {
    rotations: [
      {
        shape: [[0, 0], [0, 1], [1, 1], [2, 1]],
        width: 2
      },
      {
        shape: [[0, 2], [1, 0], [1, 1], [1, 2]],
        width: 3
      },
      {
        shape: [[0, 0], [1, 0], [2, 0], [2, 1]],
        width: 2
      },
      {
        shape: [[1, 0], [1, 1], [1, 2], [2, 0]],
        width: 3
      }
    ]
  },
  tShape: {
    rotations: [
      {
        shape: [[0, 0], [1, 0], [1, 1], [2, 0]],
        width: 2
      },
      {
        shape: [[0, 0], [0, 1], [0, 2], [1, 1]],
        width: 3
      },
      {
        shape: [[0, 1], [1, 0], [1, 1], [2, 1]],
        width: 2
      },
      {
        shape: [[1, 1], [2, 0], [2, 1], [2, 2]],
        width: 3
      }
    ]
  },
  zLShape: {
    rotations: [
      {
        shape: [[0, 1], [1, 0], [1, 1], [2, 0]],
        width: 2
      },
      {
        shape: [[0, 0], [0, 1], [1, 1], [1, 2]],
        width: 3
      }
    ]
  },
  zRShape: {
    rotations: [
      {
        shape: [[0, 1], [0, 2], [1, 0], [1, 1]],
        width: 3
      },
      {
        shape: [[0, 0], [1, 0], [1, 1], [2, 1]],
        width: 2
      }
    ]
  },
  iShape: {
    rotations: [
      {
        shape: [[0, 0], [0, 1], [0, 2], [0, 3]],
        width: 4
      },
      {
        shape: [[0, 1], [1, 1], [2, 1], [3, 1]],
        width: 1
      }
    ]
  },
}

module.exports.TetrisPieces = TetrisPieces;

},{}]},{},[1]);
