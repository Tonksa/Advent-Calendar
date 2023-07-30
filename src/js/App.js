import React from 'react';
import '../scss/app.scss';
import Header from './components/Header';
import Slot from './components/Slot';
import { slot_data } from "./json/slot_data.js";

function App() {
    return (
        <>
            {/* <Header /> */}
            
            <div className='container'>
                <div className='slots'>
                    {slot_data.map((item) => (
                        <Slot
                            key={item.id}
                            id={item.id}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default App;
