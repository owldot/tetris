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

module.exports.Piece = Piece;
