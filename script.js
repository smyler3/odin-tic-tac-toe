/*
* IIFE Factory representing the gameboard being played on
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

    function wipeBoard() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                board[i][j].setValue(0);
            }
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

    return { getRows, getCols, printBoard, wipeBoard, getBoard };
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
function Player(defaultName, symbol, colour) {
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

    function getColour() {
        return colour;
    }

    return { setName, getName, getSymbol, getColour };
}

/*
 * IIFE factory for the object handling all ticTacToe Logic by syncing game and display function
 */
const ticTacToe = (function() {
    /*
     * IIFE factory for the object handling all display rendering logic
     */
    const displayHandler = (function () {
        const screen = document.querySelector(".start-screen");
        const startBtn = document.getElementById("startBtn");
        const player1Card = document.getElementById("p1-card");
        const player2Card = document.getElementById("p2-card");
        const active = "active-player";
        const winner = "winning-player";
        let cells = undefined;

        // Attempts to make a move on selected cell when clicked
        const checkCell = (e) => {
            ticTacToe.makeMove(e.target);
        }

        // Create the visual board object
        function createGameDisplay() {
            // Removes form fields and replaces them with current name and symbol
            function adjustPlayerCards() {
                for (let i = 0; i < 2; i++) {
                    let card = document.getElementById("p" + (i + 1) + "-card");
                    let title = document.getElementById("p" + (i + 1) + "-title");
                    let field = document.getElementById("p" + (i + 1) + "-field");
                    let newName = (document.getElementById("p" + (i + 1) + "-name")).value;
                    let symbol = document.createElement("div");

                    // Changing name to input if available
                    title.textContent = (newName === "") ? title.textContent : newName;

                    // Removing name field
                    field.remove();

                    // Adding current symbol logo
                    symbol.textContent = (i === 0) ? "O" : "X";
                    symbol.classList.add("player-symbol");
                    card.append(symbol);
                }
            }

            // Creates the game board
            function createBoard() {
                // Creating board
                const board = document.createElement("div");
                board.classList.add("board");

                // Creating cells
                for (let i = 0; i < gameBoard.getRows(); i++) {
                    for (let j = 0; j < gameBoard.getCols(); j++) {
                        let cell = document.createElement("span");
                        cell.classList.add("cell");
                        cell.setAttribute("data-row", i);
                        cell.setAttribute("data-col", j);
                        cell.addEventListener("click", checkCell);
                        board.appendChild(cell);
                    }
                }

                screen.append(board);
                cells = document.querySelectorAll(".cell");
            }

            /*
            * IIFE factory for the restart game button
            */
            const restartButton = (function() {
                const restartBtn = document.createElement("button");

                // Creates a restart button
                function addRestartBtn() {
                    restartBtn.textContent = "Restart";
                    restartBtn.setAttribute("id", "restartBtn");

                    screen.append(restartBtn);
                }

                restartBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    ticTacToe.restartGame();
                });

                return { addRestartBtn };
            })();

            adjustPlayerCards();
            createBoard();
            restartButton.addRestartBtn();
            startBtn.remove();
        }

        // Removes event listeners from all cells
        function freezeBoard() {
            for (let cell of cells) {
                cell.removeEventListener("click", checkCell);
            }
        }

        function wipeBoard() {
            freezeBoard();

            // Clear board and re-add event listeners
            for (let cell of cells) {
                cell.addEventListener("click", checkCell);
                cell.textContent = "";
            }
        }

        // Visually mark the selected cell
        function markCell(cell) {
            cell.textContent = gameHandler.getActivePlayer().getSymbol();
            cell.style.color = gameHandler.getActivePlayer().getColour();
        }

        // Visually display current player
        function displayActivePlayer(firstTurn = false) {
            player1Card.classList.toggle(active);
            // Player 1 always goes first 
            if (!firstTurn) {
                player2Card.classList.toggle(active);
                console.log(player1Card.classList);
                console.log(player2Card.classList);
            }
        }

        // Visually display game outcome
        function displayOutcome(victor = null) {
            // Display winner on victory
            if (victor) {
                if (player1Card.classList.contains(active)) {
                    player1Card.classList.add(winner);
                    return
                }
                player2Card.classList.add(winner);
                return
            }

            // Remove active for draws
            player1Card.classList.remove(active);
            player2Card.classList.remove(active);
        }

        // Removes winner status and restarts player 1 as active player
        function resetPlayerStates() {
            player1Card.classList.add(active);
            player2Card.classList.remove(active);
            player1Card.classList.remove(winner);
            player2Card.classList.remove(winner);
        }

        return { createGameDisplay, freezeBoard, wipeBoard, markCell, displayActivePlayer, displayOutcome, resetPlayerStates };
    })();

    /*
     * IIFE factory for the object handling all game logic
     */
    const gameHandler = (function() {
        const playerOne = Player("Player1", "O", "#333333");
        const playerTwo = Player("Player2", "X", "#d9d9d9")
        let activePlayer = playerOne;
        let moveRow = null;
        let moveCol = null;
    
        // Continually loop through rounds of gameplay until a winner is found
        function takeTurn(row, col) {
            moveRow = row;
            moveCol = col;

            if (checkMoveValid()) {
                // Mark the cell
                gameBoard.getBoard()[moveRow][moveCol].setValue(activePlayer.getSymbol());
                return true;
            }
            return false;
        }
    
        // Print start round message
        function startRoundMessage() {
            console.log("Current Player: " + activePlayer.getName());
            gameBoard.printBoard();
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
    
        // Switch the active player
        function switchActivePlayer() {
            activePlayer = (activePlayer === playerOne) ? playerTwo : playerOne;
        }

        function getActivePlayer() {
            return activePlayer;
        }

        return { startRoundMessage, takeTurn, checkWinner, checkDraw, endGameMessage, switchActivePlayer, getActivePlayer }
    })(); 

    // Handle all logic for starting the game
    function startGame() {
        gameHandler.startRoundMessage();
        displayHandler.displayActivePlayer(true);
        displayHandler.createGameDisplay();
    }

    // Handle all logic for when the player selects a cell
    function makeMove(cell) {
        if (gameHandler.takeTurn(cell.getAttribute("data-row"), cell.getAttribute("data-col"))) {
            displayHandler.markCell(cell);
            // End the game and display the winner
            if (gameHandler.checkWinner()) {
                gameHandler.endGameMessage(gameHandler.getActivePlayer());
                displayHandler.freezeBoard();
                displayHandler.displayOutcome(gameHandler.getActivePlayer());
            }
            // End the game and display a draw
            else if (gameHandler.checkDraw()) {
                gameHandler.endGameMessage();
                displayHandler.freezeBoard();
                displayHandler.displayOutcome();
            }
            else {
                // Play another round
                endRound();
            }
        }
    }

    // Handle all logic for ending current round
    function endRound() {
        gameHandler.switchActivePlayer();
        gameHandler.startRoundMessage();
        displayHandler.displayActivePlayer();
    }

    // Handle all logic for resetting the board
    function restartGame() {
        gameBoard.wipeBoard();
        displayHandler.wipeBoard();

        displayHandler.resetPlayerStates();
    }

    return { startGame, makeMove, restartGame }
})(); 

/*
 * IIFE factory for the start game button
 */
const startButton = (function() {
    const startBtn = document.querySelector("#startBtn");
    startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        ticTacToe.startGame();
    });
})();