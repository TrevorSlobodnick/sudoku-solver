// This is the main form that the user inputs their sudoku numbers
const sudokuTable = document.getElementById("sudoku-table");
// The input elements in the table above
const cellNodes = sudokuTable.querySelectorAll(".form-control");
const cellInputs = Array.from(cellNodes)
// The get solution buttons
const findOneBtn = document.getElementById("find-one");
const findAllBtn = document.getElementById("find-all");

// Init
// sets the height of the input cells so that they are equal to the width
matchCellHeightToWidth();

// Event Listeners
// listens for a window resize event, and then updates the columns
window.addEventListener('resize', matchCellHeightToWidth);

// Event Handler Functions
function onFindOneBtnClick(){
    const board = new Board(getCells())
    // findSolution()
}

function onFindAllBtnClick(){
    
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
 * @param {Array<Array<Number>} board - An array representing the sudoku board state 
 * (an array containing 9 arrays, where each inner arrary contains 9 numbers, ranging form 1-9)
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
 * Reads the inputs from the sudoku input table and returns an array of that data
 */
function getCells(){
    let board = []
    cellInputs.forEach(inp => {
        const row = parseInt(inp.dataset.row)
        const col = parseInt(inp.dataset.col)
        const pos = new Position(row, col)
        const cell = new Cell(pos, inp.value)
    })
}

function checkSolution(board){

}

function isCellProtected(cell1, cell2){

}