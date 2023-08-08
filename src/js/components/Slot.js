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
                <div className="slot__pattern"></div>

                <div className="slot__number">
                    <span className="slot__number-id">{id}</span>
                </div>
            </div>
        </div>
    )
}