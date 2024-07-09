function createGameBoardController() {
    const dim = 3;
    const DEFAULT_VALUE = "-"

    let board = [];
    const createNewGameBoard = () => {
        for (let i = 0; i < dim; i++) {
            board[i] = [];
            for (let j = 0; j < dim; j++) {
                board[i].push(DEFAULT_VALUE);
            }
        }
    }

    const getBoard = () => board;

    const updateCell = (index, token) => {
        const i = Math.floor((index - 1) / dim);
        const j = index - (i * 3) - 1;
        console.log(i, j, index)
        if ( i< dim && j < dim) {
            if (board[i][j] === DEFAULT_VALUE) {
                board[i][j] = token;
                return token;
            }
            else {
                return board[i][j];
            }
        }
    }

    const gameStatus = () => {
        // Check row wise and column wise
        for (let i = 0; i < dim; i++) {
            if (board[i][0] != DEFAULT_VALUE && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
                return {status: 1, player: board[i][0]};
            }
            if (board[0][i] != DEFAULT_VALUE && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
                return {status: 1, player: board[0][i]};
            }
        }

        if (board[0][0] != DEFAULT_VALUE && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
            return {status: 1, player: board[0][0]};
        }

        if (board[0][2] != DEFAULT_VALUE && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
            return {status: 1, player: board[0][2]};
        }

        if(!board.flat().filter((cell) => cell === DEFAULT_VALUE).length) {
            return {status: -1, player: null};
        }

        return {status: 0, player: null};
    }

    return { getBoard, updateCell, gameStatus, createNewGameBoard };
}

function createPlayerController(name1='X', name2='Y') {
    function createPlayer(name) {
        
        let score = 0;
        const win = () => score++;
        
        let token;
        const setToken = (newToken) => {
            token = newToken;
        }

        const getPlayer = () => { 
            return {name, score, token}
         }
    
        return { getPlayer, win, setToken};
    }

    const switchPlayerTokens = () => {
        if (players[0].getPlayer().token === 'X') {
            players[0].setToken('Y');
            players[1].setToken('X');
        }
        else {
            players[0].setToken('X');
            players[1].setToken('Y');
        }
    }

    players = [
        createPlayer(name1),
        createPlayer(name2)
    ];
    switchPlayerTokens();

    let currentPlayer = players[0];
    const getCurrentPlayer = () => currentPlayer;
    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const getPlayers = () => {
        return [ players[0].getPlayer(), players[1].getPlayer() ]
    }

    return {getCurrentPlayer, switchPlayerTurn, getPlayers, switchPlayerTokens}
}

const gameController = (name1, name2) => {
    const playerController = createPlayerController(name1, name2);
    const gameBoard = createGameBoardController();

    // Recieve Input from current player
    const updateBoard = (index) => {
        currentPlayer = playerController.getCurrentPlayer().getPlayer();
        return gameBoard.updateCell(index, currentPlayer.token);
    }

    const updateWinner = () => {
        currentPlayer = playerController.getCurrentPlayer();
        currentPlayer.win();
    }

    return {
        updateBoard: updateBoard, 
        createGameBoard: gameBoard.createNewGameBoard,
        getGameBoard: gameBoard.getBoard,
        getGameStatus: gameBoard.gameStatus, 
        getPlayers: playerController.getPlayers,
        switchPlayerTokens: playerController.switchPlayerTurn,
        updateWinner: updateWinner,
        getCurrentPlayer: playerController.getCurrentPlayer
    };
}

function displayController(name1='player1', name2='player2') {
    const game = gameController(name1, name2);
    game.createGameBoard();

    // Display Score Board
    (function () {
        const scoreBoard = document.querySelector('.score-board table');
        players = game.getPlayers();
        for (const player of players) {
            const row = document.createElement('tr');
            scoreBoard.appendChild(row);

            const name = document.createElement('th');
            name.textContent = `${player.name} (${player.token}): `;
            row.appendChild(name);

            const score = document.createElement('td');
            score.textContent = player.score;
            row.appendChild(score);
        }
    })();
    
    // Display GameBoard
    const gameBoard = document.querySelector('.game-board');
    (function () {
        const board = game.getGameBoard();
        for (const cell of board.flat()) {
            const div = document.createElement('div');
            div.classList.add('cell');
            gameBoard.appendChild(div);

            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = cell;
            button.id = `id-${gameBoard.children.length}`;
            button.dataset.index = gameBoard.children.length;
            div.appendChild(button)
        }
    })();

    const updateDisplay = (id, token) => {
        const button = document.querySelector(`button#${id}`)
        button.textContent = token;
    }

    const updateWinner = (result) => {
        const winnerDiv = document.querySelector('.winner');
        winnerDiv.textContent = result;
    }

    gameBoard.addEventListener('click', (e) => {
        const token = game.updateBoard(e.target.dataset.index);
        updateDisplay(e.target.id, token);

        gameStatus = game.getGameStatus();
        if (gameStatus.status === -1) {
            updateWinner("Tie");
        }
        else if (gameStatus.status === 1) {
            game.updateWinner();
            updateWinner(`${game.getCurrentPlayer().getPlayer().name} wins the game`);
        }

        game.switchPlayerTokens();
    })
}

const startDialog = document.querySelector('dialog.intro');
startDialog.showModal();

document.querySelector('dialog.intro form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    startDialog.close();
    displayController(formData.get('player1'), formData.get('player2'));
})