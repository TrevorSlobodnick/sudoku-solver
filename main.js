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
const invalidInputToast = new ToastBuilder(ToastBuilder.Type.Error, "Input must be between 1 and 9", 3000, function(){ canDisplayInvalidToast = true })
const unsolvableBoardToast = new ToastBuilder(ToastBuilder.Type.Error, "Board is unsolvable", 3000, function(){ canDisplayUnsolvableToast = true })

// Init
// first get all inputs in the board
cellInputs.forEach(inp => inp.addEventListener("input", onCellInput))
// sets the height of the input cells so that they are equal to the width
matchCellHeightToWidth();
// Optional: call the prefill() function to set the board to the worlds hardest sudoku
// prefill()

// Event Listeners
// listens for a window resize event, and then updates the columns
window.addEventListener('resize', matchCellHeightToWidth);
// listeners for both of the solution buttons
findOneBtn.addEventListener("click", onFindBtnClick)

// Event Handler Functions
function onFindBtnClick(e){
    console.log("Searching for solution...");
    const start = new Date()
    findOneBtn.disabled = true
    const board = new Board(getCells())
    findSolution(board).then(result => {
        const end = new Date()

        console.log(`Solution found in ${end.getTime() - start.getTime()} seconds`);
        if(result){
            //Solved
            displayBoard(board)
        }
        else{
            //Unsolved
            // first, re-enable the find solution button
            findOneBtn.disabled = false
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
 * Displays the cells inside the board, displaying them in blue and disabling additional input
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
                // disable input so the user cant change it
                input.disabled = true
            }
        })
    })
}