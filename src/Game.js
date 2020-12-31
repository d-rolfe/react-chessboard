import { INVALID_MOVE } from 'boardgame.io/core';

export const ChessGame = {
    // board[X][Y]
    // x increases to the right
    // y increases on the way down
    // **White**
    // K = white king
    // Q = white queen
    // R = white rook
    // B = bishop
    // N = knight
    // P = pawn
    // 
    // **black**
    // k = black king
    // q = black queen
    // r = black rook
    // b = bishop
    // n = knight
    // p = pawn

    setup: () => ({ 
        board: [
            ["r", "n", "b", "q", "k", "b", "n", "r"],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ["P", "P", "P", "P", "P", "P", "P", "P"],
            ["R", "N", "B", "Q", "K", "B", "N", "R"],
        ]
    }),

    moves: {
        movePiece: (G, ctx, yStart, xStart, yEnd, xEnd) => {
            // note: start and end coords will always be within the board because they are mapped directly to the DOM
            let attackingPiece = G.board[yStart][xStart];
            let defendingPiece = G.board[yEnd][xEnd];

            if (isValidMove(attackingPiece, defendingPiece, yStart, xStart, yEnd, xEnd)) {
                // update board
                G.board[yStart][xStart] = null
                G.board[yEnd][xEnd] = attackingPiece
            }
            else {
                // disallow move
                console.log("invalid move")
            }
        }
    }
}

// helper functions
var isValidMove = (attackingPiece, defendingPiece, yStart, xStart, yEnd, xEnd) => {
    switch(attackingPiece) {
        case "P":
            if (xStart == xEnd && yStart - 1 == yEnd && defendingPiece == null) {
                return true;  // white pawn moves up 1
            }
            else if ((xStart + 1 == xEnd || xStart - 1 == xEnd) && (yStart - 1 == yEnd) && (defendingPiece != null)) {
                return true // white pawn attacks 
            }
            else {
                return false  // invalid move
            }
        default:
            return false
    }
}