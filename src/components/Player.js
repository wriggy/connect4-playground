function choose(config, sqs) {
    // choose next move //

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
            return (sqs[gridIx(r, c)] === player)
        };
        const checkDirection = (dr, dc) => {
            let count = 1; let R = row + dr; let C = col + dc
            while (isClaimed(R, C, player, sqs)) {
                count += 1; R += dr; C += dc
            }
            R = row - dr; C = col - dc
            while (isClaimed(R, C, player, sqs)) {
                count += 1; R -= dr; C -= dc
            }
            return ((count >= config.numConnections))
        }
        if (checkDirection(0, 1)) { return true }
        if (checkDirection(1, 0)) { return true }
        if (checkDirection(1, 1)) { return true }
        if (checkDirection(1, -1)) { return true }
        return false
    }


    // valid next moves
    let validMoves = sqs.map((val, ix) => ix)
        .filter(ix => isValid(ix, sqs));

    // can I win now?
    let winningMoves = validMoves.filter(ix => isWinningMove(ix, "O", sqs))
    if (winningMoves.length > 0) { return winningMoves[0] }

    // can opponent win next go?
    let opponentWinningMoves = validMoves.filter(ix => isWinningMove(ix, "X", sqs))
    if (opponentWinningMoves.length > 0) { 
        console.log("blocking move")
        return opponentWinningMoves[0] }


    // consider possible moves
    // look for moves which might win in 2 gos (if opponent doesnt block) 
    //   - without giving win to opponent
    let goodMoves = validMoves.filter(ix => {
        let newSqs = sqs.slice();
        newSqs[ix] = "O";
        let newValidMoves = newSqs.map((val, i) => i)
            .filter(i => isValid(i, newSqs));
        winningMoves = newValidMoves.filter(i =>
            (isWinningMove(i, "O", newSqs)) && !(isWinningMove(i, "X", newSqs))
        )
        if (winningMoves.length > 0) { return true }
        return false
    })
    if (goodMoves.length > 0) {
        console.log("potential win next turn")
        return goodMoves[Math.floor(Math.random() * goodMoves.length)]
    }

    // consider 2 moves ahead

    // avoid moves which might lead to opponent win next time
    let okMoves = validMoves.filter(ix => {
        let newSqs = sqs.slice();
        newSqs[ix] = "O";
        let newValidMoves = newSqs.map((val, i) => i)
            .filter(i => isValid(i, newSqs));
        opponentWinningMoves = newValidMoves.filter(i =>
            (isWinningMove(i, "X", newSqs))
        )
        if (opponentWinningMoves.length > 0) { return false }
        return true
    })
    if (okMoves.length > 0) {
        let lowestRow = Math.max(...okMoves.map(n => gridRow(n)))
        let bestOkMoves = okMoves.filter(n => gridRow(n) === lowestRow)
        console.log("lowest row")
        return bestOkMoves[Math.floor(Math.random() * bestOkMoves.length)]
    }

    // if all else fails play at random
    if (validMoves.length > 0) {
        console.log("random choice")
        return (validMoves[Math.floor(Math.random() * validMoves.length)])
    }
    return false
}

export default choose