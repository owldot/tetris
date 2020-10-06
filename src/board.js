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

  isValidCoordinate = ([y, x]) => {
    return (x >= 0 && y >= 0 && x < this.width && y < this.height && this.area[y][x] == 0)
  };
}

module.exports.Board = Board;
