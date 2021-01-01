import { Client } from 'boardgame.io/react';
import { ChessGame } from './Game';
import { ChessBoard } from './Board';

const App = Client({ 
    game: ChessGame,
    board: ChessBoard
 });

export default App;
