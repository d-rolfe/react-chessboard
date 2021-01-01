import React from 'react';

export class ChessBoard extends React.Component {
    onMouseDown(row, col) {
        this.props.moves.selectPieceToMove(row, col);
    }

    onMouseUp(row, col) {
        this.props.moves.movePiece(row, col);
    }
    render() {
        const cellStyle = {
            border: '1px solid #555',
            width: '50px',
            height: '50px',
            lineHeight: '50px',
            textAlign: 'center',
          };

        let board = [];
        let i, j;
        for (i = 0; i < 8; i++) {
            let row = []
            for (j = 0; j < 8; j++) {
                row.push(
                    <td style={cellStyle} onMouseDown={() => this.onMouseDown(i, j)} onMouseUp={() => this.onMouseUp(i, j)}>{this.props.G.board[i][j]}</td>
                )
            }
            board.push(
                <tr>{row}</tr>
            )
        }

        return (
            <div>
                <table>
                    <tbody>{board}</tbody>
                </table>
            </div>
        )
    }
}