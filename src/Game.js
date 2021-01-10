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
        whiteKingPosition: [7, 4],
        blackKingPosition: [0, 4],
        selectedPiece: null,
        isCheck: {
            whiteKingIsInCheck: false,
            blackKingIsInCheck: false,
        },
        isCheckMate: null,
    }),

    endIf: (G, ctx) => {

        if (G.isCheckMate === true) {
            return { winner: ctx.currentPlayer }
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
            let validMove = isValidMove(ctx.currentPlayer, G.board, attackingPiece, defendingPiece, yStart, xStart, yEnd, xEnd);

            // put lines 68 to 95 inside if below

            if (validMove) {
                // need to construct board state IF move was performed
                let futureBoard = []
                for (let i = 0; i < G.board.length; i++) {
                    futureBoard[i] = G.board[i].slice();
                }
                futureBoard[yStart][xStart] = null;
                futureBoard[yEnd][xEnd] = attackingPiece;
                let checkState = computeCheck(futureBoard);
                console.log('checkstate: ');
                console.log(checkState);
    
                if (ctx.currentPlayer === "0" && checkState.whiteKingIsInCheck === true) {
                    // white put themself in check
                    console.log('invalid move: white attempted to put themself in check')
                    return INVALID_MOVE;
                }
                else if (ctx.currentPlayer === "1" && checkState.blackKingIsInCheck === true) {
                    // black put themself in check
                    console.log('invalid move: black attempted to put themself in check')
                    return INVALID_MOVE;
                }
                else {
                    G.isCheck = checkState;
                }

                // update board
                G.board[yStart][xStart] = null;
                G.board[yEnd][xEnd] = attackingPiece;
                G.selectedPiece = null;
                // if king moved, update position in state
                if (attackingPiece.type === "king") {
                    if (ctx.currentPlayer === "0") {
                        G.whiteKingPosition = [yEnd, xEnd];
                    }
                    else {
                        G.blackKingPosition = [yEnd, xEnd];
                    }
                }

                // check for checkmate
                if (G.isCheck.whiteKingIsInCheck === true || G.isCheck.blackKingIsInCheck === true) {
                    G.isCheckMate = computeCheckMate(G);
                }

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

var getPossibleMoves = (piece, y, x, board) => {
    switch(piece.type) {
        case "pawn":
            return generatePossiblePawnMoves(piece, board, y, x);
        case "knight":
            return generatePossibleKnightMoves(y, x);
        case "bishop":
            return generatePossibleBishopMoves(y, x);
        case "rook":
            return generatePossibleRookMoves(y, x);
        case "queen":
            return generatePossibleQueenMoves(y, x);
        case "king":
            return generatePossibleKingMoves(y, x);
        default:
            console.log("Default case chosen");
            return [];
    }
}

var computeCheckMate = (G) => {
    if (G.isCheck.whiteKingIsInCheck === true) {
        // can white make any move to get out of check?
        for (let i = 0; i < G.board; i++) {
            let row = G.board[i];
            for (let j = 0; j < row.length; j++) {
                let piece = row[j];
                if (piece !== null &&  piece.team === "white") {
                    let possibleMoves = getPossibleMoves(piece, i, j, G.board)
                    for (let move of possibleMoves) {
                        console.log('possible move: [' + move[0] + ', ' + move[1]);
                        // create futureBoard with new move
                        if (isValidMove("0", G.board, piece, G.board[move[0]][move[1]], i, j, move[0], move[1])) {
                            let futureBoard = []
                            for (let k = 0; k < G.board.length; k++) {
                                futureBoard[k] = G.board[k].slice();
                            }
                            futureBoard[i][j] = null;
                            futureBoard[move[0]][move[1]] = piece;
    
                            let checkState = computeCheck(futureBoard);
                            if (checkState.whiteKingIsInCheck === false) {
                                return false; // no checkmate in this futureBoard state
                            }
                        }
                    }
                }
            }
        }
        return true;
    }
    else if (G.isCheck.blackKingIsInCheck === true) {
        // can black make any move to get out of check?
        console.log('can black make any move to get out of check?');
        for (let i = 0; i < G.board.length; i++) {
            let row = G.board[i];
            for (let j = 0; j < row.length; j++) {
                let piece = row[j];
                if (piece !== null && piece.team === "black") {
                    let possibleMoves = getPossibleMoves(piece, i, j, G.board)
                    console.log('possible moves:');
                    console.log(possibleMoves);
                    for (let move of possibleMoves) {
                        console.log('possible move: [' + move[0] + ', ' + move[1]);
                        // create futureBoard with new move
                        if (isValidMove("1", G.board, piece, G.board[move[0]][move[1]], i, j, move[0], move[1])) {
                            let futureBoard = []
                            for (let k = 0; k < G.board.length; k++) {
                                futureBoard[k] = G.board[k].slice();
                            }
                            futureBoard[i][j] = null;
                            futureBoard[move[0]][move[1]] = piece;
    
                            let checkState = computeCheck(futureBoard);
                            if (checkState.blackKingIsInCheck === false) {
                                return false; // no checkmate in this futureBoard state
                            }
                        }
                    }
                }
            }
        }
        return true;
    }
}

var computeCheck = (futureBoard) => {
    // returns object with booleans for if either king is in check
    let yWhiteKing, xWhiteKing, yBlackKing, xBlackKing;
    for (let i = 0; i < futureBoard.length; i++) {
        let row = futureBoard[i];
        for (let j = 0; j < row.length; j++) {
            let piece = futureBoard[i][j];
            if (piece !== null && piece.team === "white" && piece.type === "king") {
                yWhiteKing = i;
                xWhiteKing = j;
            }
            if (piece !== null && piece.team === "black" && piece.type === "king") {
                yBlackKing = i;
                xBlackKing = j;
            }
        }
    }
    return {
        whiteKingIsInCheck: isKingInCheck(futureBoard, "black", yWhiteKing, xWhiteKing),
        blackKingIsInCheck: isKingInCheck(futureBoard, "white", yBlackKing, xBlackKing),
    };
}

var isKingInCheck = (board, attackingTeam, yKing, xKing) => {
    let currentPlayer;
    let defendingKing;
    if (attackingTeam === "white") {
        currentPlayer = "0";
        defendingKing = "black";
    }
    else {
        currentPlayer = "1";
        defendingKing = "white";
    }
    for (let i = 0; i < board.length; i++) {
        let row = board[i];
        for (let j = 0; j < row.length; j++) {
            let piece = board[i][j];
            if (piece !== null && piece.team === attackingTeam) {
                let pieceCanAttackKing = isValidMove(currentPlayer, board, piece, board[yKing][xKing], i, j, yKing, xKing);
                if (pieceCanAttackKing) {
                    console.log(defendingKing + ' king is in check from ' + piece.team + ' ' + piece.type);
                    return true;
                }
            }
        }
    }
    return false;
}

// returns true if the attackingPiece is moved correctly, false otherwise
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
                    // console.log("Pawn attempts invalid move");
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
                    // console.log("Pawn attempts invalid move");
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
        case "bishop":
            if ( pathIsValidDiagonal(board, yStart, xStart, yEnd, xEnd) && pathIsClearAlongDiagonal(board, yStart, xStart, yEnd, xEnd) ) {
                return true;
            }
            else {
                return false;
            }
        case "knight":
            let possibleKnightMoves = generatePossibleKnightMoves(yStart, xStart)
            for (let move of possibleKnightMoves) {
                if (yEnd === move[0] && xEnd === move[1]) {
                    return true;
                }
            }
            return false;
        case "queen":
            if (pathIsValidDiagonal(board, yStart, xStart, yEnd, xEnd) && pathIsClearAlongDiagonal(board, yStart, xStart, yEnd, xEnd)) {
                return true;
            }
            else if ( (yStart === yEnd) && (xStart !== xEnd) && (pathIsClearAlongRow(board, yStart, xStart, xEnd)) ) {
                return true; // horizontal movement
            }
            else if ( (xStart === xEnd) && (yStart !== yEnd) && (pathIsClearAlongColumn(board, xStart, yStart, yEnd)) ) {
                return true; // vertical movement
            }
            else {
                return false;
            }
        case "king":
            let possibleKingMoves = generatePossibleKingMoves(yStart, xStart)
            // check if any of these put king in check

            // possibleKingMoves = possibleKingMoves.filter(position => atleastOneEnemyCanAttackPosition(board, position));

            // if (possibleKingMoves.length < 1) {
            //     // checkmate
            // }
            
            for (let move of possibleKingMoves) {
                if (yEnd === move[0] && xEnd === move[1]) {
                    return true;
                }
            }
            return false;
        default:
            console.log("Default case chosen");
            return false
    }
}

var generatePossibleKingMoves = (y, x) => {
    const moves = [
        [y - 1, x - 1],
        [y - 1, x],
        [y - 1, x + 1],
        [y, x - 1],
        [y, x + 1],
        [y + 1, x - 1],
        [y + 1, x],
        [y + 1, x + 1]
    ];

    const result = moves.filter(coord => (coord[0] < 8 && coord[1] < 8 && coord[0] >= 0 && coord[1] >= 0))

    return result;
}

var generatePossiblePawnMoves = (piece, board, y, x) => {
    let moves = [];
    if (piece.team === "white") {
        if (y === "6" && board[y - 2][x] === null) moves.push([y - 2, x]);
        if (board[y - 1][x] === null) moves.push([y - 1, x]);
        if (board[y - 1][x - 1] && board[y - 1][x - 1] !== null && board[y - 1][x - 1].team !== piece.team) moves.push([y - 1, x - 1]);
        if (board[y - 1][x + 1] && board[y - 1][x + 1] !== null && board[y - 1][x + 1].team !== piece.team) moves.push([y - 1, x + 1]);
    }
    else if (piece.team === "black") {
        if (y === "1" && board[y + 2][x] === null) moves.push([y + 2, x]);
        if (board[y + 1][x] === null) moves.push([y + 1, x]);
        if (board[y + 1][x - 1] && board[y + 1][x - 1] !== null && board[y + 1][x - 1].team !== piece.team) moves.push([y + 1, x - 1]);
        if (board[y + 1][x + 1] && board[y + 1][x + 1] !== null && board[y + 1][x + 1].team !== piece.team) moves.push([y + 1, x + 1]);
    }

    return moves.filter(coord => (coord[0] < 8 && coord[1] < 8 && coord[0] >= 0 && coord[1] >= 0))
}

var generatePossibleRookMoves = (y, x) => {
    let moves = [];
    for (let i = 0; i < 8; i++) {
        moves.push([i, x]);
    }
    for (let j = 0; j < 8; j++) {
        moves.push([y, j]);
    }
    return moves.filter(coord => (coord[0] < 8 && coord[1] < 8 && coord[0] >= 0 && coord[1] >= 0))
}

var generatePossibleBishopMoves = (y, x) => {
    let moves = [];

    let i = y; 
    let j = x;
    while (i < 8 && j < 8) { // down-right 
        moves.push([i, j]);
        i++;
        j++;
    }

    i = y;
    j = x;
    while (i >= 0 && j < 8) { // up-right
        moves.push([i, j]);
        i--;
        j++;
    }

    i = y;
    j = x;
    while (i < 8 && j >= 0) { // down-left
        moves.push([i, j]);
        i++;
        j--;
    }

    i = y;
    j = x;
    while (i >= 0 && j >= 0) { // up-left
        moves.push([i, j]);
        i--;
        j--;
    }
    
    return moves.filter(coord => (coord[0] < 8 && coord[1] < 8 && coord[0] >= 0 && coord[1] >= 0))
}

var generatePossibleQueenMoves = (y, x) => {
    return [...generatePossibleRookMoves(y, x), ...generatePossibleBishopMoves(y, x)];
}

var generatePossibleKnightMoves = (y, x) => {
    const moves = [
        [y - 2, x - 1], [y - 2, x + 1],
        [y - 1, x + 2], [y + 1, x + 2],
        [y + 2, x + 1], [y + 2, x - 1],
        [y + 1, x - 2], [y - 1, x - 2]
    ];

    const result = moves.filter(coord => (coord[0] < 8 && coord[1] < 8 && coord[0] >= 0 && coord[1] >= 0))

    return result;
}

var pathIsValidDiagonal = (board, yStart, xStart, yEnd, xEnd) => {
    if (yStart < yEnd && xStart < xEnd) {
        // down-right movement
        let i = yStart; 
        let j = xStart;
        while (i < yEnd && j < xEnd) {
            i++;
            j++;
        }
        if (i === yEnd && j === xEnd) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (yStart < yEnd && xStart > xEnd) {
        // down-left movement
        let i = yStart; 
        let j = xStart;
        while (i < yEnd && j > xEnd) {
            i++;
            j--;
        }
        if (i === yEnd && j === xEnd) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (yStart > yEnd && xStart < xEnd) {
        // up-right movement
        let i = yStart; 
        let j = xStart;
        while (i > yEnd && j < xEnd) {
            i--;
            j++;
        }
        if (i === yEnd && j === xEnd) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (yStart > yEnd && xStart > xEnd) {
        // up-left movement
        let i = yStart; 
        let j = xStart;
        while (i > yEnd && j > xEnd) {
            i--;
            j--;
        }
        if (i === yEnd && j === xEnd) {
            return true;
        }
        else {
            return false;
        }
    }
    return false;
}

// can probably combine this method with pathIsValidDiagonal
var pathIsClearAlongDiagonal = (board, yStart, xStart, yEnd, xEnd) => {
    if (yStart < yEnd && xStart < xEnd) {
        // down-right movement
        let i = yStart + 1; 
        let j = xStart + 1;
        while (i < yEnd && j < xEnd) {
            if (board[i][j] !== null) {
                return false;
            }
            i++;
            j++;
        }
        if (i === yEnd && j === xEnd) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (yStart < yEnd && xStart > xEnd) {
        // down-left movement
        let i = yStart + 1; 
        let j = xStart - 1;
        while (i < yEnd && j > xEnd) {
            if (board[i][j] !== null) {
                return false;
            }
            i++;
            j--;
        }
        if (i === yEnd && j === xEnd) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (yStart > yEnd && xStart < xEnd) {
        // up-right movement
        let i = yStart - 1; 
        let j = xStart + 1;
        while (i > yEnd && j < xEnd) {
            if (board[i][j] !== null) {
                return false;
            }
            i--;
            j++;
        }
        if (i === yEnd && j === xEnd) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (yStart > yEnd && xStart > xEnd) {
        // up-left movement
        let i = yStart - 1; 
        let j = xStart - 1;
        while (i > yEnd && j > xEnd) {
            if (board[i][j] !== null) {
                return false;
            }
            i--;
            j--;
        }
        if (i === yEnd && j === xEnd) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false; // should never reach here
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
// var IsVictory = (board) => {
//     let i, j;
//     let seenWhiteKing = false;
//     let seenBlackKing = false;
//     for (i = 0; i < board.length; i++) {
//         let row = board[i];
//         for (j = 0; j< row.length; j++) {
//             if (board[i][j] !== null && board[i][j].type === "king" && board[i][j].team === "white") {
//                 seenWhiteKing = true;
//             }
//             if (board[i][j] !== null && board[i][j].type === "king" && board[i][j].team === "black") {
//                 seenBlackKing = true;
//             }
//         }
//     }
//     if (seenWhiteKing && seenBlackKing) {
//         return false;
//     }
//     else if (seenWhiteKing && !seenBlackKing) {
//         return true;
//     }
//     else if (!seenWhiteKing && seenBlackKing) {
//         return true;
//     }
// }