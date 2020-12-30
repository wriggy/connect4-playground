import { useState } from 'react'
import Board from './Board'

function Game() {

    const config = {rows: [0,1,2,3,4,5], cols: [0,1,2,3,4,5,6], numconnections:4}

    const initDat = Array(config.rows.length*config.cols.length).fill(null)
    let testdat = [ null,null,null,null,null,null,null,
                    null,null,null,null,null,null,null,
                    null,null,null,null,null,null,null,
                    null,null,null,null,null,null,null,
                    null,null,null,null,null,null,null,
                    null,null,'X','O',null,null,null
                ]
    // state
    const [squares, setSquares] = useState(testdat)
    const [xIsNext, setXIsNext] = useState(true)
    
    const handleClick = n => {
        console.log(n)
        let sqs = squares.slice();
        sqs[n] = xIsNext ? "X" : "O";
        setSquares(sqs);
        setXIsNext(!xIsNext);
    }
    
    const calculateWinner = squares => false;

    return (
        <div className="game">
            <div>
            <Board 
                config={config} 
                squares={squares}
                onClick={(i) => handleClick(i)}/>
            </div>
            <div className="game-info">
                <h1>Connect 4</h1>
                <hr /> <br />
                <h2>Next Player : {xIsNext ? 'X' : 'O'}</h2>
            </div>
           
        </div>
    );
}

export default Game;