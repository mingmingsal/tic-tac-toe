"use strict";
function GameUI() {
    const container = document.getElementById("gameInfo");
    const text = container.querySelector("p");
    const setWin = (name) => text.textContent = `${name} wins!`;
    const setFull = () => text.textContent = `Board full!`;
    return { setWin, setFull }
}
function GameContainer() {
    const container = document.getElementById("gameContainer");
    const getContainer = () => container;
    for (let i = 0; i < 9; i++) {
        const tile = document.createElement("button");
        tile.className = "tile";
        const row = Math.floor(i / 3);
        const column = i % 3;

        container.append(tile);
        tile.addEventListener('click', () => game.playRound(row, column));
    }
    function getTile(row, column) {
        const tile = row * 3 + column;
        return container.children[tile];
    }
    function setTile(row, column, symbol) {
        console.log(`${row},${column}`)
        const tile = row * 3 + column;
        console.log(tile);
        container.children[tile].textContent = symbol;
    }
    function disableBoard() {
        Array.from(container.children).forEach(a => {
            a.disabled = true;
        });
    }
    return { getContainer, getTile, setTile, disableBoard };
}
function Gameboard() {
    const board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    const placeTile = (a, b, player) => {
        if (checkTile(a, b)) {
            console.log(`placing ${player.getSymbol()} at ${a, b}`)
            board[a][b] = player.getSymbol();
            gameContainer.setTile(a, b, player.getSymbol());
            printBoard();
            checkWin(player.getSymbol());
            return true;
        }
        else {
            return false;
        }
    }
    const checkTile = (a, b) => {
        return board[a][b] == 0;
    }
    const printBoard = () => {
        console.log(`\n${board[0][0]}${board[0][1]}${board[0][2]}\n
                    ${board[1][0]}${board[1][1]}${board[1][2]}\n
                    ${board[2][0]}${board[2][1]}${board[2][2]}\n
        `)
    }
    const checkWin = (symbol) => {
        let inARow = 0;
        //Loop through the Jagged Array Horizontally. If the symbol is seen three times in a row, return true
        //else, break the loop. If no three in a row, return false
        //Check Horizontal
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] == symbol) {
                    inARow++;
                    if (inARow == 3) {
                        return true;
                    }
                }
                else {
                    inARow = 0;
                    break;
                }
            }
        }
        //Check Vertical
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {

                if (board[j][i] == symbol) {
                    inARow++;
                    if (inARow == 3) {
                        return true;
                    }
                }
                else {
                    inARow = 0;

                    break;
                }
            }
        }
        //Check Diagonal 
        if ((symbol == board[0][0] && symbol == board[1][1] && symbol == board[2][2]) || (symbol == board[0][2] && symbol == board[1][1] && symbol == board[2][0])) {
            return true;
        }
        return false;
    }
    return { placeTile, checkTile, printBoard, checkWin };
}

function Player(name, i) {
    let points = 0;
    let symbol = i;

    const getName = () => name;
    const getPoints = () => points;
    const getSymbol = () => symbol;
    const givePoint = () => points++;
    return { getPoints, givePoint, getSymbol, getName };
}

function PlayGame() {
    let roundCount = 0;
    const player1 = Player("man", "x");
    const player2 = Player("bear", "o");
    let activePlayer = player1;
    const board = Gameboard();
    
    const switchActivePlayer = () => {
        console.log("switching player")
        activePlayer = activePlayer == player2 ? player1 : player2;
    }
    function checkWin() {
        if (board.checkWin(activePlayer.getSymbol())) {
            console.log('player win')
            gameDisplay.setWin(activePlayer.getName())
            gameContainer.disableBoard();
            return true;
        }
        else return false;
    }
    function checkFull() {
        if (roundCount >= 8) {
            gameContainer.disableBoard();
            gameDisplay.setFull();
            return true;
        } else return false;
    }
    function getPlayerStatus() {
        console.log(player1.getSymbol(), player1.getPoints());
    }
    function playRound(row, column) {
        console.log(`Placing ${activePlayer.getName()}'s choice at ${row},${column}`)
        if (placeTile(row, column)) {
            checkFull();
            if (!checkWin() || !checkFull()) {
                roundCount++;
                switchActivePlayer();

            }

        }
        else {
            console.log("spot taken. try again");
        }
    }
    const getRound = () => console.log(roundCount);
    const placeTile = (row, column) => board.placeTile(row, column, activePlayer);
    return { getPlayerStatus, placeTile, playRound, board, getRound}
}
const game = PlayGame();
const gameContainer = GameContainer();
    const gameDisplay = GameUI();