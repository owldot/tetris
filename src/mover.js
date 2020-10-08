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
