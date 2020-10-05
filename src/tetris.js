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
    return new Piece(pieceWithAllRotations[Math.floor(randomRotation)], randomKey, randomRotation);
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

class Piece {
  coords;
  nameOfShape;
  rotationSequence;

  constructor(coords, nameOfShape, rotationSequence) {
    this.coords = coords;
    this.nameOfShape = nameOfShape;
    this.rotationSequence = rotationSequence;
  }
}

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
    const allRotations = TetrisPieces[this.nameOfShape].rotations;
    const nextRotation = (this.rotationSequence + allRotations.length + 1) % allRotations.length
    return new Piece(this.coords, this.nameOfShape, nextRotation);
  }

  rotateCounterClockwise() {
    const allRotations = TetrisPieces[this.nameOfShape].rotations;
    const nextRotation = (this.rotationSequence + allRotations.length - 1) % allRotations.length
    return new Piece(this.coords, this.nameOfShape, nextRotation);
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
module.exports.Piece = Piece;
