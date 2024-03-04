enum Player {
    None = '',
    X = 'X',
    O = 'O'
}

class TicTacToe {
    board: Player[];
    currentPlayer: Player;
    winner: Player | null;
    filled: number = 0;

    constructor() {
        this.board = new Array<Player>(9);
        for (let i = 0; i < 9; i++) {
            this.board[i] = Player.None;
        }
        this.currentPlayer = Player.X;
        this.winner = null;
    }

    move(position: number): void {
        if (this.board[position] === Player.None && !this.winner) {
            this.board[position] = this.currentPlayer;
            this.checkWinner();
            this.currentPlayer = this.currentPlayer === Player.X ? Player.O : Player.X;
            this.filled++;
        }
    }

    checkWinner(): void {
        const winPatterns: number[][] = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] !== Player.None && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.winner = this.board[a];
                break;
            }
        }
    }
}

let ticTacToe = new TicTacToe();

function handleClick(position: number): void {
    if (againstComputer && ticTacToe.currentPlayer === Player.O) {
        return;
    }
    ticTacToe.move(position);
    if (againstComputer && ticTacToe.currentPlayer === Player.O && !ticTacToe.winner) {
        computerMove();
    }
    render();
}

function render(): void {
    const boardElement = document.getElementById('board');
    if (!boardElement) return;

    boardElement.innerHTML = '';

    for (let i = 0; i < 9; i += 3) {
        const row = document.createElement('div');
        row.className = 'row';

        for (let j = 0; j < 3; j++) {
            const index = i + j;
            const player = ticTacToe.board[index];

            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = player;
            cell.addEventListener('click', () => handleClick(index));
            row.appendChild(cell);
        }

        boardElement.appendChild(row);
    }

    const statusElement = document.getElementById('status');
    if (!statusElement) return;

    if (ticTacToe.winner) {
        statusElement.textContent = `Победитель: ${ticTacToe.winner}`;
    } else {
        if (ticTacToe.filled != 9)
            statusElement.textContent = `Ход игрока: ${ticTacToe.currentPlayer}`;
        else
            statusElement.textContent = `Ничья`
    }
}

function resetGame(): void {
    ticTacToe = new TicTacToe();
    render();
}

let againstComputer = true;

function handleModeChange(event): void {
    againstComputer = event.target.value === 'player-vs-computer';
    resetGame();
}

function computerMove(): void {
    const availableMoves = ticTacToe.board.reduce((acc, cell, index) => {
        if (cell === Player.None) {
            acc.push(index);
        }
        return acc;
    }, []);

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const position = availableMoves[randomIndex];
    setTimeout(() => {
        ticTacToe.move(position);
        render();
    }, 250);
}

document.querySelectorAll('input[name="mode"]').forEach(input => {
    input.addEventListener('change', handleModeChange);
});

document.getElementById('reset').addEventListener('click', resetGame);

document.addEventListener('DOMContentLoaded', render);
