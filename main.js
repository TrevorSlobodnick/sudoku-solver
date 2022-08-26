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
findOneBtn.addEventListener("click", onFindOneBtnClick)

// Event Handler Functions
function onFindOneBtnClick(){
    const board = new Board(getCells())
    console.log(board)
    // findSolution()
}

function onFindAllBtnClick(){
    
}

/**
 * Handles the input of all the sudoku fields. 
 * NOTE: Only numbers and some special characters are recognized as inputs since the field type is number
 * @param {Event} e the event object
 */
function onCellInput(e){
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
 * @param {Boolean} generateAllSolutions - false if the function should return the first solution found, 
 * true if the function should return all of the solutions
 */
async function findSolution(board, generateAllSolutions = false){
    // Loop through board and store any non-empty value in the array
    // This is to preserve the spot of the value to make sure it isnt changed while finding solutions
    let protectedPositions = []
    board.forEach(row => {
        row.forEach(col => {
            if(col){
                protectedPositions.push(new Position(row, col))
            }
        })
    })
    console.log(protectedPositions)
    // for (let i = 0; i < board.length; i++) {
    //     for (let j = 0; j < board[i].length; j++) {
            
    //     }
    // }
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

        let value = inp.value
        let protected = false
        if(inp.value !== ""){
            value = parseInt(inp.value)
            protected = true
        }

        const cell = new Cell(box, pos, value, protected)
        cells.push(cell)
    })
    return cells
}

function checkSolution(board){

}