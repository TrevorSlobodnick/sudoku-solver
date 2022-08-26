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
    pos;
    value;
    /**
     * @param {Position} pos 
     * @param {Number} value 
     */
    constructor(pos, value){
        this.pos = pos
        this.value = value
    }
}

class Row{
    id;
    cells;
    /**
     * @param {Number} id 
     * @param {Array<Position>} cells 
     */
    constructor(id, cells){
        this.id = id;
        this.cells = cells;
    }
}

class Column{
    id;
    cells;
    /**
     * @param {Number} id 
     * @param {Array<Position>} cells 
     */
    constructor(id, cells){
        this.id = id;
        this.cells = cells;
    }
}

class Box{
    id;
    cells;
    /**
     * @param {Number} id 
     * @param {Array<Position>} cells 
     */
    constructor(id, cells){
        this.id = id;
        this.cells = cells;
    }
}

class Board{
    rows;
    columns;
    boxes;
    cells;
    board;
    /**
     * @param {Array<Cell>} cells 
     */
    constructor(cells){
        this.cells = cells
        this.#createBoard()
        // create rows
        // create columns
        // create boxes
    }

    #createBoard(){
        this.cells.sort((a, b) => {
            if(a.pos.row > b.pos.row){
                return 1
            }
            else if(a.pos.row < b.pos.row){
                return -1
            }
            else{
                // rows are the same...
                if(a.pos.col > b.pos.col){
                    return 1
                }
                else if(a.pos.col < b.pos.col){
                    return -1
                }
                else{
                    return 0
                }
            }
        })
        for (let i = 0; i < 9; i++) {
            const row = new Row(i + 1, this.cells.splice(0, 9))
            console.log(row);
        }
    }
}