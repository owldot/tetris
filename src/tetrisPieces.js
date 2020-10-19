const TetrisPieces = {
  square: {
    rotations: [
      {
        shape: [[0, 0], [0, 1], [1, 0], [1, 1]],
        width: 2
      }
    ]
  },
  lRShape: {
    rotations: [
      {
        shape: [[0, 0], [0, 1], [1, 0], [2, 0]],
        width: 2
      },

      {
        shape: [[1, 0], [1, 1], [1, 2], [2, 2]],
        width: 3
      },
      {
        shape: [[0, 1], [1, 1], [2, 0], [2, 1]],
        width: 2
      },
      {
        shape: [[1, 0], [2, 0], [2, 1], [2, 2]],
        width: 3
      }
    ]
  },
  lLShape: {
    rotations: [
      {
        shape: [[0, 0], [0, 1], [1, 1], [2, 1]],
        width: 2
      },
      {
        shape: [[0, 2], [1, 0], [1, 1], [1, 2]],
        width: 3
      },
      {
        shape: [[0, 0], [1, 0], [2, 0], [2, 1]],
        width: 2
      },
      {
        shape: [[1, 0], [1, 1], [1, 2], [2, 0]],
        width: 3
      }
    ]
  },
  tShape: {
    rotations: [
      {
        shape: [[0, 0], [1, 0], [1, 1], [2, 0]],
        width: 2
      },
      {
        shape: [[0, 0], [0, 1], [0, 2], [1, 1]],
        width: 3
      },
      {
        shape: [[0, 1], [1, 0], [1, 1], [2, 1]],
        width: 2
      },
      {
        shape: [[1, 1], [2, 0], [2, 1], [2, 2]],
        width: 3
      }
    ]
  },
  zLShape: {
    rotations: [
      {
        shape: [[0, 1], [1, 0], [1, 1], [2, 0]],
        width: 2
      },
      {
        shape: [[0, 0], [0, 1], [1, 1], [1, 2]],
        width: 3
      }
    ]
  },
  zRShape: {
    rotations: [
      {
        shape: [[0, 1], [0, 2], [1, 0], [1, 1]],
        width: 3
      },
      {
        shape: [[0, 0], [1, 0], [1, 1], [2, 1]],
        width: 2
      }
    ]
  },
  iShape: {
    rotations: [
      {
        shape: [[0, 0], [0, 1], [0, 2], [0, 3]],
        width: 4
      },
      {
        shape: [[0, 1], [1, 1], [2, 1], [3, 1]],
        width: 1
      }
    ]
  },
}

module.exports.TetrisPieces = TetrisPieces;
