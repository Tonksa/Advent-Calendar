import React from "react";

export default function Slot(props) {
    const { id, onSlotClick, hasBeenOpened } = props

    const handleSlotClick = () => {
        onSlotClick(id);
    };

    const isOpenClass = hasBeenOpened ? ' --is-open' : '';

    return (
        <div className={`slot${isOpenClass}`}>
            <div className="slot__inner" onClick={handleSlotClick}>
                <p>{id}</p>
            </div>
        </div>
    )
}