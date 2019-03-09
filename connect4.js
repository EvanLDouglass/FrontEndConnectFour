/* 
 *  Author: Evan Douglass
 *  Created: March 07 2019
 *  A simple tic-tac-toe game built with front-end web technologies.
 */

// Constants
const ROWS = 6;
const COLS = 7;
const BLUE = "rgb(92, 92, 255)";
const RED = "rgb(255, 92, 92)";

// Global instruction variables
var blueInstr = "<span>Player One</span>: Pick a column to place your blue tile.";
var redInstr = "<span>Player Two</span>: Pick a column to place your red tile.";

// Game globals
var turn = BLUE;
var board = [];

// Used for the onclick event in each button on the game board
function play(clicked) {
    var tdIndex = getColumnIndex(clicked);
    var btnList = getColumnList(tdIndex);
    drop(btnList);

    if (testRows()) {
        console.log("winner!");
    }
    changeTurns();
}

// Produces an empty game board representation
function initBoard() {
    for (i = 0; i < ROWS; i++) {
        cols = [];
        for (j = 0; j < COLS; j++) {
            cols.push(0);
        }
        board.push(cols);
    }
}

// Determines which column a button is in
// td - a table cell node
// Returns an integer
function getColumnIndex(td) {
    return $(td).index();
}

// Returns a jQuery object containing all the buttons
// in a row, given a column index (0:left -> 6:right)
function getColumnList(colIndex) {
    return $("button").filter(i => i % COLS === colIndex);
}

// Drops a piece into the column of a pressed button
// btnList - a jQuery object of buttons in a column
// No return value
function drop(btnList) {
    // Successively checks if the last element in the 
    // given list is full. Placing a piece of the current
    // player's tile in the lowest available position.
    if (btnList.length === 0) {
        // The column is full, do nothing.
        return;
    } else if (! (btnList.last().hasClass("filled")) ) {
        // Add piece to board representation
        var rowIndex = btnList.length - 1;
        // Gets the index of the parent td in it's tr
        var colIndex = btnList.eq(rowIndex).parent().index();
        if (turn === BLUE) {
            board[rowIndex][colIndex] = 1;
        } else {
            board[rowIndex][colIndex] = 2;
        }

        // Change the color of the button in the browser
        changeColor(btnList.last(), turn);
        btnList.last().addClass("filled");
    } else {
        drop(btnList.slice(0, -1));
    }
}

// Changes the bg-color of a given button
// btn - a button DOM node
// color - a string representing a color
// No return value
function changeColor(btn, color) {
    $(btn).css("background-color", color);
}

// Changes turns and all relevant properties
function changeTurns() {
    if (turn === RED) {
        turn = BLUE;
        $("#instr").html(blueInstr);
        $("span").css("color", BLUE);
    } else if (turn === BLUE) {
        turn = RED;
        $("#instr").html(redInstr);
        $("span").css("color", RED);
    }
}

// Tests the board for a win
function testWin() {
    testRows();
    testCols();
    testDiags();
}

// Tests rows for a win. If there is a winner, it is the current
// player.
// Returns a boolean.
function testRows() {
    return (testRowsPlayer(1) || testRowsPlayer(2));
}

// Tests rows for a win by one player
// player - an integer representing which player
//          to test for a win. Can be 1 or 2.
function testRowsPlayer(player) {
    for (i = 0; i < ROWS; i++) {
        var count = 0;
        for (j = 0; j < COLS; j++) {
            // Increment count or start over
            if (board[i][j] === player) {
                count++;
            } else {
                count = 0;
            }

            // If count reaches 4 at any time, declare a winner
            if (count >= 4) {
                return true;
            }
        }
    }
    return false;
}

// Tests columns for a win
function testCols() {

}

// Tests diagonals for a win
function testDiags() {

}


initBoard();

// Set up button event listeners
$("td").click(function(e) {
    play(this);
});