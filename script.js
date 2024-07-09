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

    const updateCell = (index, player) => {
        const i = Math.floor((index - 1) / dim);
        const j = index - (i * 3) - 1;
        if ( i< dim && j < dim && board[i][j] === DEFAULT_VALUE) {
            board[i][j] = player;
            return true;
        }
        return false;
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
        const getName = () => name;
        
        let score = 0;
        const win = () => score++;
        const getScore = () => score;
        
        let token;
        const getToken = () => token;
        const setToken = (newToken) => {
            token = newToken;
        }
    
        return { getName, win, getScore, getToken, setToken};
    }

    const switchPlayerTokens = () => {
        if (players[0].getToken === 'X') {
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

    const getPlayersScore = () => {
        return [
            { player: players[0].getName(), score: players[0].getScore()},
            { player: players[1].getName(), score: players[1].getScore()}
        ]
    }

    return {getCurrentPlayer, switchPlayerTurn, getPlayersScore, switchPlayerTokens}
}

const gameController = () => {
    const playerController = createPlayerController('player1', 'player2');
    const gameBoard = createGameBoardController();

    const printGameBoard = (board) => {
        for (const row of board) {
            console.log(...row.map(val => '|' + val + '|'))
        }
    }

    // Recieve Input from current player
    const playGame = () => {
        currentPlayer = playerController.getCurrentPlayer();
        let updateStatus;
        do {
            const index = prompt(`${currentPlayer.getName()} (${currentPlayer.getToken()}) turn (Give index no): `);
            updateStatus = gameBoard.updateCell(index, currentPlayer.getToken());
        }
        while (!updateStatus)
        playerController.switchPlayerTurn();
    }

    return {
        playGame: playGame, 
        createGameBoard: gameBoard.createNewGameBoard,
        getGameBoard: gameBoard.getBoard,
        getGameStatus: gameBoard.gameStatus, 
        getPlayersScore: playerController.getPlayersScore
    };
}

function displayController() {
    const game = gameController();
    game.createGameBoard();

    const updateScreen = () => {
        const gameBoard = document.querySelector('.game-board');

        const board = game.getGameBoard();
        console.log(board);
        for (const cell of board.flat()) {
            const div = document.createElement('div');
            div.classList.add('cell');
            gameBoard.appendChild(div);

            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = cell;
            button.dataset.index = gameBoard.children.length;
            div.appendChild(button)
        }

    }

    updateScreen();

    // Check Game Status
    // let gameStatus = gameBoard.gameStatus();
    // while (gameStatus.status === 0) {
    //     printGameBoard(gameBoard.getBoard());
    //     playerTurn();
    //     gameStatus = gameBoard.gameStatus();
    // }

    // Switch Player Tokens
    // playerController.switchPlayerTokens();
        
    // printGameBoard(gameBoard.getBoard());
    // if (gameStatus.status === -1) {
    //     return "Tie";
    // }
    // else if (gameStatus.status === 1) {
    //     gameStatus.player.win();
    //     return `${gameStatus.player.getName()} wins the game`;
    // }
    
}

displayController();