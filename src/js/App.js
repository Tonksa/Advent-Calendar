import React, { useState, useEffect } from 'react';
import '../scss/app.scss';
// import Header from './components/Header';
import Slot from './components/Slot';
import Notice from './components/Notice';
import { slot_data } from "./json/slot_data.js";

function App() {
    const [showNotice, setShowNotice] = useState(false);
    const [noticeText, setNoticeText] = useState("");
    const noticeDisplayTime = "10000"

    const handleSlotClick = (id) => {
        const currentDate = new Date();
        const slotDate = new Date(2023, 7, id); // Months are 0-indexed, so 7 represents August

        console.log(`Current date: ${currentDate}`)
        console.log(`Slot Date: ${slotDate}`)

        if (slotDate > currentDate) {
            setShowNotice(true);
            setNoticeText(`You are too early for that slot! ${slotDate}`)
        } else {
            setShowNotice(false);
        }
    };

    // Set up a timer to reset showNotice to false after 10 seconds
    useEffect(() => {
        let timeout;

        if (showNotice) {
            timeout = setTimeout(() => {
                setShowNotice(false);
            }, noticeDisplayTime);
        }

        // Clean up the timer when the component unmounts or when showNotice becomes false
        return () => clearTimeout(timeout);
    }, [showNotice]);

    return (
        <>
            {showNotice && (
                <div className='container'>
                    <Notice
                        text={noticeText}
                    />
                </div>
            )}

            <div className='container'>
                <div className='slots'>
                    {slot_data.map((item) => (
                        <Slot
                            key={item.id}
                            id={item.id}
                            onSlotClick={handleSlotClick} 
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default App;
