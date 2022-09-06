// This is the main form that the user inputs their sudoku numbers
const sudokuTable = document.getElementById("sudoku-table");
// The input elements in the table above
const cellNodes = sudokuTable.querySelectorAll(".form-control");
const cellInputs = Array.from(cellNodes)
// The get solution buttons
const findOneBtn = document.getElementById("find-one");
const resetBtn = document.getElementById("reset");
// Bootstrap Modal
const solvingModal = new bootstrap.Modal(document.getElementById('solving-modal'), { backdrop: "static", keyboard: false })

// Toasts
let canDisplayInvalidToast = true;
const invalidInputToast = new ToastBuilder(ToastBuilder.Type.Error, "Input must be between 1 and 9", 3000, function(){ canDisplayInvalidToast = true })
const unsolvableBoardToast = new ToastBuilder(ToastBuilder.Type.Error, "Board is unsolvable", 3000)

// Workers
let backtrackWorker = new Worker("backtrack-worker.js")

// Init
// first get all inputs in the board
cellInputs.forEach(inp => inp.addEventListener("input", onCellInput))
// sets the height of the input cells so that they are equal to the width
matchCellHeightToWidth();
// Optional: call the prefill() function to set the board to the worlds hardest sudoku
prefill()

// Event Listeners
// listens for a window resize event, and then updates the columns
window.addEventListener('resize', matchCellHeightToWidth);
// click event listeners
findOneBtn.addEventListener("click", onFindBtnClick)
resetBtn.addEventListener("click", onResetClick)

// Event Handler Functions
/**
 * This function gets called when the user clicks on the reset button.
 * It simply resets the board an empty state, as well as toggling the button state
 */
function onResetClick(){
    // make each cell editable again as well as reset value to empty
    cellInputs.forEach(cell => { 
        cell.disabled = false 
        cell.value = ""
        cell.style.removeProperty("color")
    })
    findOneBtn.disabled = false
    resetBtn.disabled = true
}

/**
 * This function gets called when the user clicks the find solution button.
 * It solves the sudoku board using the naive backtracking algorithm
 */
function onFindBtnClick(e){
    // Set timeout to reduce the flickering of the modal
    const showModal = setTimeout(function(){
        // Show Modal
        solvingModal.show()
    }, 500)
    const start = new Date()
    // disable button
    findOneBtn.disabled = true
    // set board
    let board = new Board(getCells())
    // Time to solve sudoku using worker
    backtrackWorker.postMessage(board)
    backtrackWorker.onmessage = (message) => {
        clearTimeout(showModal)
        solvingModal.hide()
        const data = message.data
        const cells = data.cells.map(c => new Cell(c.box, new Position(c.pos.row, c.pos.col), c.value, c.isProtected))
        board = new Board(cells)
        const end = new Date()
        if(board.isFilled()){
            //Solved
            // declare toast to display time taken
            const timeToast = new ToastBuilder(ToastBuilder.Type.Generic, `Solution found in ${(end.getTime() - start.getTime()) / 100} seconds`, 3000)
            // show toast
            timeToast.showToast()
            // update inputs with board values
            displayBoard(board)
            // disable additional input for sudoku board
            cellInputs.forEach(cell => { cell.disabled = true })
            // enable reset button
            resetBtn.disabled = false
        }
        else{
            //Unsolved
            // first, re-enable the find solution button
            findOneBtn.disabled = false
            // show toast
            unsolvableBoardToast.showToast()
        }
    }
}

/**
 * Handles the input of all the sudoku fields. 
 * NOTE: Only numbers and some special characters are recognized as inputs since the field type is number,
 * meaning that this event will only fire when a recognized input is entered
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
 * Set the board to the worlds hardest sudoku - https://abcnews.go.com/blogs/headlines/2012/06/can-you-solve-the-hardest-ever-sudoku
 */
function prefill(){
    function find(row, col){
        return cellInputs.find(inp => inp.dataset.row == row && inp.dataset.col == col)
    }
    find(1, 1).value = 8
    find(2, 3).value = 3
    find(2, 4).value = 6
    find(3, 2).value = 7
    find(3, 5).value = 9
    find(3, 7).value = 2
    find(4, 2).value = 5
    find(4, 6).value = 7
    find(5, 5).value = 4
    find(5, 6).value = 5
    find(5, 7).value = 7
    find(6, 4).value = 1
    find(6, 8).value = 3
    find(7, 3).value = 1
    find(7, 8).value = 6
    find(7, 9).value = 8
    find(8, 3).value = 8
    find(8, 4).value = 5
    find(8, 8).value = 1
    find(9, 2).value = 9
    find(9, 7).value = 4
}

/**
 * Reads the inputs from the sudoku input table and returns an array of Cells that contain the board data
 */
function getCells(){
    let cells = []
    cellInputs.forEach(inp => {
        // Get values that we need to create a Cell object
        const box = parseInt(inp.parentElement.dataset.box)
        const row = parseInt(inp.dataset.row)
        const col = parseInt(inp.dataset.col)
        const pos = new Position(row, col)

        // these values change based on the input value
        let value, protected
        if(inp.value !== ""){
            // if there is input, parse it
            value = parseInt(inp.value)
            // set protected to true, since we cant change user inputted values
            protected = true
        }
        else{
            // if theres no input, set deault to 0
            value = 0
            // if its empty that means we can enter in values, set protected to false
            protected = false
        }

        // create cell and add it to array
        const cell = new Cell(box, pos, value, protected)
        cells.push(cell)
    })
    // finally return the Cells
    return cells
}

/**
 * Displays the cells inside the board, displaying them in blue
 * @param {Board} board - the sudoku board
 */
function displayBoard(board){
    cellInputs.forEach(input => {
        // get position data from input
        const row = parseInt(input.dataset.row)
        const col = parseInt(input.dataset.col)
        // get cell
        board.getCell(new Position(row, col)).then(cell => {
            // skip over cells that are not protected (inputted from user)
            if(!cell.isProtected){
                input.value = cell.value
                // give blue styling to show it was added by us
                input.style.color = "blue"
            }
        })
    })
}
