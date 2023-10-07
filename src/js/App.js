import React, { useState, useEffect, useRef } from 'react';
import '../scss/app.scss';
import Slot from './components/Slot';
import ActiveSlot from './components/ActiveSlot';
import Notice from './components/Notice';
import { slot_data } from "./json/slot_data.js";
import { CSSTransition } from 'react-transition-group';

/** TODO
 * - Randomise the order
 * - Add unlocked view
 * - Add option to clear
 */

function App() {
    const [showNotice, setShowNotice] = useState(false);
    const [noticeText, setNoticeText] = useState("");
    const [activeSlotID, setActiveSlotID] = useState(null);
    const [clickedSlots, setClickedSlots] = useState([]);
    const [showSlots, setShowSlots] = useState(true);
    const [showActiveSlot, setShowActiveSlot] = useState(false);
    const [allowSlotClick, setAllowSlotClick] = useState(true);

    // Use a variable to check against the first load of the App - used later on for localstorage.
    const isInitialMount = useRef(true);

    const noticeDisplayTime = "10000"

    const patternTransitionTotalTime = 600;

    // localStorage.clear();

    const handleSlotClick = (id) => {
        if (allowSlotClick) {
            // Ensure that we don't allow the user to spam click as many slots as they can whilst the transition is happening.
            setAllowSlotClick(false);

            const currentDate = new Date();
            const slotDate = new Date(2023, 7, id); // Months are 0-indexed, so 7 represents August
    
            if (slotDate > currentDate) {
                setShowNotice(true);
                setNoticeText(`You are too early for that slot! ${slotDate}`)
            } else {
                setShowNotice(false);
                
                // Allow the transition to the pattern on the Slot if the Slot has not previously been opened.
                if (!clickedSlots || !clickedSlots.includes(id)) {
                    setTimeout(() => {
                        setActiveSlotID(id);
                    }, patternTransitionTotalTime);
                } else {
                    setActiveSlotID(id);
                }
                
                // Firstly, check if clickedSlots has any value. If not, then assign the slot clicked. This is only ever applicable upon the first slot slick.
                if (!clickedSlots) {
                    setClickedSlots([id])
                } else if (!clickedSlots.includes(id)) {
                    // Next check if the slot clicked already exists within the array, if not then add it.
                    setClickedSlots((prevClickedSlots) => [...prevClickedSlots, id]);
                }
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

                <CSSTransition
					in={!activeSlotID && showSlots}
					timeout={300} // Adjust the duration to match your CSS transition duration
					classNames='fade'
					unmountOnExit
					onExited={() => {
						// Transition has ended, now set the activeSlotID
                        setShowActiveSlot(true);
                        setShowSlots(false);
					}}
				>
					<div className='container-lg'>
						<div className='slots'>
							<div className='slots__inner'>
								{slot_data.map((item) => (
									<Slot
										key={item.id}
										id={item.id}
										onSlotClick={handleSlotClick}
										hasBeenOpened={clickedSlots && clickedSlots.includes(item.id)}
									/>
								))}
							</div>
						</div>
					</div>
				</CSSTransition>

				<CSSTransition
					in={activeSlotID !== null && showActiveSlot}
					timeout={300} // Adjust the duration to match your CSS transition duration
					classNames='fade'
                    onExited={() => {
						// Transition has ended, now set the activeSlotID to re-show all of the Slots
                        setShowSlots(true);
                        setActiveSlotID(null);
                        setAllowSlotClick(true);
					}}
					unmountOnExit
				>
					<div className='container-md'>
						<button className='back-arrow' onClick={() => setShowActiveSlot(false)}></button>
						<ActiveSlot id={activeSlotID} />
					</div>
				</CSSTransition>
            </div>
        </>
    );
}

export default App;
