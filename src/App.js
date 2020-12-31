import { Client } from 'boardgame.io/react';
import { ChessGame } from './Game';

const App = Client({ game: ChessGame });

export default App;
