import SubComp1 from '../SubComp1/SubComp1';
import { useState } from 'react'

function Comp1() {
    const data = [
        { text: "first", cat: "A", id: '001' },
        { text: "second", cat: "B", id: '002' },
        { text: "third", cat: "C", id: '003' },
    ]
    const [isClicked, setIsClicked] = useState(false);
    const [selectedItem, setSelectedItem] = useState('001')

    const handleClick = e => { setIsClicked(true) }
    const handleReset = e => { setIsClicked(false)}
    let ix = data.findIndex(i => i.id === selectedItem);
    let selectedText = data[data.findIndex(i => i.id === selectedItem)].text;
    let listItems = data.map(item => <SubComp1
            text={item.text}
            key={item.id}
            id={item.id}
            handleClick={handleClick}
            setSelectedItem={setSelectedItem}
            />
        )
    let listDetails = (
        <div>
            <h3>Selected item = {data[ix].text}</h3>
            <p>Cat = {data[ix].cat}, Selected id = {selectedItem}</p>
            <button type="button" 
                    onClick={handleReset}>
                   <h3>Back to list</h3>
            </button>
        </div>
    )

    return (
        <div>
            <h1>
                Hello World!
            </h1>
            {isClicked ? listDetails : listItems}
            <hr/>
        </div>
    );
}

export default Comp1;