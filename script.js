const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
const startButton = document.getElementById('start');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const scorePlayer1 = document.getElementById('score-player1');
const scorePlayer2 = document.getElementById('score-player2');
const errorMessage = document.getElementById('error-message');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let player1Score = 0;
let player2Score = 0;
let player1Name = 'Игрок 1';
let player2Name = 'Игрок 2';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleCellClick = (e) => {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;
    clickedCell.classList.add(currentPlayer);

    checkResult();
};

const checkResult = () => {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        message.innerText = `Игрок ${currentPlayer === 'X' ? player1Name : player2Name} выиграл!`;
        gameActive = false;
        updateScore(currentPlayer);
        return;
    }

    let roundDraw = !gameState.includes('');
    if (roundDraw) {
        message.innerText = 'Ничья!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
};

const updateScore = (player) => {
    if (player === 'X') {
        player1Score++;
        scorePlayer1.innerText = `${player1Name}: ${player1Score}`;
    } else {
        player2Score++;
        scorePlayer2.innerText = `${player2Name}: ${player2Score}`;
    }
};

const resetGame = () => {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    message.innerText = '';
    errorMessage.innerText = '';
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('X', 'O');
    });
};

const startGame = () => {
    player1Name = player1Input.value.trim();
    player2Name = player2Input.value.trim();

    if (player1Name === '' || player2Name === '') {
        errorMessage.innerText = 'Пожалуйста, введите имена обоих игроков.';
        return;
    }

    scorePlayer1.innerText = `${player1Name}: ${player1Score}`;
    scorePlayer2.innerText = `${player2Name}: ${player2Score}`;
    gameActive = true;
    message.innerText = '';
    resetGame();
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
startButton.addEventListener('click', startGame);
