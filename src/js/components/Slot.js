import React from "react";

export default function Slot(props) {
    const { id, onSlotClick } = props

    const handleSlotClick = () => {
        onSlotClick(id);
    };

    return (
        <div className="slot">
            <div className="slot__inner" onClick={handleSlotClick}>
                <p>{id}</p>
            </div>
        </div>
    )
}