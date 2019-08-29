import { LitElement, css, html, svg } from "lit-element";

const X = "X";
const O = "O";

class TicTacToe extends LitElement {

    static get styles() {
        return css`
            :host {
                display: block;
                width: 300px;
                height: 300px;
            }
            svg {
                height: inherit;
                width: inherit;
            }
        `;
    }

    static get properties() {
        return {
            board: { type: Array },
            currentPlayer: { type: String }
        };
    }

    constructor() {
        super();
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        this.currentPlayer = O;
    }

    render() {
        return html`
            <p>
                ${this.currentPlayer} is up.
            </p>
            <svg viewbox="0.25,0.25,29.5,29.5">
                <style>
                    .X, .O {
                        opacity: 0;
                        transition: opacity 500ms ease;
                    }
                    .has-X .X, .has-O .O {
                        opacity: 1;
                    }
                    .previews-X:hover .X, .previews-O:hover .O {
                        opacity: 0.25;
                    }
                </style>
                <defs>
                    <symbol id="X">
                        <path stroke="#000" d="M2.5,2.5 l5,5 m0,-5 l-5,5" />
                    </symbol>
                    <symbol id="O">
                        <circle stroke="#000" fill="none" cx="5" cy="5" r="3" />
                    </symbol>
                </defs>
                <rect fill="#000" width="30" height="30" />
                <!--Cells-->
                ${this.board.map((row, y) => row.map((cell, x) => svg`
                    <g class="${!cell ? "previews-" + this.currentPlayer : "has-" + cell}" @click=${() => !cell && this.handleClick(x,y)}>
                        <rect fill="#fff" x="${x*10+0.25}" y="${y*10+0.25}" width="9.5" height="9.5" />
                        <use xlink:href="#X" x="${x*10}" y="${y*10}" class="X" />
                        <use xlink:href="#O" x="${x*10}" y="${y*10}" class="O" />
                    </g>
                `))}
            </svg>
        `;
    }

    handleClick(x,y) {
        // Update cell
        this.board[y][x] = this.currentPlayer;
        // Check for win
        var full = true;
        for(var i=0;i<3;i++) {
            // Vertical wins
            if(!!this.board[0][i] && this.board[0][i] == this.board[1][i] && this.board[1][i] == this.board[2][i]) {

            }
            // Horizontal wins
            if(!!this.board[i][0] && this.board[i][0] == this.board[i][1] && this.board[i][1] == this.board[i][2]) {

            }
            for(var j=0;j<3;j++) {
                if(!this.board[i][j]) {
                    full = false;
                }
            }
        }
        if(full) {
            console.log("game over");
        }
        // Change turns
        this.currentPlayer = this.currentPlayer == O ? X : O;
    }

}

customElements.define("tic-tac-toe", TicTacToe);