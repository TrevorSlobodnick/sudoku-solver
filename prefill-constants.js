// Boards with varying difficulty, easy => expert were gotten from https://sudoku.com/
// The master board is supposedly the hardest in the world, found at // Hardest in world - https://abcnews.go.com/blogs/headlines/2012/06/can-you-solve-the-hardest-ever-sudoku

const easy = [ // 213 seconds
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 6, 0, 1, 0, 0, 0],
    [2, 0, 0, 0, 5, 0, 0, 0, 3],
    [0, 0, 4, 0, 0, 0, 0, 6, 0]
]

const medium = [
    [0, 0, 0, 0, 7, 0, 2, 0, 9],
    [7, 1, 0, 0, 9, 4, 0, 0, 0],
    [0, 9, 6, 0, 0, 0, 7, 1, 0],
    [3, 0, 5, 0, 8, 0, 0, 9, 7],
    [0, 6, 0, 0, 5, 0, 0, 0, 0],
    [0, 7, 4, 0, 0, 2, 5, 0, 0],
    [0, 0, 0, 8, 0, 5, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 5, 0],
    [2, 5, 8, 0, 0, 0, 4, 7, 1]
]

const hard = [
   [5, 0, 0, 7, 0, 0, 0, 0, 0],
   [0, 0, 2, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 1, 9, 0, 0, 3],
   [4, 0, 0, 5, 0, 8, 9, 3, 0],
   [0, 0, 0, 0, 0, 2, 6, 7, 0],
   [0, 8, 3, 0, 9, 0, 2, 4, 0],
   [0, 7, 0, 9, 0, 0, 3, 5, 0],
   [0, 0, 9, 8, 0, 0, 7, 6, 0],
   [0, 0, 0, 0, 0, 3, 0, 0, 0]
]

const expert = [
    [2, 0, 0, 0, 0, 9, 0, 0, 0],
    [5, 0, 0, 0, 0, 0, 4, 1, 0],
    [0, 7, 0, 0, 4, 0, 0, 0, 0],
    [0, 0, 9, 0, 2, 0, 0, 0, 8],
    [0, 0, 0, 0, 0, 0, 0, 0, 3],
    [0, 3, 8, 0, 0, 0, 7, 0, 0],
    [0, 0, 0, 8, 9, 3, 0, 0, 0],
    [0, 0, 0, 7, 0, 0, 0, 6, 0],
    [0, 0, 0, 2, 0, 0, 0, 7, 5]
]

const master = [
    [8, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 6, 0, 0, 0, 0, 0],
    [0, 7, 0, 0, 9, 0, 2, 0, 0],
    [0, 5, 0, 0, 0, 7, 0, 0, 0],
    [0, 0, 0, 0, 4, 5, 7, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 3, 0],
    [0, 0, 1, 0, 0, 0, 0, 6, 8],
    [0, 0, 8, 5, 0, 0, 0, 1, 0],
    [0, 9, 0, 0, 0, 0, 4, 0, 0]
]