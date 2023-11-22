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

    function getBoard() {
        return board;
    }

    return { printBoard, getBoard };
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

    function getSymbol() {
        return symbol;
    }

    return { name, getSymbol };
}

/*
 * Handles the game logic
 */
function GameHandler() {

}

const gameBoard = Board();
gameBoard.getBoard();
gameBoard.getBoard()[0][0].setValue(Player("Steve", "1"));
gameBoard.printBoard();