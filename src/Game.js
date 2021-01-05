import { INVALID_MOVE } from 'boardgame.io/core';
import { 
    whitePawn,
    whiteRook,
    whiteKnight,
    whiteBishop,
    whiteQueen,
    whiteKing,
    blackPawn,
    blackRook,
    blackKnight,
    blackBishop,
    blackQueen,
    blackKing,
 } from './ChessPiece';

export const ChessGame = {
    // board[X][Y]
    // x increases to the right
    // y increases on the way down

    setup: () => ({ 
        board: [
            [blackRook, blackKnight, blackBishop, blackQueen, blackKing, blackBishop, blackKnight, blackRook],
            [blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn],
            [whiteRook, whiteKnight, whiteBishop, whiteQueen, whiteKing, whiteBishop, whiteKnight, whiteRook],
        ],
        selectedPiece: null,
    }),

    endIf: (G, ctx) => {
        if (IsVictory(G.board)) {
            return { winner: ctx.currentPlayer };
        }
    },

    moves: {
        selectPieceToMove: (G, ctx, y, x) => {
            if (y === undefined || x === undefined) {
                return INVALID_MOVE;
            }
            G.selectedPiece = { row: y, col: x }
        },
        movePiece: (G, ctx, yEnd, xEnd) => {
            // note: start and end coords will always be within the board because they are mapped directly to the DOM
            if (yEnd === undefined || xEnd === undefined) {
                return INVALID_MOVE;
            }
            if (G.selectedPiece === null) {
                return INVALID_MOVE;
            }
            let yStart = G.selectedPiece.row;
            let xStart = G.selectedPiece.col;
            let attackingPiece = G.board[yStart][xStart];
            let defendingPiece = G.board[yEnd][xEnd];

            if (isValidMove(ctx.currentPlayer, G.board, attackingPiece, defendingPiece, yStart, xStart, yEnd, xEnd)) {
                // update board
                G.board[yStart][xStart] = null;
                G.board[yEnd][xEnd] = attackingPiece;
                G.selectedPiece = null;
                ctx.events.endTurn();
            }
            else {
                // disallow move
                G.selectedPiece = null;
                return INVALID_MOVE;
            }
        }
    }
}

// helper functions
var isValidMove = (currentPlayer, board, attackingPiece, defendingPiece, yStart, xStart, yEnd, xEnd) => {
    // White moves first, so white = player 0, black = player 1
    // ensure only can move players own pieces
    if ( (currentPlayer === "0" ) && ( attackingPiece !== null && attackingPiece.team === "black" ) ) {
        console.log("can't move other players pieces!!");
        return false;
    }
    if ( (currentPlayer === "1" ) && ( attackingPiece !== null && attackingPiece.team === "white" ) ) {
        console.log("can't move other players pieces!!");
        return false;
    }
    // ensure only can attack other players pieces
    if ( (currentPlayer === "0" ) && ( defendingPiece !== null && defendingPiece.team === "white" ) ) {
        console.log("can't friendly fire");
        return false;
    }
    if ( (currentPlayer === "1" ) && ( defendingPiece !== null && defendingPiece.team === "black" ) ) {
        console.log("can't friendly fire");
        return false;
    }
    if (attackingPiece === null) {
        console.log("attacking piece is null!!!")
        return false;
    }

    switch(attackingPiece.type) {
        case "pawn":
            if (attackingPiece.team === "white") {
                if (xStart === xEnd && yStart - 1 === yEnd && defendingPiece === null) {
                    return true;  // white pawn moves up 1
                }
                else if ( (xStart === xEnd ) && ( yStart - 2 === yEnd ) && ( defendingPiece === null ) && ( yStart === 6) ) {
                    return true;  // white pawn moves up 2
                }
                else if ((xStart + 1 === xEnd || xStart - 1 === xEnd) && (yStart - 1 === yEnd) && (defendingPiece !== null)) {
                    return true; // white pawn attacks 
                }
                else {
                    console.log("Pawn attempts invalid move");
                    return false;  // invalid move
                }
            }
            else if (attackingPiece.team === "black") {
                if ( (xStart === xEnd ) && ( yStart + 1 === yEnd ) && ( defendingPiece === null )) {
                    return true;  // black pawn moves down 1
                }
                else if ( (xStart === xEnd ) && ( yStart + 2 === yEnd ) && ( defendingPiece === null ) && ( yStart === 1) ) {
                    return true;  // black pawn moves down 2
                }
                else if ((xStart + 1 === xEnd || xStart - 1 === xEnd) && (yStart + 1 === yEnd) && (defendingPiece !== null)) {
                    return true; // black pawn attacks 
                }
                else {
                    console.log("Pawn attempts invalid move");
                    return false;  // invalid move
                }
            }
            else {
                console.log("Should never reach here");
                return false;  // should never reach here
            }
        case "rook":
            if ( (yStart === yEnd) && (xStart !== xEnd) && (pathIsClearAlongRow(board, yStart, xStart, xEnd)) ) {
                return true; // horizontal movement
            }
            else if ( (xStart === xEnd) && (yStart !== yEnd) && (pathIsClearAlongColumn(board, xStart, yStart, yEnd)) ) {
                return true; // vertical movement
            }
            else {
                return false;
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
            console.log("Default case chosen");
            return false
    }
}

var pathIsClearAlongRow = (board, rowNum, xStart, xEnd) => {
    if (xStart < xEnd) {  // moving right
        for (let i = xStart + 1; i < xEnd; i++) {
            let square = board[rowNum][i]
            if (square !== null) {
                return false
            }
        }
    }
    else {  // moving left
        for (let i = xStart - 1; i > xEnd; i--) {
            let square = board[rowNum][i]
            if (square !== null) {
                return false
            }
        }
    }
    
    return true;
}

var pathIsClearAlongColumn = (board, colNum, yStart, yEnd) => {
    if (yStart < yEnd) {  // moving down
        for (let i = yStart + 1; i < yEnd; i++) {
            let square = board[i][colNum]
            if (square !== null) {
                return false
            }
        }
    }
    else {  // moving up
        for (let i = yStart - 1; i > yEnd; i--) {
            let square = board[i][colNum]
            if (square !== null) {
                return false
            }
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
            if (board[i][j] !== null && board[i][j].type === "king" && board[i][j].team === "white") {
                seenWhiteKing = true;
            }
            if (board[i][j] !== null && board[i][j].type === "king" && board[i][j].team === "black") {
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