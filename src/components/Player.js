function choose(config, sqs) {
    // choose next move - part random, part looking ahead a move or so//
    const arrIxes = Array.from(Array(42).keys());

    // helper functions
    const gridCol = n => n % config.cols.length;
    const gridRow = n => Math.floor(n / config.cols.length);
    const gridIx = (r, c) => c + r * config.cols.length;

    const isValid = (n, sqs) => {
        // true if square is available and index is valid
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
            while (isClaimed(R, C)) {
                count += 1; R += dr; C += dc
            }
            R = row - dr; C = col - dc
            while (isClaimed(R, C)) {
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

    const potentialLine = (n, player, sqs) => {
        // check for line of 2 with 1 valid move either side plus one more
        const row = gridRow(n); const col = gridCol(n);
        const isClaimed = (r, c) => {
            if (r < 0 || r >= config.rows.length) return false
            if (c < 0 || c >= config.cols.length) return false
            return (sqs[gridIx(r, c)] === player)
        };
        const checkDirection = (dr, dc) => {
            // look for 2 adjacent to index n (row,col)
            let count = 0; let R = row + dr; let C = col + dc
            while (isClaimed(R, C)) {
                count += 1; R += dr; C += dc
            }
            if (count === 2 && isValid(gridIx(row - dr, col - dc), sqs)) {
                if (isValid(gridIx(row - (2 * dr), col - (2 * dc)), sqs) ||
                    isValid(gridIx(row + (3 * dr), col + (3 * dc)), sqs)) { return true }
            }
            return false
        }
        if (checkDirection(0, 1)) { return true }
        if (checkDirection(1, 1)) { return true }
        if (checkDirection(1, -1)) { return true }
        return false

    }

    // valid next moves
    let validMoves = arrIxes.filter(ix => isValid(ix, sqs));
    {
        // can I win now?
        let winningMoves = validMoves.filter(ix => isWinningMove(ix, "O", sqs))
        if (winningMoves.length > 0) { return winningMoves[0] }
    }
    {
        // can opponent win next go?
        let opponentWinningMoves = validMoves.filter(ix => isWinningMove(ix, "X", sqs))
        if (opponentWinningMoves.length > 0) {
            //console.log("blocking move")
            return opponentWinningMoves[0]
        }
    }
    {
        // look for 2 opponent pieces in a row with 1 valid move either side plus one more
        let blockingMoves = validMoves.filter(ix => potentialLine(ix, "X", sqs));
        if (blockingMoves.length > 0) {
            //console.log("block potential line")
            return blockingMoves[0]
        }
    }
    {
        // look for moves which might win in 2 gos (if opponent doesnt block) 
        //   - without giving win to opponent next move
        let goodMoves = validMoves.filter(ix => {
            let newSqs = sqs.slice();
            newSqs[ix] = "O";
            let newValidMoves = arrIxes.filter(i => isValid(i, newSqs));
            let winningMoves = newValidMoves.filter(i =>
                (isWinningMove(i, "O", newSqs)) && !(isWinningMove(i, "X", newSqs))
            )
            if (winningMoves.length > 0) { return true }
            return false
        })
        if (goodMoves.length > 0) {
            //console.log("potential win next turn")
            return goodMoves[Math.floor(Math.random() * goodMoves.length)]
        }
    }
    // avoid moves which might lead to opponent win next time
    let okMoves = validMoves.filter(ix => {
        let newSqs = sqs.slice();
        newSqs[ix] = "O";
        let newValidMoves = arrIxes.filter(i => isValid(i, newSqs));
        let opponentWinningMoves = newValidMoves.filter(i =>
            (isWinningMove(i, "X", newSqs))
        )
        if (opponentWinningMoves.length > 0) { return false }
        return true
    })
    if (okMoves.length > 0) {
        //console.log("avoid any opponent win next time, random choice with central tendency")
        let rand = (Math.random() + Math.random()) * okMoves.length / 2
        return (okMoves[Math.floor(rand)])
    }

    // if all else fails play at random
    if (validMoves.length > 0) {
        //console.log("random choice with central tendency")
        let rand = (Math.random() + Math.random()) * validMoves.length / 2
        return (validMoves[Math.floor(rand)])
    }
    return false
}

export default choose