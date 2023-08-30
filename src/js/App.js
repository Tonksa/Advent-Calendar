import React, { useState, useEffect, useRef } from 'react';
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
 * - Cache:
 * - - Add option to clear
 */

function App() {
    const [showNotice, setShowNotice] = useState(false);
    const [noticeText, setNoticeText] = useState("");
    const [activeSlotID, setActiveSlotID] = useState(null);
    const [clickedSlots, setClickedSlots] = useState([]);

    // Use a variable to check against the first load of the App - used later on for localstorage.
    const isInitialMount = useRef(true);

    const noticeDisplayTime = "10000"

    const handleSlotClick = (id) => {
        const currentDate = new Date();
        const slotDate = new Date(2023, 7, id); // Months are 0-indexed, so 7 represents August

        if (slotDate > currentDate) {
            setShowNotice(true);
            setNoticeText(`You are too early for that slot! ${slotDate}`)
        } else {
            setActiveSlotID(id);
            setShowNotice(false);

            // Update clickedSlots array with the clicked slot's ID
            if (!clickedSlots.includes(id)) {
                setClickedSlots((prevClickedSlots) => [...prevClickedSlots, id]);
            }
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

    // Retrieve clicked slots from local storage when the component mounts
    useEffect(() => {
        const storedClickedSlots = JSON.parse(localStorage.getItem('clickedSlots'));
        setClickedSlots(storedClickedSlots);
    }, []);    

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            localStorage.setItem('clickedSlots', JSON.stringify(clickedSlots));
        }
    }, [clickedSlots]);

    console.log(clickedSlots)

    return (
        <>
            <div className='inner'>
                {showNotice && (
                    <div className='container-lg'>
                        <Notice
                            text={noticeText}
                        />
                    </div>
                )}

                    {!activeSlotID &&
                        <div className='container-lg'>
                            <div className='slots'>
                                <div className='slots__inner'>
                                    {slot_data.map((item) => (
                                        <Slot
                                            key={item.id}
                                            id={item.id}
                                            onSlotClick={handleSlotClick}
                                            hasBeenOpened={clickedSlots.includes(item.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    }

                    {activeSlotID &&
                        <div className='container-md'>
                            <button className='back-arrow' onClick={() => setActiveSlotID(null)}></button>

                            <ActiveSlot
                                id={activeSlotID}
                            />
                        </div>
                    }
            </div>
        </>
    );
}

export default App;
