import { useState } from 'react'
import Board from './Board'

function Game() {

    const config = { rows: [0, 1, 2, 3, 4, 5], cols: [0, 1, 2, 3, 4, 5, 6], numconnections: 4 }

    const initDat = Array(config.rows.length * config.cols.length).fill(null)
    let testdat = [null, null, null, null, null, null, null,
        null, null, null, null, null, null, null,
        null, null, null, null, null, null, null,
        null, null, null, null, null, null, null,
        null, null, null, null, null, null, null,
        null, null, 'X', 'O', null, null, null
    ]
    // state
    const [squares, setSquares] = useState(testdat)
    const [xIsNext, setXIsNext] = useState(true)
    const [done, setDone] = useState(false)
    
    const isValid = n => {
        if (squares[n]) { return false }
        if ((n < config.cols.length * (config.rows.length - 1)) &&
            !(squares[n + config.cols.length])) { return false }
        console.log(n)
        return true
    }

    const grid = sqs => {
        let arr = sqs.slice()
        let grid = []
        while (arr.length) { grid.push(arr.splice(0, config.cols.length)) }
        return grid
    }

    const gridCol = n => n%config.cols.length;
    const gridRow = n => Math.floor(n/config.cols.length);

    const isClaimed = (n, player) => {
        console.log(n, player)
        if ((n < 0) || (n >= config.rows.length * config.cols.length)) { return false }
        return squares[n] === player
    }

    const isWinningMove = (n, player) => {
        let count = 1; 
        let i = n + config.cols.length;
        while (isClaimed(i, player)) {
            count++; i = i + config.cols.length;
        }
        i = n - config.cols.length;
        while (isClaimed(i, "X")) {
            count++; i = i - config.cols.length;
        }
        if (count >= 4) { return true }
        return false
    }

    const handleClick = n => {
        if (done || !isValid(n)) { return }
        let sqs = squares.slice();
        sqs[n] = xIsNext ? "X" : "O";
        setSquares(sqs);
        if (isWinningMove(n,sqs[n])) {
            setDone(true)
        }
        setXIsNext(!xIsNext)
    }

    const reset = () => {
        setSquares(initDat)
        setXIsNext(true)
        setDone(false)
    }

    return (
        <div className="game">
            <p>Connect 4</p>
            <div className="game-info">
                <button className="reset" onClick={() => reset()}> New Game </button><br /><br />  
                <h2>{done ? "Game Over" : "Next Player : " + (xIsNext ? "X" : "O")}</h2>
            </div>
            <Board
                config={config}
                squares={squares}
                onClick={(i) => handleClick(i)} />
        </div>
    );
}

export default Game;