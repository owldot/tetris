class Piece {
  constructor(coords, nameOfShape, rotationSequence) {
    this.coords = coords;
    this.nameOfShape = nameOfShape;
    this.rotationSequence = rotationSequence;
  }

  maxX() {
    let max = 0;
    this.coords.forEach(([y, x]) => {
      max = (max < x) ? x : max;
    })
    return max;
  }

  shiftXCoordBy(units) {
    const shiftedCoords = this.coords.map((coords) => {
      let [row, col] = coords;
      return [row, col - units]
    })
    this.coords = shiftedCoords;
  }
}

module.exports.Piece = Piece;
