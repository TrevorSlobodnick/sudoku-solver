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

    async hasNext(){
        if(this.row === 9 && this.col === 9){
            return Promise.resolve(false)
        }
        return Promise.resolve(true)
    }

    async next(){
        if(this.col === 9){
            return Promise.resolve(new Position(this.row + 1, 1))
        }
        return Promise.resolve(new Position(this.row, this.col + 1))
    }
}

class Cell{
    box;
    pos;
    value;
    isProtected;
    /**
     * @param {Number} box 
     * @param {Position} pos 
     * @param {Number} value 
     * @param {Boolean} isProtected 
     */
    constructor(box, pos, value, isProtected = false){
        this.box = box
        this.pos = pos
        this.value = value
        this.isProtected = isProtected
    }

    async getPossibleValues(board){
        const allValues = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        const row = await board.getRow(this.pos.row)
        const col = await board.getRow(this.pos.col)
        const box = await board.getRow(this.pos.box)
        let impossibleValues = Array.from(new Set([row, col, box].flat().map(c => c.value)))
        const index = impossibleValues.indexOf(0)
        if(index > -1){
            impossibleValues.splice(index, 1)
        }
        return allValues.filter(v => !impossibleValues.includes(v))
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
    async getCell(pos){
        return Promise.resolve(this.cells.find(value => value.pos.row === pos.row && value.pos.col === pos.col))
    }

    /**
     * Get a specific row from the board
     * @param {Number} num the row to get [1-9]
     * @returns {Array<Cell>} the requested row
     */
    async getRow(num){
        return Promise.resolve(this.cells.filter(value => value.pos.row === num))
    }

    /**
     * Get a specific column from the board
     * @param {Number} num the column to get [1-9]
     * @returns {Array<Cell>} the requested column
     */
    async getColumn(num){
        return Promise.resolve(this.cells.filter(value => value.pos.col === num))
    }

    /**
     * Get a specific box from the board
     * @param {Number} num the box to get [1-9]
     * @returns {Array<Cell>} the requested box
     */
    async getBox(num){
        return Promise.resolve(this.cells.filter(value => value.box === num))
    }

    async isValid(){
        // we need these functions so that they can be used in the middle for loop
        // we need to use bind in order to provide scope, adding .bind(this) will make sure that when
        // we call functions[i](j), the this. statements in those functions are referring to Board object (local scope),
        // rather than global scope
        const functions = [
            this.getRow.bind(this),
            this.getColumn.bind(this),
            this.getBox.bind(this)
        ]
        // We need to validate 3 things, the rows, columns and boxes
        for (let i = 0; i < 3; i++) {
            // using i we can determine which function we are using based on the functions array
            // now we need to loop through each row, column, and box
            for (let j = 1; j <= 9; j++) {
                // j represents which row/column/box we are on
                // combined with i, we can now call our functions to get appropriate cells
                const cells = await functions[i](j)
                // cells is an array containing the 9 cells
                // nonZeroValues is used to track the values in cells while iterating
                let nonZeroValues = []
                // now that we have our cells, we need to go through each one individually
                for (let k = 0; k < 9; k++) {
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

    print(){
        for (let i = 1; i <= 9; i++) {
            this.getRow(i).then(row => {
                console.log(row.map(c => c.value))
            })
        }
    }
}

class ToastBuilder{
    static Type = {
        Generic: "Generic",
        Success: "Success",
        Error: "Error"
    }
    /**
     * Creates a toast of a the specified type
    * @param {ToastBuilder.Type} - the type of Toast to build
    * @param {String} message - the message to display in the toast
    * @param {Number} duration - how long the toast should display, in milliseconds
    * @param {Function} callback - function to call when the toast disappears
    * @returns {Toastify} - toast
     */
    constructor(type, message, duration, callback = null){
        let style = {}
        if(type === ToastBuilder.Type.Success){
            style = {
                color: "white",
                background: "#198754" // green
            }
        }
        else if(type === ToastBuilder.Type.Error){
            style = {
                color: "white",
                background: "#DC3545" // red
            }
        }
        else{
            style = {
                color: "black",
                background: "#0dcaf0" // sky blue
            }
        }
        const toast = Toastify({
            text: message,
            duration: duration,
            gravity: "bottom",
            position: "center",
            stopOnFocus: "false",
            style: style,
            callback: callback,
            onClick: function () {
                toast.hideToast();
            },
        })
        return toast
    }
}