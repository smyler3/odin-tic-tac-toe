/*
* Represents the gameboard being played on
*/
const gameBoard = (function() {
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
        let boardString = "";
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                boardString += (board[i][j].getValue() + " ");
            }
            boardString += "\n"
        }
        console.log(boardString);
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
})();

/*
 * Represents the individual tiles of the gameboard the players interact with
 */
function Cell() {
    let value = 0;

    function setValue(symbol) {
        value = symbol;
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

function startGame() {
    const displayHandler = (function () {
        function createDisplay() {
            const container = document.querySelector(".container");

            const board = document.createElement("div");
            board.classList.add("board");

            for (let i = 0; i < gameBoard.getRows() * gameBoard.getCols(); i++) {
                let cell = document.createElement("span");
                cell.classList.add("cell");
                cell.addEventListener("click", () => {
                    cell.textContent = gameHandler.activePlayer.getSymbol;
                });
                board.appendChild(cell);
            }
            
            container.prepend(board);
        }

        return { createDisplay };
    })();

    /*
     * IIDE game logic handler
     */
    const gameHandler = (function() {
        const playerOne = Player("Player1", 1);
        const playerTwo = Player("Player2", 2);
        let activePlayer = playerOne;
        let moveRow = null;
        let moveCol = null;

        displayHandler.createDisplay();
    
        // Continually loop through rounds of gameplay until a winner is found
        while (true) {
            startRoundMessage();
            takeTurn();
            if (checkEnd()) {
                // End the game
                break;
            }
            else {
                // Play another round
                switchActivePlayer();
            }
        }
    
        // Print start round message
        function startRoundMessage() {
            console.log("Current Player: " + activePlayer.getName());
            gameBoard.printBoard();
        }
    
        // Accept player input, validate, and play that move
        function takeTurn() {
            while (true) {
                // Wait for input
                let move = prompt("Please enter your move co-ords (x y): ");
                // Extract the move information
                [moveRow, moveCol] = move.split(" ").map(Number);
    
                if (checkMoveValid()) {
                    // Mark the cell
                    gameBoard.getBoard()[moveRow][moveCol].setValue(activePlayer.getSymbol());
                    break;
                }
                else {
                    // Request input again
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
    
        // Checks if the game has ended
        function checkEnd() {
            // Winner Found
            if (checkWinner()) {
                endGameMessage(activePlayer);
                return true;
            }
            // Draw Found
            else if (checkDraw()) {
                endGameMessage();
                return true;
            }
            // Game Continues
            else {
                return false;
            }
    
            // Check for a win
            function checkWinner() {
                // Winner Logic
                let winner = null;
                // Check rows
                for (let i = 0; i < gameBoard.getRows(); i++) {
                    winner = true;
                    for (let j = 0; j < gameBoard.getCols(); j++) {
                        if (gameBoard.getBoard()[i][j].getValue() !== activePlayer.getSymbol()) {
                            winner = false;
                            break;
                        }
                    }
                    if (winner) {
                        return true;
                    }
                }
    
                // Check columns
                for (let j = 0; j < gameBoard.getCols(); j++) {
                    winner = true;
                    for (let i = 0; i < gameBoard.getRows(); i++) {
                        if (gameBoard.getBoard()[i][j].getValue() !== activePlayer.getSymbol()) {
                            winner = false;
                            break;
                        }
                    }
                    if (winner) {
                        return true;
                    }
                }
    
                // Check diagonals
                if (gameBoard.getBoard()[1][1].getValue() !== activePlayer.getSymbol()) {
                    winner = false;
                }
                else if (gameBoard.getBoard()[0][0].getValue() === activePlayer.getSymbol() && gameBoard.getBoard()[2][2].getValue() === activePlayer.getSymbol()) {
                    return true;
                }
                else if (gameBoard.getBoard()[0][2].getValue() === activePlayer.getSymbol() && gameBoard.getBoard()[2][0].getValue() === activePlayer.getSymbol()) {
                    return true;
                }
    
                return winner;
            }
    
            // Checks for a draw
            function checkDraw() {
                // If every cell is non-zero and there are no wins, we have a draw
                for (let i = 0; i < gameBoard.getRows(); i++) {
                    for (let j = 0; j < gameBoard.getCols(); j++) {
                        if (gameBoard.getBoard()[i][j].getValue()  === 0) {
                            return false;
                        }
                    }
                }
                return true;
            }
    
            // Prints the end of game message
            function endGameMessage(victor = null) {
                console.log("Game Over! Result: " + ((victor === null) ? "Draw" : (victor.getName() + " Wins" )));
                console.log(gameBoard.printBoard());
            } 
        }
    
        // Switch the active player
        function switchActivePlayer() {
            activePlayer = (activePlayer === playerOne) ? playerTwo : playerOne;
        }
    })(); 
} 

const startButton = (function() {
    const startBtn = document.querySelector("#startBtn");
    startBtn.addEventListener("click", startGame());
})();