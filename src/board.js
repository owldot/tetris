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
    return piece.coords.every(this.isValidCoordinate)
  }

  render(piece) {
    if (this.isValidMove(piece)) {
      piece.coords.forEach(([y, x]) => this.area[y][x] = 1)
    }
    return this.area;
  }

  shiftToCenter(piece) {
    let centerX = Math.ceil((this.width - piece.width) / 2);
    piece.shiftXCoordBy(centerX);
    return piece;
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

  clearFullLines() {
    const rowIndexes = this.detectFullRows();
    rowIndexes.forEach((index) => {
      this.clearRow(index);
    })

    if (rowIndexes.length > 0) {
      rowIndexes.forEach((index) => {
        this.area.splice(index, 1);
        this.area.splice(0, 0, new Array(this.width).fill(0));
      })

    }

    return rowIndexes.length;
  }

  getYOfFirstFilledLineInXRange(fromX, toX) {
    for (let y = 0; y < this.height; y++) {
      for (let x = fromX; x <= toX; x++)
        if (this.area[y][x] == 1) {
          return y
        }
    }
    return this.height - 1
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
    })
    return rows
  }
}

module.exports.Board = Board;
