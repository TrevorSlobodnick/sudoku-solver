// This is the main form that the user inputs their sudoku numbers
const sudokuTable = document.getElementById("sudoku-table");
// The input elements in the table above
const cellNodes = sudokuTable.querySelectorAll(".form-control");
const cellInputs = Array.from(cellNodes)
// The get solution buttons
const findOneBtn = document.getElementById("find-one");
const findAllBtn = document.getElementById("find-all");

// Toasts
let canDisplayInvalidInputToast = true;
const invalidInputToast = Toastify({
    text: "Invalid Input\nPlease enter a number between 1 and 9",
    duration: 3000,
    gravity: "bottom",
    position: "center",
    stopOnFocus: "false",
    style: {
        background: "#DC3545"
    },
    callback: function(){
        // fires when toast is dismissed
        canDisplayInvalidInputToast = true
    }
})

// Init
// sets the height of the input cells so that they are equal to the width
matchCellHeightToWidth();
cellInputs.forEach(inp => inp.addEventListener("input", onCellInput))

// Event Listeners
// listens for a window resize event, and then updates the columns
window.addEventListener('resize', matchCellHeightToWidth);
// listeners for both of the solution buttons
findOneBtn.addEventListener("click", onFindBtnClick)
findAllBtn.addEventListener("click", onFindBtnClick)

// Event Handler Functions
function onFindBtnClick(e){
    const board = new Board(getCells())
    if(e.currentTarget == findOneBtn){
        if(findSolution)
        findSolution(board).then(result => {
            if(result){
                console.log("Solved")
            }
            else{
                console.log("Cannot Solve")
            }
            board.print()
        })
    }
    else{
        //TODO: implement finding all solutions
    }
}

/**
 * Handles the input of all the sudoku fields. 
 * NOTE: Only numbers and some special characters are recognized as inputs since the field type is number
 * @param {Event} e the event object
 */
function onCellInput(e){
    // if the user enters a backspace, there is no need to apply any additional logic, so simply exit function
    if(e.inputType === "deleteContentBackward"){
        return
    }
    const regex = /^[1-9]$/
    if(!regex.test(e.currentTarget.value)){
        e.currentTarget.value = e.currentTarget.value.slice(0, -1)
        if(canDisplayInvalidInputToast){
            invalidInputToast.showToast()
            canDisplayInvalidInputToast = false
        }
    }
}

// Functions
/**
 * Changes the height of each cell in the input table equal to its width
 */
function matchCellHeightToWidth(e){
    cellInputs.forEach(cell => {
        // set cell height to its width in px
        cell.style.height = Math.floor(sudokuTable.clientWidth / 9) + "px";
    });
}

/**
 * Find a single solution or every solution for a given sudoku board
 * @param {Array<Cell>} board - An array of all the Cells on the board
 * @param {Position} pos - the current position
 */
async function findSolution(board, pos = new Position(1, 1)){
    // if the board is not solved, we need to start plugging in numbers
    const cell = board.getCell(pos)
    // there are 9 possible values a cell could be...
    for (let i = 1; i <= 9; i++) {
        // since we cant override user inputted values, we need to check before overriding
        if(!cell.isProtected){
            cell.value = i
        }
        // board.isValid simply checks if the current cell values dont break any rules
        if(board.isValid()){
            if(pos.hasNext()){
                const r = await findSolution(board, pos.next())
                if(r){
                    return Promise.resolve(true)
                }
            }
            else{
                // Board has no more cells
                console.log("Board has no more cells");
                return Promise.resolve(true)
            }
        }
        if(!cell.isProtected){
            cell.value = 0
        }
    }
    return Promise.resolve(false)
}

/**
 * Reads the inputs from the sudoku input table and returns an array of Cells that contain the board data
 */
function getCells(){
    let cells = []
    cellInputs.forEach(inp => {
        const box = parseInt(inp.parentElement.dataset.box)

        const row = parseInt(inp.dataset.row)
        const col = parseInt(inp.dataset.col)
        const pos = new Position(row, col)

        let value, protected
        if(inp.value !== ""){
            value = parseInt(inp.value)
            protected = true
        }
        else{
            value = 0
            protected = false
        }

        const cell = new Cell(box, pos, value, protected)
        cells.push(cell)
    })
    return cells
}