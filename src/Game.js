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
        ],
        selectedPiece: null,
    }),

    turn: {
        moveLimit: 1,
    },

    endIf: (G, ctx) => {
        if (IsVictory(G.board)) {
            return { winner: ctx.currentPlayer };
        }
    },

    moves: {
        selectPieceToMove: (G, ctx, y, x) => {
            G.selectedPiece = { row: y, col: x }
        },
        movePiece: (G, ctx, yEnd, xEnd) => {
            // note: start and end coords will always be within the board because they are mapped directly to the DOM
            if (G.selectedPiece == null) {
                return;
            }
            let yStart = G.selectedPiece.row;
            let xStart = G.selectedPiece.col;
            let attackingPiece = G.board[yStart][xStart];
            let defendingPiece = G.board[yEnd][xEnd];

            if (isValidMove(G.board, attackingPiece, defendingPiece, yStart, xStart, yEnd, xEnd)) {
                // update board
                G.board[yStart][xStart] = null;
                G.board[yEnd][xEnd] = attackingPiece;
            }
            else {
                // disallow move
                console.log("invalid move");
                // return INVALID_MOVE;
            }
            G.selectedPiece = null;
        }
    }
}

// helper functions
var isValidMove = (board, attackingPiece, defendingPiece, yStart, xStart, yEnd, xEnd) => {
    switch(attackingPiece) {
        case "P":
            if (xStart == xEnd && yStart - 1 == yEnd && defendingPiece == null) {
                return true;  // white pawn moves up 1
            }
            else if ( (xStart == xEnd ) && ( yStart - 2 == yEnd ) && ( defendingPiece == null ) && ( yStart == 6) ) {
                return true;  // white pawn moves up 2
            }
            else if ((xStart + 1 == xEnd || xStart - 1 == xEnd) && (yStart - 1 == yEnd) && (defendingPiece != null)) {
                return true // white pawn attacks 
            }
            else {
                return false  // invalid move
            }
        case "p":
            if ( (xStart == xEnd ) && ( yStart + 1 == yEnd ) && ( defendingPiece == null )) {
                return true;  // black pawn moves down 1
            }
            else if ( (xStart == xEnd ) && ( yStart + 2 == yEnd ) && ( defendingPiece == null ) && ( yStart == 1) ) {
                return true;  // black pawn moves down 2
            }
            else if ((xStart + 1 == xEnd || xStart - 1 == xEnd) && (yStart + 1 == yEnd) && (defendingPiece != null)) {
                return true // black pawn attacks 
            }
            else {
                return false  // invalid move
            }
        case "R" || "r":
            if ( (yStart == yEnd) && (xStart != xEnd) && (pathIsClearAlongRow(board, yStart, xStart, xEnd)) ) {
                return true
            }
            else if ( (xStart == xEnd) && (yStart != yEnd) && (pathIsClearAlongColumn(board, xStart, yStart, yEnd)) ) {
                return true
            }
            else {
                return false
            }
        // case "B" || "b":
        //     let possibleMoves = []
        //     if ( ( [yEnd, xEnd] in possibleMoves ) && ( pathIsClearAlongDiagonal(board, yStart, xStart, yEnd, xEnd)) ) {
        //         return true
        //     }
        //     else {
        //         return false
        //     }
        default:
            return false
    }
}

var pathIsClearAlongRow = (board, rowNum, xStart, xEnd) => {
    let i;
    for (i = xStart + 1; i < xEnd; i++) {
        let square = board[rowNum][i]
        if (square != null) {
            return false
        }
    }
    return true;
}

var pathIsClearAlongColumn = (board, colNum, yStart, yEnd) => {
    let i;
    for (i = yStart + 1; i < yEnd; i++) {
        let square = board[colNum][i]
        if (square != null) {
            return false
        }
    }
    return true;
}

// TODO: better implementation might be to record pieces held 'hostage' and iterate through that to check if king has been captured.
var IsVictory = (board) => {
    let i, j;
    let seenWhiteKing = false;
    let seenBlackKing = false;
    for (i = 0; i < board.length; i++) {
        let row = board[i];
        for (j = 0; j< row.length; j++) {
            if (board[i][j] == "K") {
                seenWhiteKing = true;
            }
            if (board[i][j] == "k") {
                seenBlackKing = true;
            }
        }
    }
    if (seenWhiteKing && seenBlackKing) {
        return false;
    }
    else if (seenWhiteKing && !seenBlackKing) {
        return true;
    }
    else if (!seenWhiteKing && seenBlackKing) {
        return true;
    }
}