import SubComp1 from '../SubComp1/SubComp1';
import { useState } from 'react'

function Comp1() {
    const data = [
        { text: "first", id: '001' },
        { text: "second", id: '002' },
        { text: "third", id: '003' },
    ]
    const [isClicked, setIsClicked] = useState(false);
    const [selectedItem, setSelectedItem] = useState('001')

    const handleClick = e => { setIsClicked(true) }
    let selectedText = data[data.findIndex(i => i.id === selectedItem)].text;

    return (
        <div>
            <h1>
                Hello World!
            </h1>

            <h2>Click status = {isClicked ? "true" : "false"}</h2>
        
            <h3>Selected item = {selectedText}</h3>
            
            
            <hr />
            {data.map(item => <SubComp1
                text={item.text}
                key={item.id}
                id={item.id}
                handleClick={handleClick}
                setSelectedItem={setSelectedItem}
            />
            )}

        </div>
    );
}

export default Comp1;