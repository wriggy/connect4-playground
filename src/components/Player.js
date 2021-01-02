function choose(config, sqs) {
    // choose next move
    console.log("choosing a move")
    // helper functions
    const gridCol = n => n % config.cols.length;
    const gridRow = n => Math.floor(n / config.cols.length);
    const gridIx = (r, c) => c + r * config.cols.length;

    const isValid = (n, sqs) => {
        if (sqs[n]) { return false }
        if ((n < config.cols.length * (config.rows.length - 1)) &&
            !(sqs[n + config.cols.length])) { return false }
        return true
    }
    const isWinningMove = (n, player, sqs) => {
        const row = gridRow(n); const col = gridCol(n);
        const isClaimed = (r, c) => {
            if (r < 0 || r >= config.rows.length) return false
            if (c < 0 || c >= config.cols.length) return false
            return (sqs[gridIx(r,c)] === player)
        };
        const checkDirection = (dr, dc) => {
            let count = 1; let R = row + dr; let C = col + dc
            while (isClaimed(R, C, player, sqs)) { 
                count += 1; R += dr; C += dc }
            R = row - dr; C = col - dc
            while (isClaimed(R, C, player, sqs)) { 
                count += 1; R -= dr; C -= dc }
            return ((count >= config.numConnections))
        }
        if (checkDirection(0, 1)) { return true }
        if (checkDirection(1, 0)) { return true }
        if (checkDirection(1, 1)) { return true }
        if (checkDirection(1, -1)) { return true }
        return false
    }

    let validMoves = sqs.map((val, ix) => ix).filter(ix => isValid(ix, sqs));
    let winningMoves = validMoves.filter(ix => isWinningMove(ix, "O", sqs) )
    if (winningMoves.length > 0) { return winningMoves[0] }

    let opponentWinningMoves = validMoves.filter(ix =>isWinningMove(ix, "X", sqs) )
    if (opponentWinningMoves.length > 0) { return opponentWinningMoves[0] }

    let goodMoves = validMoves.filter(ix => {
        let possSqs = sqs.slice(); possSqs[ix] = "O";
        let possValidMoves = possSqs.map((val, i) => i).filter(i => isValid(i, possSqs));
        winningMoves = possValidMoves.filter(i =>
            (isWinningMove(i, "O", possSqs)) &&
            !(isWinningMove(i, "X", possSqs))
        )
        if (winningMoves.length > 0) { return true }
        return false
    })
    if (goodMoves.length > 0) { return goodMoves[0] }

    let okMoves = validMoves.filter(ix => {
        let possSqs = sqs.slice(); possSqs[ix] = "O";
        let possValidMoves = possSqs.map((val, i) => i).filter(i => isValid(i, possSqs));
        opponentWinningMoves = possValidMoves.filter(i =>
            (isWinningMove(i, "X", possSqs))
        )
        if (opponentWinningMoves.length > 0) { return false }
        return true
    })
    if (okMoves.length > 0) { 
        //console.log("Not giving a winning move to opponent")
        let lowestRow = Math.max(...okMoves.map(n=> gridRow(n)))
        let bestMoves = okMoves.filter(n => gridRow(n) === lowestRow)
        return bestMoves[Math.floor(Math.random() * bestMoves.length)]
    }

    if (validMoves.length > 0) {
        return (validMoves[Math.floor(Math.random() * validMoves.length)])
    }
    return false
}


export default choose