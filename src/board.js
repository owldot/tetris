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

module.exports.Board = Board;
