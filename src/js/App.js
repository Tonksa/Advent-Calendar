import React, { useState, useEffect } from 'react';
import '../scss/app.scss';
import Slot from './components/Slot';
import ActiveSlot from './components/ActiveSlot';
import Notice from './components/Notice';
import { slot_data } from "./json/slot_data.js";

/** TODO
 * - Slot:
 * - - On click, open new "page" with the content on it.
 * - - Implement cache for those already clicked.
 * - - After implemented cache, change layout of regular slot content.
 */

function App() {
    const [showNotice, setShowNotice] = useState(false);
    const [noticeText, setNoticeText] = useState("");
    const noticeDisplayTime = "10000"

    const [activeSlotID, setActiveSlotID] = useState(null);

    const handleSlotClick = (id) => {
        const currentDate = new Date();
        const slotDate = new Date(2023, 6, id); // Months are 0-indexed, so 7 represents August

        if (slotDate > currentDate) {
            setShowNotice(true);
            setNoticeText(`You are too early for that slot! ${slotDate}`)
        } else {
            setActiveSlotID(id);
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
                {!activeSlotID &&
                    <div className='slots'>
                        {slot_data.map((item) => (
                            <Slot
                                key={item.id}
                                id={item.id}
                                onSlotClick={handleSlotClick}

                                // Implement some cache control to change the value of this.
                                isOpen={false}
                            />
                        ))}
                    </div>
                }

                {activeSlotID &&
                    <ActiveSlot
                        id={activeSlotID}
                    />
                }
            </div>
        </>
    );
}

export default App;
