/*
 * Represents the gameboard being played on
 */
function Board() {
    const rows = 3;
    const cols = 3;
    const board = [];

    // Creating the initial board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i][j] = Cell();
        }
    }

    // Prints the current board state
    function printBoard() {
        for (let i = 0; i < rows; i++) {
            let row = "";
            for (let j = 0; j < cols; j++) {
                row += (board[i][j].getValue() + " ");
            }
            console.log(row);
        }
    }

    function getRows() {
        return rows;
    }

    function getCols() {
        return cols;
    }

    function getBoard() {
        return board;
    }

    return { getRows, getCols, printBoard, getBoard };
}

/*
 * Represents the individual tiles of the gameboard the players interact with
 */
function Cell() {
    let value = 0;

    function setValue(player) {
        value = player.getSymbol();
    }

    function getValue() {
        return value;
    }

    return { setValue, getValue };
}

/*
 * Represents the players of the game
 */
function Player(defaultName, symbol) {
    let name = defaultName;

    function setName(newName) {
        name = newName;
    }

    function getName() {
        return name;
    }

    function getSymbol() {
        return symbol;
    }

    return { setName, getName, getSymbol };
}

/*
 * Handles the game logic
 */
function GameHandler() {
    const playerOne = Player("Player1", "1");
    const playerTwo = Player("Player2", "2");
    const gameBoard = Board();
    let activePlayer = playerOne;
    let moveRow = null;
    let moveCol = null;

    playRound();

    // gameBoard.getBoard();
    // gameBoard.getBoard()[0][0].setValue(playerOne);
    // gameBoard.printBoard();

    function playRound() {
        startRoundMessage();
        takeTurn();

        // Print start round message
        function startRoundMessage() {
            console.log("Current Player: " + activePlayer.name);
            gameBoard.printBoard();
        }

        function takeTurn() {
            while (true) {
                // Wait for input
                let move = prompt("Please enter your move co-ords (x y): ");
                // Extract the move information
                [moveRow, moveCol] = move.split(" ").map(Number);

                // Check move validity
                let valid = checkMoveValid();
                // Mark the cell
                if (valid) {
                    gameBoard.getBoard()[moveRow][moveCol].setValue(activePlayer.getSymbol);
                    break;
                }
                // Request input again
                else {
                    console.log("Invalid Input!");
                    continue;
                }
            }

            // Check if the move is valid
            function checkMoveValid() {
                // Input is valid
                if ((moveRow > -1) && (moveRow < gameBoard.getRows()) && (moveCol > -1) && (moveCol < gameBoard.getCols())) {
                    // Cell is free
                    if (gameBoard.getBoard()[moveRow][moveCol].getValue() === 0) {
                        return true;
                    }
                }
                return false;
            }
        }

        // Check for a win
        function checkWinner() {
            // Winner Logic
        }
        // - If win: print victory and end
        // - If draw: print draw and end
        function endGameMessage(victor = null) {
            console.log("Game Over! Result: " (victor === null) ? "Draw" : victor.getName);
        } 
        // - If no win: switch the player
        function switchActivePlayer() {
            activePlayer = (activePlayer === playerOne) ? playerTwo : playerOne;
        }
    }
}

const ticTacToe = GameHandler();