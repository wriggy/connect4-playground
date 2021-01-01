import { useState } from 'react'
import Board from './Board'

function Game() {

    const config = { rows: [0, 1, 2, 3, 4, 5], cols: [0, 1, 2, 3, 4, 5, 6], numConnections: 4 }

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
        return true
    }

    const grid = sqs => {
        let arr = sqs.slice()
        let grid = []
        while (arr.length) { grid.push(arr.splice(0, config.cols.length)) }
        return grid
    }

    // helper fns
    const gridCol = n => n % config.cols.length;
    const gridRow = n => Math.floor(n / config.cols.length);
    const gridIx = (r, c) => c + r * config.cols.length;

    const isWinningMove = (row, col, player) => {
        console.log("checking .. ", row, col, player)
        const isClaimed = (r, c) => {
            if (r < 0 || r >= config.rows.length) return false
            if (c < 0 || c >= config.cols.length) return false
            return (squares[gridIx(r, c)] === player)
        };

        const checkDirection = (dr, dc) => {
            let count = 1
            let R = row + dr; let C = col + dc
            while (isClaimed(R, C)) {
                count += 1; R += dr; C += dc
            }
            R = row -dr; C = col -dc
            while (isClaimed(R, C)) {
                count += 1; R -= dr; C -= dc
            }
            console.log(dr,dc,count)
            return (count >= config.numConnections)
        }

        if (checkDirection(0, 1)) {return true}
        if (checkDirection(1, 0)) {return true}
        if (checkDirection(1, 1)) {return true}
        if (checkDirection(1, -1)) {return true}
        return false
    }

    const handleClick = n => {
        if (done || !isValid(n)) { return }
        let sqs = squares.slice();
        sqs[n] = xIsNext ? "X" : "O";
        setSquares(sqs);
        if (isWinningMove(gridRow(n), gridCol(n), sqs[n])) {
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