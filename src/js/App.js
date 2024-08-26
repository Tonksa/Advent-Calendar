import React, { useState, useEffect, useRef } from 'react';
import '../scss/app.scss';
import Slot from './components/Slot';
import ActiveSlot from './components/ActiveSlot';
import Notice from './components/Notice';
import { slot_data } from "./json/slot_data.js";
import { CSSTransition } from 'react-transition-group';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';

function App() {
    const [showNotice, setShowNotice] = useState(false);
    const [noticeText, setNoticeText] = useState("");
    const [activeSlotID, setActiveSlotID] = useState(null);
    const [clickedSlots, setClickedSlots] = useState([]);
    const [showSlots, setShowSlots] = useState(true);
    const [showActiveSlot, setShowActiveSlot] = useState(false);
    const [allowSlotClick, setAllowSlotClick] = useState(true);
    const [isUnlocked, setIsUnlocked] = useState(false);

    // Use a variable to check against the first load of the App - used later on for localstorage.
    const isInitialMount = useRef(true);

    const noticeDisplayTime = 4000; // Duration for which notice is displayed
    const patternTransitionTotalTime = 800; // Time for transition effect

    // Get current URL parameters to check if unlocked view should be enabled
    const location = useLocation();
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const unlockedValue = urlParams.get('unlocked') === 'true';
        setIsUnlocked(unlockedValue);
    }, [location.search]);

    const handleSlotClick = (id) => {
        // Clear the existing timeout to prevent the notice from lingering
        clearTimeout(noticeTimeout);

        const currentDate = new Date();
        const slotDate = new Date(2024, 11, id); // Months are 0-indexed, so 11 represents December
        const formattedSlotDate = format(slotDate, 'MMMM do');

        if ((slotDate > currentDate) && !isUnlocked) {
            setShowNotice(true);
            setNoticeText(`Ho ho ho! This surprise isn’t ready yet. Check back on ${formattedSlotDate}.`);
            // Move user back to top of page to see the Notice
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            if (allowSlotClick) {
                // Ensure that we don't allow the user to spam click as many slots as they can whilst the transition is happening.
                setAllowSlotClick(false);

                // Disable Notice
                setShowNotice(false);

                // Allow the transition to the pattern on the Slot if the Slot has not previously been opened.
                if (!clickedSlots.includes(id)) {
                    setTimeout(() => {
                        setActiveSlotID(id);
                    }, patternTransitionTotalTime);
                } else {
                    setActiveSlotID(id);
                }

                // Update clickedSlots
                setClickedSlots(prevClickedSlots => [...prevClickedSlots, id]);
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

    // Set up a timer to reset showNotice to false after a specified duration
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
        setClickedSlots(storedClickedSlots || []);
    }, []);

    useEffect(() => {
        if (!isInitialMount.current) {
            localStorage.setItem('clickedSlots', JSON.stringify(clickedSlots));
        } else {
            isInitialMount.current = false;
        }
    }, [clickedSlots]);

    return (
        <>
            <div className='inner'>
                <CSSTransition
                    in={showNotice}
                    timeout={1000} // Duration to match your CSS transition duration
                    classNames='notice'
                    unmountOnExit
                >
                    <div className='container-lg'>
                        <Notice text={noticeText} />
                    </div>
                </CSSTransition>

                <CSSTransition
                    in={!activeSlotID && showSlots}
                    timeout={300} // Duration to match your CSS transition duration
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
                                        hasBeenOpened={clickedSlots.includes(item.id)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="buttons">
                            <button
                                id="clear-button"
                                className="btn"
                                onClick={clearSlots}
                                disabled={!clickedSlots.length}
                            >
                                Reset the Calendar
                            </button>
                        </div>
                    </div>
                </CSSTransition>

                <CSSTransition
                    in={activeSlotID !== null && showActiveSlot}
                    timeout={300} // Duration to match your CSS transition duration
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
