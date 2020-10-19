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
