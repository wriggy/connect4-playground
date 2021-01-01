import { useState } from 'react'
import Board from './Board'

function Game() {

    const config = { rows: [0, 1, 2, 3, 4, 5], cols: [0, 1, 2, 3, 4, 5, 6], numConnections: 4 }
    const initDat = Array(config.rows.length * config.cols.length).fill(null)

    // state
    const [squares, setSquares] = useState(initDat)
    const [done, setDone] = useState(false)
    const [winningIxes, setWinningIxes] = useState([])

    // helper fns
    const isValid = (n, sqs) => {
        if (sqs[n]) { return false }
        if ((n < config.cols.length * (config.rows.length - 1)) &&
            !(sqs[n + config.cols.length])) { return false }
        return true
    }

    const gridCol = n => n % config.cols.length;
    const gridRow = n => Math.floor(n / config.cols.length);
    const gridIx = (r, c) => c + r * config.cols.length;

    const isClaimed = (r, c, player, sqs) => {
        if (r < 0 || r >= config.rows.length) return false
        if (c < 0 || c >= config.cols.length) return false
        return (sqs[gridIx(r, c)] === player)
    };

    const winningLine = (row, col, player, sqs) => {
        const checkDir = (dr,dc) => {
            let count = 1; let gridIxes=[gridIx(row,col)];
            let R = row + dr; let C = col + dc
            while (isClaimed(R, C, player, sqs)) { 
                count += 1; gridIxes.push(gridIx(R,C))
                R += dr; C += dc }
            R = row - dr; C = col - dc
            while (isClaimed(R, C, player, sqs)) { 
                count += 1;  gridIxes.push(gridIx(R,C))
                R -= dr; C -= dc }
            return ([(count >= config.numConnections), gridIxes])
        }
        if (checkDir(0,1)[0]) {return checkDir(0,1)[1]}
        if (checkDir(1,0)[0]) {return checkDir(1,0)[1]}
        if (checkDir(1,1)[0]) {return checkDir(1,1)[1]}
        if (checkDir(1,-1)[0]) {return checkDir(1,-1)[1]}
    }

    const checkDirection = (dr, dc, row, col, player, sqs) => {
        let count = 1; let R = row + dr; let C = col + dc
        while (isClaimed(R, C, player, sqs)) { 
            count += 1; R += dr; C += dc }
        R = row - dr; C = col - dc
        while (isClaimed(R, C, player, sqs)) { 
            count += 1; R -= dr; C -= dc }
        return ((count >= config.numConnections))
    }

    const isWinningMove = (row, col, player, sqs) => {
        if (checkDirection(0, 1, row, col, player, sqs)) { return true }
        if (checkDirection(1, 0, row, col, player, sqs)) { return true }
        if (checkDirection(1, 1, row, col, player, sqs)) { return true }
        if (checkDirection(1, -1, row, col, player, sqs)) { return true }
        return false
    }

    // basic player looking one or two moves ahead
    const choose = sqs => {
        let validMoves = sqs.map((val, ix) => ix).filter(ix => isValid(ix, sqs));
        let winningMoves = validMoves.filter(ix =>
            (isWinningMove(gridRow(ix), gridCol(ix), "O", sqs))
        )
        if (winningMoves.length > 0) { 
            //console.log("winning move")
            return winningMoves[0] }

        let opponentWinningMoves = validMoves.filter(ix =>
            (isWinningMove(gridRow(ix), gridCol(ix), "X", sqs))
        )
        if (opponentWinningMoves.length > 0) { 
            //console.log("blocking move")
            return opponentWinningMoves[0] }

        let goodMoves = validMoves.filter(ix => {
            let possSqs = sqs.slice(); possSqs[ix] = "O";
            let possValidMoves = possSqs.map((val, i) => i).filter(i => isValid(i, possSqs));
            winningMoves = possValidMoves.filter(i =>
                (isWinningMove(gridRow(i), gridCol(i), "O", possSqs)) &&
                !(isWinningMove(gridRow(i), gridCol(i), "X", possSqs))
            )
            if (winningMoves.length > 0) { return true }
            return false
        })
        if (goodMoves.length > 0) { 
            //console.log("possible winning move next time")
            return goodMoves[0] }

        let okMoves = validMoves.filter(ix => {
            let possSqs = sqs.slice(); possSqs[ix] = "O";
            let possValidMoves = possSqs.map((val, i) => i).filter(i => isValid(i, possSqs));
            opponentWinningMoves = possValidMoves.filter(i =>
                (isWinningMove(gridRow(i), gridCol(i), "X", possSqs))
            )
            if (opponentWinningMoves.length > 0) { return false }
            return true
        })
        if (okMoves.length > 0) { 
            //console.log("Not giving a winning move to opponent")
            return okMoves[Math.floor(Math.random() * okMoves.length)]}

        if (validMoves.length > 0) {
            return (validMoves[Math.floor(Math.random() * validMoves.length)])
        }
        return false
    }


    const handleClick = n => {
        let sqs = squares.slice();
        if (done || !isValid(n, sqs)) { return }
        sqs[n] = "X";
        setSquares(sqs)
        if (isWinningMove(gridRow(n), gridCol(n), "X", sqs)) {
            setWinningIxes(winningLine(gridRow(n), gridCol(n), "X", sqs))
            setDone(true)
            return
        }
        let nextMove = choose(sqs);
        if (nextMove) {
            sqs[nextMove] = "O";
            setSquares(sqs)
            if (isWinningMove(gridRow(nextMove), gridCol(nextMove), "O", sqs)) {
                setWinningIxes(winningLine(gridRow(nextMove), gridCol(nextMove), "O", sqs))
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