function Square({player, onClick, css}) {
    let cssClass = "square " + css
    let colour = ""
    if (player==="X") {colour="red"}
    if (player==="O") {colour="rgb(3, 66, 148)"}
    let counter = (<svg height="38" width="38">
                        <circle cx="18" cy="18" r="16" stroke={colour} strokeWidth="3" fill={colour} />
                  </svg> ) 

    return (
        <div className={cssClass}>
            <button className={cssClass} onClick={() => onClick()}>  
                 {player ? counter : ""}
            </button>
        </div>
    );
}

export default Square;