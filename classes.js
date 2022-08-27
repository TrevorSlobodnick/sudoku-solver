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

class Row{
    row;
    cells;
    /**
     * @param {Number} row - the number of the row
     * @param {Array<Cell>} cells - an array containing all the cells in a row
     */
    constructor(row, cells){
        this.row = row;
        this.cells = cells;
    }

    isValid(){
        let nonZeroValues = []
        for (let i = 1; i <= 9; i++) {
            const cell = this.cells[i]
            if(cell.value != 0){
                if(nonZeroValues.includes(cell.value)){
                    return false
                }
                else{
                    nonZeroValues.push(cell.value)
                }
            }
        }
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
    isFilled(){
        for (let i = 0; i < this.cells.length; i++) {
            const cell = this.cells[i];
            if(cell.value === 0){
                return false
            }
        }
        return true
    }

    isValid(){
        // we need these functions so that they can be used in the middle for loop
        const functions = [
            this.getRow,
            this.getColumn,
            this.getBox
        ]
        // We need to validate 3 things, the rows, columns and boxes
        for (let i = 0; i < 3; i++) {
            // using I we can determine which function we are using based on functions array
            // now we need to loop through each row, column, and box
            for (let j = 1; j <= 9; j++) {
                // j represents which row/column/box we are on
                // combined with i, we can now call our functions to get appropriate cells
                const cells = functions[i](j)
                let nonZeroValues = []
                // now that we have our cells, we need to go through each one individually
                for (let k = 1; k <= 9; k++) {
                    // get the cell using k
                    const cell = cells[k]
                    if(cell.value != 0){
                        if(nonZeroValues.includes(cell.value)){
                            return false
                        }
                        else{
                            nonZeroValues.push(cell.value)
                        }
                    }
                }
            }
        }
        return true
    }
}