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
    protected;
    /**
     * @param {Number} box 
     * @param {Position} pos 
     * @param {Number} value 
     * @param {Boolean} protected 
     */
    constructor(box, pos, value, protected = false){
        this.box = box
        this.pos = pos
        this.value = value
        this.protected = protected
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

    /**
     * Get a specific row from the board
     * @param {Position} pos the Position of the Cell
     * @returns {Cell} the requested cell
     */
    getCell(pos){
        return this.cells.find(value => value.pos.row === pos.row && value.pos.col === pos.col)
    }

    /**
     * Get a specific row from the board
     * @param {Number} num the row to get [1-9]
     * @returns {Array<Cell>} the requested row
     */
    getRow(num){
        return this.cells.filter(value => value.pos.row === num)
    }

    /**
     * Get a specific column from the board
     * @param {Number} num the column to get [1-9]
     * @returns {Array<Cell>} the requested column
     */
    getColumn(num){
        return this.cells.filter(value => value.pos.col === num)
    }

    /**
     * Get a specific box from the board
     * @param {Number} num the box to get [1-9]
     * @returns {Array<Cell>} the requested box
     */
    getBox(num){
        return this.cells.filter(value => value.box === num)
    }

    /**
     * Checks if every cell in the board contains a non-zero value
     * @returns {Boolean} true if every cell contains a non-zero value, false otherwise
     */
    isBoardFilled(){
        for (let i = 0; i < this.cells.length; i++) {
            const cell = this.cells[i];
            if(cell.value === 0){
                return false
            }
        }
        return true
    }
}