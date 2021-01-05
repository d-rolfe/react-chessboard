// import { render, screen } from '@testing-library/react';
// import App from './App';
import { Client } from 'boardgame.io/client';
import { ChessGame } from './Game';
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


// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

it('test White pawn moves up 1 space', () => {
  const MyChessGame = { 
    ...ChessGame,
    // if you want to override default setup, do it here
  };
  const client = Client({ game: MyChessGame }); 
  
  client.moves.selectPieceToMove(6, 0)
  client.moves.movePiece(5, 0);

  const {G, ctx} = client.store.getState();

  expect(G.board).toEqual([
    [blackRook, blackKnight, blackBishop, blackQueen, blackKing, blackBishop, blackKnight, blackRook],
    [blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [whitePawn, null, null, null, null, null, null, null],
    [null, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn],
    [whiteRook, whiteKnight, whiteBishop, whiteQueen, whiteKing, whiteBishop, whiteKnight, whiteRook],
  ]);
});

it('test White pawn attacks', () => {
  const MyChessGame = { 
    ...ChessGame,
    // if you want to override default setup, do it here
    setup: () => ({ 
      board: [
            [blackRook, blackKnight, blackBishop, blackQueen, blackKing, blackBishop, blackKnight, blackRook],
            [blackPawn, null, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn],
            [null, null, null, null, null, null, null, null],
            [null, blackPawn, null, null, null, null, null, null],
            [whitePawn, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn],
            [whiteRook, whiteKnight, whiteBishop, whiteQueen, whiteKing, whiteBishop, whiteKnight, whiteRook],
        ]
    }),
  };
  const client = Client({ game: MyChessGame }); 
  
  client.moves.selectPieceToMove(4, 0)
  client.moves.movePiece(3, 1);

  const {G, ctx} = client.store.getState();

  expect(G.board).toEqual([
    [blackRook, blackKnight, blackBishop, blackQueen, blackKing, blackBishop, blackKnight, blackRook],
    [blackPawn, null, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn],
    [null, null, null, null, null, null, null, null],
    [null, whitePawn, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn],
    [whiteRook, whiteKnight, whiteBishop, whiteQueen, whiteKing, whiteBishop, whiteKnight, whiteRook],
  ]);
});

it('test White rook moves horizontally', () => {
  const MyChessGame = { 
    ...ChessGame,
    // if you want to override default setup, do it here
    setup: () => ({ 
      board: [
            [blackRook, blackKnight, blackBishop, blackQueen, blackKing, blackBishop, blackKnight, blackRook],
            [blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [whitePawn, null, null, null, null, null, null, null],
            [whiteRook, null, null, null, null, null, null, null],
            [null, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn],
            [null, whiteKnight, whiteBishop, whiteQueen, whiteKing, whiteBishop, whiteKnight, whiteRook],
        ]
    }),
  };
  const client = Client({ game: MyChessGame }); 
  
  client.moves.selectPieceToMove(5, 0)
  client.moves.movePiece(5, 6);

  const {G, ctx} = client.store.getState();

  expect(G.board).toEqual([
    [blackRook, blackKnight, blackBishop, blackQueen, blackKing, blackBishop, blackKnight, blackRook],
    [blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [whitePawn, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, whiteRook, null],
    [null, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn],
    [null, whiteKnight, whiteBishop, whiteQueen, whiteKing, whiteBishop, whiteKnight, whiteRook],
  ]);
});

it('test White rook does not move horizontally because pawn in the way', () => {
  const MyChessGame = { 
    ...ChessGame,
    // if you want to override default setup, do it here
    setup: () => ({ 
      board: [
            [blackRook, blackKnight, blackBishop, blackQueen, blackKing, blackBishop, blackKnight, blackRook],
            [blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [whiteRook, null, null, whitePawn, null, null, null, null],
            [whitePawn, whitePawn, whitePawn, null, whitePawn, whitePawn, whitePawn, whitePawn],
            [null, whiteKnight, whiteBishop, whiteQueen, whiteKing, whiteBishop, whiteKnight, whiteRook],
        ]
    }),
  };
  const client = Client({ game: MyChessGame }); 
  
  client.moves.selectPieceToMove(5, 0)
  client.moves.movePiece(5, 6);

  const {G, ctx} = client.store.getState();

  expect(G.board).toEqual([
    [blackRook, blackKnight, blackBishop, blackQueen, blackKing, blackBishop, blackKnight, blackRook],
    [blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn, blackPawn],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [whiteRook, null, null, whitePawn, null, null, null, null],
    [whitePawn, whitePawn, whitePawn, null, whitePawn, whitePawn, whitePawn, whitePawn],
    [null, whiteKnight, whiteBishop, whiteQueen, whiteKing, whiteBishop, whiteKnight, whiteRook],
  ]);
});
