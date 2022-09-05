importScripts("classes.js")

/**
 * Find a single solution or every solution for a given sudoku board
 * @param {Array<Cell>} board - An array of all the Cells on the board
 * @param {Position} pos - the current position
 */
async function findSolution(board, pos = new Position(1, 1)){
    // if the board is not solved, we need to start plugging in numbers
    const cell = await board.getCell(pos)
    // there are 9 possible values a cell could be...
    // const possibleValues = await cell.getPossibleValues(board)
    for (let i = 1; i <= 9; i++) {
        // since we cant override user inputted values, we need to check before overriding
        if(!cell.isProtected){
            // set cell value equal to i
            cell.value = i
        }
        // board.isValid simply checks if the current cell values dont break any rules
        if(await board.isValid()){
            if(await pos.hasNext()){
                // wait for the result...
                const result = await findSolution(board, await pos.next())
                if(result){
                    // if its true, return;
                    return Promise.resolve(true)
                }
            }
            else{
                // Board has no more cells
                return Promise.resolve(true)
            }
        }
        // since we cant override user inputted values, we need to check before overriding
        if(!cell.isProtected){
            // set to initial value
            cell.value = 0
        }
    }
    return Promise.resolve(false)
}

self.addEventListener("message", function (e){
    const obj = e.data // board
    const cells = obj.cells.map(c => new Cell(c.box, new Position(c.pos.row, c.pos.col), c.value, c.isProtected))
    const board = new Board(cells)
    findSolution(board)
    .then(r => {
        postMessage(board)
    })
    .catch(e => {
        postMessage(e)
    })
})