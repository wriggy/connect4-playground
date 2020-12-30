import Square from './Square'

function Board({ config, squares, onClick }) {

    const listRows = config.rows.map(i => (
        <div className="board-row" key={i}>
            {config.cols.map(j => <Square
                counter={squares[i * config.cols.length + j]}
                onClick={() => onClick(i * config.cols.length + j)}
                key={i * config.cols.length + j} />
            )}
        </div>)
    );


    return (
        <div className="board">
            {listRows}
        </div>
    );

}

export default Board;