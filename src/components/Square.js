function Square({counter, onClick, css}) {
    let cssClass = "square " + css

    return (
        <div className={cssClass}>
            <button className={cssClass} onClick={() => onClick()}>  
                {counter}    
            </button>
        </div>
    );
}

export default Square;