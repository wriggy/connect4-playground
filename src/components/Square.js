function Square({counter, onClick}) {

    return (
        <div className="square">
            <button className="square" onClick={() => onClick()}>   
                {counter}    
            </button>
        </div>
    );
}

export default Square;