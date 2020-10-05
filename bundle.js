(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { Tetris, Board } = require("./src/tetris.js");

document.addEventListener('DOMContentLoaded', () => {
  const width = 10;
  const grid = document.querySelector('.grid');
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  let squares = Array.from(document.querySelectorAll('.grid div'))
  let board = new Board(10, 20);
  let tetris = new Tetris(board);

  let state = tetris.render();
  squares.forEach((square, index) => {
    square.innerText = state[Math.floor(index / 10)][index % 10];
  })
})
},{"./src/tetris.js":2}],2:[function(require,module,exports){
class Tetris {

  constructor(board) {
    this.board = board;
    this.nextPiece = this.pickRandomPiece();
  }

  render() {
    return this.board.area
  }

  pickRandomPiece() {
    const keys = Object.keys(TetrisPieces);
    let randomKey = keys[Math.floor(Math.random() * keys.length)];
    let pieceWithAllRotations = TetrisPieces[randomKey].rotations;
    let randomRotation = Math.floor(Math.random() * pieceWithAllRotations.length);
    return {
      coords: pieceWithAllRotations[Math.floor(randomRotation)],
      name: randomKey,
      rotationSequence: randomRotation
    };
  }

}

class Board {
  height = 20;
  width = 10;
  area;
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
}

class Mover {
  constructor(piece) {
    this.coords = piece.coords;
    this.nameOfShape = piece.name;
    this.rotationSequence = piece.rotationSequence;
  }

  down() {
    let coords = this.coords.map((coords) => {
      let [row, col] = coords;
      return [row + 1, col]
    });
    return {
      coords: coords,
      name: this.nameOfShape,
      rotationSequence: this.rotationSequence
    }
  }

  left() {
    let coords = this.coords.map((coords) => {
      let [row, col] = coords;
      return [row, col - 1]
    })

    return {
      coords: coords,
      name: this.nameOfShape,
      rotationSequence: this.rotationSequence
    }
  }

  right() {
    let coords = this.coords.map((coords) => {
      let [row, col] = coords;
      return [row, col + 1]
    })

    return {
      coords: coords,
      name: this.nameOfShape,
      rotationSequence: this.rotationSequence
    }
  }

  rotateClockwise() {
    const allRotations = TetrisPieces[this.nameOfShape].rotations;
    const nextRotation = (this.rotationSequence + allRotations.length + 1) % allRotations.length
    return {
      coords: this.coords,
      name: this.nameOfShape,
      rotationSequence: nextRotation
    }
  }
}

const TetrisPieces = {
  square: { rotations: [[[0, 0], [0, 1], [1, 0], [1, 1]]] },
  lRShape: {
    rotations: [
      [[0, 1], [0, 2], [1, 1], [2, 1]],
      [[1, 0], [1, 1], [1, 2], [2, 2]],
      [[0, 1], [1, 1], [2, 0], [2, 1]],
      [[1, 0], [2, 0], [2, 1], [2, 2]]
    ]
  },
  lLShape: {
    rotations: [
      [[0, 0], [0, 1], [1, 0], [2, 0]],
      [[0, 0], [0, 1], [0, 2], [1, 2]],
      [[0, 2], [1, 2], [2, 1], [2, 2]],
      [[1, 0], [2, 0], [2, 1], [2, 2]]
    ]
  },
  tShape: {
    rotations: [
      [[0, 0], [1, 0], [1, 1], [2, 0]],
      [[0, 0], [0, 1], [0, 2], [1, 1]],
      [[0, 2], [1, 1], [1, 2], [2, 2]],
      [[1, 1], [2, 0], [2, 1], [2, 2]]
    ]
  },
  zLShape: {
    rotations: [
      [[0, 1], [1, 0], [1, 1], [2, 0]],
      [[0, 0], [0, 1], [0, 2], [1, 1]]
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
      [[0, 1], [1, 1], [2, 1], [3, 1]]
    ]
  },
}


module.exports.Tetris = Tetris;
module.exports.Board = Board;
module.exports.Mover = Mover;
},{}]},{},[1]);
