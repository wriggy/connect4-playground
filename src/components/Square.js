function Square({counter, onClick}) {

    const sqrClick= () => onClick()

    return (
        <div className="square">
            <button className="square" onClick={sqrClick}>   
                {counter}    
            </button>
        </div>
    );
}

export default Square;