function SubComp1(props) {
    const handleEvent = e => {
        props.handleClick(e);
        props.setSelectedItem(props.id);
    }

    return (
        <div>
            <h2>
                A subcomponent!
            </h2>             
            <button type="button" 
                    onClick={handleEvent}>
                   <h3>{props.text}</h3>
            </button>
        </div>
    );
}

export default SubComp1;