// This is the main form that the user inputs their sudoku numbers
const sudokuTable = document.getElementById("sudoku-table");
// The input elements in the table above
const cellNodes = sudokuTable.querySelectorAll(".form-control");
const cellInputs = Array.from(cellNodes)
// The get solution buttons
const findOneBtn = document.getElementById("find-one");

// Toasts
let canDisplayInvalidToast = true;
let canDisplayUnsolvableToast = true;
const invalidInputToast = errorToast("Input must be between 1 and 9", 3000, function(){ canDisplayInvalidToast = true })
const unsolvableBoardToast = errorToast("Board is unsolvable", 3000, function(){ canDisplayUnsolvableToast = true })

// Init
// sets the height of the input cells so that they are equal to the width
matchCellHeightToWidth();
cellInputs.forEach(inp => inp.addEventListener("input", onCellInput))

// Event Listeners
// listens for a window resize event, and then updates the columns
window.addEventListener('resize', matchCellHeightToWidth);
// listeners for both of the solution buttons
findOneBtn.addEventListener("click", onFindBtnClick)

// Event Handler Functions
function onFindBtnClick(e){
    const board = new Board(getCells())
    findSolution(board).then(result => {
        if(result){
            //Solved
            displayBoard()
        }
        else{
            //Unsolved
            // check value to make sure we can display the toast
            if(canDisplayUnsolvableToast){
                // show the toast
                unsolvableBoardToast.showToast()
                // set value to false so toast cannot be displayed (prevents spamming)
                canDisplayUnsolvableToast = false
            }
        }
    })
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
    // if input is not between 1 and 9...
    if(!regex.test(e.currentTarget.value)){
        // set value equal to previous value...
        e.currentTarget.value = e.currentTarget.value.slice(0, -1)
        // check value to make sure we can display the toast
        if(canDisplayInvalidToast){
            // show the toast
            invalidInputToast.showToast()
            // set value to false so toast cannot be displayed (prevents spamming)
            canDisplayInvalidToast = false
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
    const cell = await board.getCell(pos)
    // there are 9 possible values a cell could be...
    for (let i = 1; i <= 9; i++) {
        // since we cant override user inputted values, we need to check before overriding
        if(!cell.isProtected){
            cell.value = i
        }
        // board.isValid simply checks if the current cell values dont break any rules
        if(await board.isValid()){
            if(await pos.hasNext()){
                const r = await findSolution(board, await pos.next())
                if(r){
                    return Promise.resolve(true)
                }
            }
            else{
                // Board has no more cells
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

function displayBoard(){
    
}

/**
 * Creates a toast with a red background
 * @param {String} message - the message to display in the toast
 * @param {Number} duration - how long the toast should display, in milliseconds
 * @param {Function} callback - function to call when the toast disappears
 * @returns {Toastify} - toast
 */
function errorToast(message, duration, callback = null){
    return Toastify({
        text: message,
        duration: duration,
        gravity: "bottom",
        position: "center",
        stopOnFocus: "false",
        style: {
            background: "#DC3545"
        },
        callback: callback
    })
}