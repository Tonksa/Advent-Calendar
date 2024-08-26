import React, { useState, useEffect, useRef } from 'react';
import '../scss/app.scss';
import Slot from './components/Slot';
import ActiveSlot from './components/ActiveSlot';
import Notice from './components/Notice';
import { slot_data } from "./json/slot_data.js";
import { CSSTransition } from 'react-transition-group';
import { format } from 'date-fns'

/** TODO
 * - Randomise the order
 * - Add unlocked view
 */

function App() {
    const [showNotice, setShowNotice] = useState(false);
    const [noticeText, setNoticeText] = useState("");
    const [activeSlotID, setActiveSlotID] = useState(null);
    const [clickedSlots, setClickedSlots] = useState([]);
    const [showSlots, setShowSlots] = useState(true);
    const [showActiveSlot, setShowActiveSlot] = useState(false);
    const [allowSlotClick, setAllowSlotClick] = useState(true);

    console.log(clickedSlots)

    // Unlocked param to allow admins to view every single slot on any date
    const [isUnlocked, setIsUnlocked] = useState(false);

    // Use a variable to check against the first load of the App - used later on for localstorage.
    const isInitialMount = useRef(true);

    const noticeDisplayTime = "4000"

    const patternTransitionTotalTime = 800;

    // Check if the URL contains the query parameter "?unlocked=true" and update the state
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const unlockedValue = urlParams.get('unlocked') === 'true' ? true : false;

        setIsUnlocked(unlockedValue);
    }, []);

    const handleSlotClick = (id) => {
        // Clear the existing timeout to prevent the notice from lingering
        clearTimeout(noticeTimeout);

        const currentDate = new Date();
        const slotDate = new Date(2023, 11, id); // Months are 0-indexed, so 11 represents December
        const formattedSlotDate = format(slotDate, 'MMMM do');

        if ((slotDate > currentDate) && !isUnlocked) {
            setShowNotice(true);
            setNoticeText(`You are too early for that slot, cheeky bastard! Try again on ${formattedSlotDate}.`)

            // Move user back to top of page to see the Notice
            window.scrollTo({top: 0, behavior: 'smooth'});
        } else {
            if (allowSlotClick) {
                // Ensure that we don't allow the user to spam click as many slots as they can whilst the transition is happening.
                setAllowSlotClick(false);

                // Disable Notice
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

    // Function to clear all active slots
    const clearSlots = () => {
        setClickedSlots([]);
        localStorage.removeItem('clickedSlots');
    };

    // Declare a variable to store the notice timeout
    let noticeTimeout;

    // Set up a timer to reset showNotice to false after 10 seconds
    useEffect(() => {
        noticeTimeout = setTimeout(() => {
            setShowNotice(false);
        }, noticeDisplayTime);

        // Clean up the timer when the component unmounts or when showNotice becomes false
        return () => clearTimeout(noticeTimeout);
    }, [showNotice, noticeText]);

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
                <CSSTransition
                    in={showNotice}
                    timeout={1000} // Adjust the duration to match your CSS transition duration
                    classNames='notice'
                    unmountOnExit
                >
                    <div className='container-lg'>
                        <Notice
                            text={noticeText}
                        />
                    </div>
                </CSSTransition>

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
                        <h1 className="title">✨ Unwrap the Holiday Magic ✨</h1>
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
                        <div className="buttons">
                            <button
                                id="clear-button"
                                className="btn"
                                onClick={clearSlots}
                                disabled={!clickedSlots || clickedSlots.length === 0}
                                >
                                    Clear all active slots
                            </button>
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
