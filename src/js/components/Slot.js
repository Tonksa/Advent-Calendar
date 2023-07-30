import React from "react";

export default function Slot(props) {
    const { id } = props

    return (
        <div className="slot">
            <div className="slot__inner">
                <p>{id}</p>
            </div>
        </div>
    )
}