(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./src/board.js":2,"./src/tetris.js":5}],2:[function(require,module,exports){
class Board {
  constructor(width = 10, height = 20) {
    this.width = width;
    this.height = height;
    this.area = new Array(height);
    for (let row = 0; row < this.height; row++) {
      this.area[row] = new Array(width);
      for (let col = 0; col < this.width; col++) {
        this.area[row][col] = 0
      }
    }
  }

  isValidMove(piece) {
    return piece.coords.every(this.isValidCoordinate)
  }

  render(piece) {
    if (this.isValidMove(piece)) {
      piece.coords.forEach(([y, x]) => this.area[y][x] = 1)
    }
    return this.area;
  }

  clearPiece(piece) {
    piece.coords.forEach(([y, x]) => this.area[y][x] = 0)
  }

  isValidCoordinate = ([y, x]) => {
    return (
      x >= 0 && y >= 0
      && x < this.width && y < this.height
      && this.area[y][x] == 0
    )
  };
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

  rotateClockwise() {
    const [shiftX, shiftY] = this.calculateShift();
    const allRotations = TetrisPieces[this.nameOfShape].rotations;
    const nextRotation = (this.rotationSequence + allRotations.length + 1) % allRotations.length;
    const coords = TetrisPieces[this.nameOfShape].rotations[nextRotation].map(([row, col]) => [row + shiftY, col + shiftX])

    return new Piece(coords,
      this.nameOfShape,
      nextRotation);
  }

  rotateCounterClockwise() {
    const allRotations = TetrisPieces[this.nameOfShape].rotations;
    const nextRotation = (this.rotationSequence + allRotations.length - 1) % allRotations.length
    return new Piece(TetrisPieces[this.nameOfShape].rotations[nextRotation],
      this.nameOfShape,
      nextRotation);
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
}

module.exports.Mover = Mover;

},{"./piece":4,"./tetrisPieces":6}],4:[function(require,module,exports){
class Piece {
  constructor(coords, nameOfShape, rotationSequence) {
    this.coords = coords;
    this.nameOfShape = nameOfShape;
    this.rotationSequence = rotationSequence;
  }
}

module.exports.Piece = Piece;

},{}],5:[function(require,module,exports){
const { Board } = require('./board');
const { Mover } = require('./mover');
const { Piece } = require('./piece');
const { TetrisPieces } = require('./tetrisPieces');

class Tetris {
  constructor(boardWidth, boardHeight) {
    this.board = new Board(boardWidth, boardHeight);
    this.piece = this.pickRandomPiece();
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

},{"./board":2,"./mover":3,"./piece":4,"./tetrisPieces":6}],6:[function(require,module,exports){
const TetrisPieces = {
  square: { rotations: [[[0, 0], [0, 1], [1, 0], [1, 1]]] },
  lRShape: {
    rotations: [
      [[0, 0], [0, 1], [1, 0], [2, 0]],
      [[1, 0], [1, 1], [1, 2], [2, 2]],
      [[0, 1], [1, 1], [2, 0], [2, 1]],
      [[1, 0], [2, 0], [2, 1], [2, 2]]
    ]
  },
  lLShape: {
    rotations: [
      [[0, 0], [0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 0], [1, 1], [1, 2]],
      [[0, 0], [1, 0], [2, 0], [2, 1]],
      [[1, 0], [1, 1], [1, 2], [2, 0]]
    ]
  },
  tShape: {
    rotations: [
      [[0, 0], [1, 0], [1, 1], [2, 0]],
      [[0, 0], [0, 1], [0, 2], [1, 1]],
      [[0, 1], [1, 0], [1, 1], [2, 1]],
      [[1, 1], [2, 0], [2, 1], [2, 2]]
    ]
  },
  zLShape: {
    rotations: [
      [[0, 1], [1, 0], [1, 1], [2, 0]],
      [[0, 0], [0, 1], [1, 1], [1, 2]]
    ]
  },
  zRShape: {
    rotations: [
      [[0, 1], [0, 2], [1, 0], [1, 1]],
      [[0, 0], [1, 0], [1, 1], [2, 1]]
    ]
  },
  iShape: {
    rotations: [
      [[1, 0], [1, 1], [1, 2], [1, 3]],
      [[0, 0], [1, 0], [2, 0], [3, 0]]
    ]
  },
}

module.exports.TetrisPieces = TetrisPieces;

},{}]},{},[1]);
