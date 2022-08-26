class Position{
    row;
    col;
    /**
     * @param {Number} row 
     * @param {Number} col
     */
    constructor(row, col){
        this.row = row
        this.col = col
    }
}

class Cell{
    box;
    pos;
    value;
    /**
     * @param {Number} box 
     * @param {Position} pos 
     * @param {Number} value 
     */
    constructor(box, pos, value){
        this.box = box;
        this.pos = pos
        this.value = value
    }
}

class Board{
    cells;
    /**
     * @param {Array<Cell>} cells 
     */
    constructor(cells){
        this.cells = cells
    }
}