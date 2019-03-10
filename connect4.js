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

// Global string variables
var blueInstr = "<span>Player One</span>: Pick a column";
var redInstr = "<span>Player Two</span>: Pick a column";

// Game globals
var turn = BLUE;
var board = [];

// Used for the onclick event in each button on the game board
function play(clicked) {
    // Drop a piece in the clicked column
    drop( getColumnList( getColumnIndex(clicked) ));

    // Account for a winning move
    if (testWin()) {
        if (turn === BLUE) {
            var winner = "<span>Player One</span> Wins!";
        } else if (turn === RED) {
            var winner = "<span>Player Two</span> Wins!";
        }
        $("#instr").html(winner);
        $("span").css("color", turn);
        activateRestart();

    // Account for a full board
    } else if (isFull()) {
        $("#instr").text("It's A Draw!");
        activateRestart();

    // Non-winning move & board not full
    } else {
        changeTurns();
    }
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
// No return value
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
// Returns a boolean
function testWin() {
    var rows = testRows();
    var cols = testCols();
    var diags = testDiags();
    return (rows || cols || diags)
}

// Tests rows for a win. If there is a winner, it is the current player.
// Returns a boolean.
function testRows() {
    return (testRowsPlayer(1) || testRowsPlayer(2));
}

// Tests rows for a win by one player
// player - an integer representing which player
//          to test for a win. Can be 1 or 2.
// Returns a boolean
function testRowsPlayer(player) {
    for (r = 0; r < ROWS; r++) {
        var count = 0;
        for (c = 0; c < COLS; c++) {
            // Increment count or start over
            if (board[r][c] === player) {
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
// Returns a boolean
function testCols() {
    return (testColsPlayer(1) || testColsPlayer(2));
}

// Tests columns for a specific player's win
// player - an integer representing a player (1 or 2)
// Returns a boolean
function testColsPlayer(player) {
    for (c = 0; c < COLS; c++) {
        var count = 0;
        for (r = 0; r < ROWS; r++) {
            // Increment count or start over
            if (board[r][c] === player) {
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

// Tests diagonals for a win
// Returns a boolean
function testDiags() {
    return (testBLToTR() || testTLToBR());
}

// Tests bottom left to top right diagonals
// Returns a boolean
function testBLToTR() {
    return (BLTRPlayer(1) || BLTRPlayer(2));
}

// Test top right to bottom left diagonals
// Returns a boolean
function testTLToBR() {
    return (TLBRPlayer(1) || TLBRPlayer(2));
}

// Test bottom left to top right with specific player
// player - int representing a player
// Returns a boolean
function BLTRPlayer(player) {
    // First check rows 4-6
    for (r = 3; r < ROWS; r++) {
        var row = r;
        var col = 0;
        var count = 0;
        while (row >= 0) {
            if (board[row--][col++] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count >= 4) {
                return true;
            }
        }
    }
    // Now check cols 2-4
    for (c = 1; c <= 3; c++) {
        var col = c;
        var row = 5;
        var count = 0;
        while (col < COLS) {
            if (board[row--][col++] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count >= 4) {
                return true;
            }
        }
    }
    // Count never reaches 4
    return false;
}

// Test top left to bottom right with specific player
// player - int representing a player
// Returns a boolean
function TLBRPlayer(player) {
    // Start with rows 1-3
    for (r = 2; r >= 0; r--) {
        var row = r;
        var col = 0;
        var count = 0;
        while (row < ROWS) {
            if (board[row++][col++] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count >= 4) {
                return true;
            }
        }
    }
    // Now check cols 2-4
    for (c = 1; c <= 3; c++) {
        var col = c;
        var row = 0;
        var count = 0;
        while (col < COLS) {
            if (board[row++][col++] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count >= 4) {
                return true;
            }
        }
    }
    // Count never reaches 4
    return false;
}

// Tests if the game board is full
// Returns a boolean
function isFull() {
    for (i = 0; i < ROWS; i++) {
        for (j = 0; j < COLS; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }
    return true;
}

// Resets the game to it's starting point
// No return value
function activateRestart() {
    // Deactivate further play
    $("td").off("click");
    // Display restart button
    $("#restart").removeClass("d-none");
}

// Initializes the game
// No return value
function loadGame() {
    // Set up internal board representation
    initBoard();
    // Set up button event listeners
    $("td").on("click", function() {
        play(this);
    });
}

// Load functionality
loadGame();