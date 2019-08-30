import { LitElement, css, svg } from "lit-element";

// Variables to make working with X's and O's cleaner
const X = "X";
const O = "O";

class TicTacToe extends LitElement {

    static get styles() {
        return css`
            :host {
                display: block;
                margin: 0;
                width: 300px;
                height: 300px;
            }
            svg {
                height: inherit;
                width: inherit;
            }
        `;
    }

    // Element properties
    static get properties() {
        return {
            board: { type: Array },          // The board's current state
            currentPlayer: { type: String }, // The current player
            gameOver: { type: Boolean },     // Whether or not the game has ended
            winner: { type: String },        // The winner of the game (null for draws)
            winLine: { type: Object }        // The coordinates for the win line to be drawn between
        };
    }

    constructor() {

        super();

        // Reset the game state
        this.reset();

        // Set an initial value for the winLine (it is still hidden by styles)
        this.winLine = { x1: 0, y1: 0, x2: 0, y2: 0 };

        // Choose a player at random to start the first round
        this.currentPlayer = Math.random() < 0.5 ? X : O;
    }

    // Reset the game
    reset() {
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        this.gameOver = false;
        this.winner = null;
    }

    render() {
        return svg`
            <svg viewbox="-0.5,-0.5,31,31">
                <style>
                    .X, .O {
                        transition: all 250ms linear;
                        stroke-linecap: round;
                    }
                    .X {
                        stroke: var(--x-color, #c00);
                        stroke-dasharray: 10;
                        stroke-dashoffset: 10;
                    }
                    .O {
                        stroke: var(--y-color, #008);
                        stroke-dasharray: 20;
                        stroke-dashoffset: 20;
                    }

                    /* Draw in X and O when given their "has-" classes
                    .has-X .X, .has-O .O {
                        stroke-dashoffset: 0;
                    }
                    .lines {
                        stroke: var(--line-color, #333);
                        stroke-width: 0.5;
                        stroke-linecap: round;
                        animation: drawIn 500ms linear;
                    }

                    /* Draw in lines on page load */
                    @keyframes drawIn {
                        0% {
                            stroke-dasharray: 60;
                            stroke-dashoffset: 60;
                        }
                        100% {
                            stroke-dashoffset: 0;
                        }
                    }

                    /* Draw in win line when given the "shown" class */
                    .win-line {
                        stroke: var(--win-line-color, #797);
                        transition: stroke-dashoffset 500ms linear;
                        stroke-linecap: round;
                        stroke-dasharray: 85;
                        stroke-dashoffset: 85;
                    }
                    .win-line.shown {
                        stroke-dashoffset: 0;
                    }
                </style>

                <!--Shape definitions-->
                <defs>
                    <symbol id="X">
                        <path d="M2.5,2.5 l5,5 m0,-5 l-5,5" />
                    </symbol>
                    <symbol id="O">
                        <circle fill="none" cx="5" cy="5" r="3" />
                    </symbol>
                </defs>

                <!--Cells-->
                ${this.board.map((row, y) => row.map((cell, x) => svg`
                    <g class="${!!cell ? "has-" + cell : ""}" @click=${() => !cell && this.handleClick(x, y)}>
                        <rect fill="rgba(0,0,0,0)" stroke="none" x="${x * 10 + 0.25}" y="${y * 10 + 0.25}" width="10" height="10" />
                        <use xlink:href="#X" x="${x * 10}" y="${y * 10}" class="X" />
                        <use xlink:href="#O" x="${x * 10}" y="${y * 10}" class="O" />
                    </g>
                `))}

                <!--Grid lines-->
                <path class="lines" d="M10,0 l0,30 m10,-30 l0,30 M0,10 l30,0 m-30,10 l30,0" />

                <!--Win line-->
                <path class="win-line${this.winner ? " shown" : ""}" d="M${this.winLine.x1},${this.winLine.y1} L${this.winLine.x2},${this.winLine.y2}" />

                <!--Reset button-->
                ${this.gameOver ? svg`
                    <rect fill="transparent" x="-0.5" y="-0.5" width="31" height="31" @click=${this.reset} />
                ` : ""}

            </svg>
        `;
    }

    // Handle clicks - only called when open spaces are clicked
    handleClick(x, y) {

        // Update cell
        this.board[y][x] = this.currentPlayer;

        // Check for win or draw
        var full = true;
        for (var i = 0; i < 3; i++) {

            // Vertical (|)
            if (!!this.board[0][i] && this.board[0][i] == this.board[1][i] && this.board[1][i] == this.board[2][i]) {
                this.gameOver = true;
                this.winner = this.board[0][i];
                this.winLine = {
                    x1: i * 10 + 5,
                    y1: 0,
                    x2: i * 10 + 5,
                    y2: 30
                };
            }

            // Horizontal (-)
            if (!!this.board[i][0] && this.board[i][0] == this.board[i][1] && this.board[i][1] == this.board[i][2]) {
                this.gameOver = true;
                this.winner = this.board[i][0];
                this.winLine = {
                    x1: 0,
                    y1: i * 10 + 5,
                    x2: 30,
                    y2: i * 10 + 5
                };
            }

            // Check for empty cells
            for (var j = 0; j < 3; j++) {
                if (!this.board[i][j]) {
                    full = false;
                }
            }
        }

        // Diagonal (\)
        if (!!this.board[0][0] && this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2]) {
            this.gameOver = true;
            this.winner = this.board[0][0];
            this.winLine = {
                x1: 0,
                y1: 0,
                x2: 30,
                y2: 30
            };
        }

        // Diagonal (/)
        if (!!this.board[2][0] && this.board[2][0] == this.board[1][1] && this.board[1][1] == this.board[0][2]) {
            this.gameOver = true;
            this.winner = this.board[0][0];
            this.winLine = {
                x1: 30,
                y1: 0,
                x2: 0,
                y2: 30
            };
        }

        // Boerd full -> draw
        if (full) {
            this.gameOver = true;
        }

        // Change turns
        this.currentPlayer = this.currentPlayer == O ? X : O;
    }

}

customElements.define("tic-tac-toe", TicTacToe);