// This is the main form that the user inputs their sudoku numbers
let sudokuTable = document.getElementById("sudoku-table");
// The input elements in the table above
const cellNodes = sudokuTable.querySelectorAll(".form-control");
const cells = Array.from(cellNodes)

// Init
// sets the height of the input cells so that they are equal to the width
matchCellHeightToWidth();

// Event Listeners
// listens for a window resize event, and then updates the columns
window.addEventListener('resize', matchCellHeightToWidth);

/**
 * Changes the height of each cell in the input table equal to its width
 */
function matchCellHeightToWidth(e){
    cells.forEach(cell => {
        // set cell height to its width in px
        cell.style.height = Math.floor(sudokuTable.clientWidth / 9) + "px";
    });
}