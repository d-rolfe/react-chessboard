export class ChessPiece {
    constructor(type, team, iconCharCode) {
        this.type = type;
        this.team = team;
        this.iconCharCode = iconCharCode;  // hex value of Unicode code point

    }
}

export const whitePawn = new ChessPiece("pawn", "white", "0x2659")
export const whiteRook = new ChessPiece("rook", "white", "0x2656")
export const whiteKnight = new ChessPiece("knight", "white", "0x2658")
export const whiteBishop = new ChessPiece("bishop", "white", "0x2657")
export const whiteQueen = new ChessPiece("queen", "white", "0x2655")
export const whiteKing = new ChessPiece("king", "white", "0x2654")

export const blackPawn = new ChessPiece("pawn", "black", "0x265F")
export const blackRook = new ChessPiece("rook", "black", "0x265C")
export const blackKnight = new ChessPiece("knight", "black", "0x265E")
export const blackBishop = new ChessPiece("bishop", "black", "0x265D")
export const blackQueen = new ChessPiece("queen", "black", "0x265B")
export const blackKing = new ChessPiece("king", "black", "0x265A")






