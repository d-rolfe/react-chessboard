// import { render, screen } from '@testing-library/react';
// import App from './App';
import { Client } from 'boardgame.io/client';
import { ChessGame } from './Game';


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
  
  client.moves.movePiece(6, 0, 5, 0);

  const {G, ctx} = client.store.getState();

  expect(G.board).toEqual([
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["P", null, null, null, null, null, null, null],
    [null, "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ]);
});

it('test White pawn attacks', () => {
  const MyChessGame = { 
    ...ChessGame,
    // if you want to override default setup, do it here
    setup: () => ({ 
      board: [
          ["r", "n", "b", "q", "k", "b", "n", "r"],
          ["p", null, "p", "p", "p", "p", "p", "p"],
          [null, null, null, null, null, null, null, null],
          [null, "p", null, null, null, null, null, null],
          ["P", null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, "P", "P", "P", "P", "P", "P", "P"],
          ["R", "N", "B", "Q", "K", "B", "N", "R"],
        ]
    }),
  };
  const client = Client({ game: MyChessGame }); 
  
  client.moves.movePiece(4, 0, 3, 1);

  const {G, ctx} = client.store.getState();

  expect(G.board).toEqual([
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", null, "p", "p", "p", "p", "p", "p"],
    [null, null, null, null, null, null, null, null],
    [null, "P", null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ]);
});
