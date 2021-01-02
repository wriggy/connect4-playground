import { useState } from 'react'
import Board from './Board'
import choose from './Player'

function Game() {
    const config = { rows: [0, 1, 2, 3, 4, 5], cols: [0, 1, 2, 3, 4, 5, 6], numConnections: 4 }
    const initDat = Array(config.rows.length * config.cols.length).fill(null)

    // state
    const [squares, setSquares] = useState(initDat)
    const [done, setDone] = useState(false)
    const [winningIxes, setWinningIxes] = useState([])

    // functions
    const isValid = (n, sqs) => {
        if (sqs[n]) { return false }
        if ((n < config.cols.length * (config.rows.length - 1)) &&
            !(sqs[n + config.cols.length])) { return false }
        return true
    }

    const isWinningMove = (n, player, sqs) => {
        // return false or indexes of line if a win
        const row = Math.floor(n / config.cols.length); 
        const col = n % config.cols.length;
        const gridIx = (r, c) => c + r * config.cols.length;
        const isClaimed = (r, c) => {
            if (r < 0 || r >= config.rows.length) return false
            if (c < 0 || c >= config.cols.length) return false
            return (sqs[gridIx(r, c)] === player)
        };
        const checkDir = (dr,dc) => {
            let count = 1; let gridIxes=[n];
            let R = row + dr; let C = col + dc
            while (isClaimed(R, C, player, sqs)) { 
                count += 1; gridIxes.push(gridIx(R,C))
                R += dr; C += dc }
            R = row - dr; C = col - dc
            while (isClaimed(R, C, player, sqs)) { 
                count += 1;  gridIxes.push(gridIx(R,C))
                R -= dr; C -= dc }
            return ((count >= config.numConnections) ? gridIxes : false)
        }
        if (checkDir(0,1)) {return checkDir(0,1)}
        if (checkDir(1,0)) {return checkDir(1,0)}
        if (checkDir(1,1)) {return checkDir(1,1)}
        if (checkDir(1,-1)) {return checkDir(1,-1)}
        return false
    }

    const handleClick = n => {
        let sqs = squares.slice();
        if (done || !isValid(n,sqs)) { return }
        let nextMove = null
        sqs[n] = "X";
        setSquares(sqs)
        if (isWinningMove(n, "X", sqs)) {
            setWinningIxes(isWinningMove(n, "X", sqs))
            setDone(true)
            return
        }
        nextMove = choose(config, sqs);
        if (nextMove) {
            sqs[nextMove] = "O";
            setSquares(sqs)
            if (isWinningMove(nextMove, "O", sqs)) {
                setWinningIxes(isWinningMove(nextMove, "O", sqs))
                setDone(true)
                return
            }
        }
    }
    
    const reset = () => {
        setSquares(initDat)
        setDone(false)
        setWinningIxes([])
    }

    // jsx
    return (
        <div className="game">
            <p>Connect 4<br />Play first against the computer</p>
            <div className="game-info">
                <button className="reset" onClick={() => reset()}> New Game </button><br /><br />
                <h3>{done ? "Game Over" : "Computer is O"}</h3>
            </div>
            <Board
                config={config}
                squares={squares}
                onClick={(i) => {handleClick(i)} } 
                winningIxes={winningIxes}
                />
        </div>
    );
}

export default Game;