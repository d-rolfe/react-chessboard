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
        for (let i = 0; i < 8; i++) {
            let row = []
            for (let j = 0; j < 8; j++) {
                let cellId = i + j + 1;
                row.push(
                    <td key={cellId} style={cellStyle} onMouseDown={() => this.onMouseDown(i, j)} onMouseUp={() => this.onMouseUp(i, j)}>
                        <span className="noselect">
                            {this.props.G.board[i][j] !== null && String.fromCharCode(this.props.G.board[i][j].iconCharCode)}
                        </span>
                    </td>
                )
            }
            let rowId = i + 1;
            board.push(
                <tr key={rowId}>{row}</tr>
            )
        }

        return (
            <div>
                <p>{ this.props.G.isCheck.whiteKingIsInCheck && 'White king is in check'}</p>
                <p>{ this.props.G.isCheck.blackKingIsInCheck && 'Black king is in check'}</p>
                <table>
                    <tbody>{board}</tbody>
                </table>
                {/* <p>{'Using fromCharCode (decimal): ' + String.fromCharCode(9812) }</p>
                <p>{'Using fromCharCode (hex): ' + String.fromCharCode(0x2654) }</p>
                <p>{'Using fromCodePoint (decimal): ' + String.fromCharCode(9812) }</p>
                <p>{'Using fromCodePoint (hex): ' + String.fromCharCode(0x2654) }</p> */}
            </div>
        )
    }
}