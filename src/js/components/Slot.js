import React from "react";

export default function Slot(props) {
    const { id, onSlotClick } = props

    const handleSlotClick = () => {
        onSlotClick(id);
    };

    let isOpenTesting = false;
    if (id === 1) {
        isOpenTesting = true;
    }

    const isOpenClass = isOpenTesting ? ' --is-open' : '';

    return (
        <div className={`slot${isOpenClass}`}>
            <div className="slot__inner" onClick={handleSlotClick}>
                <p>{id}</p>
            </div>
        </div>
    )
}