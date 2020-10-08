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
    const allRotations = TetrisPieces[this.nameOfShape].rotations;
    const nextRotation = (this.rotationSequence + allRotations.length + 1) % allRotations.length
    return new Piece(TetrisPieces[this.nameOfShape].rotations[nextRotation],
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
}

module.exports.Mover = Mover;
