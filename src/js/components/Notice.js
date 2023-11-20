import React from "react";

export default function Notice(props) {
    const { text } = props

    return (
        <div className="notice">
            <div
                className="notice__inner"
                >
                <p>{text}</p>
            </div>
        </div>
    )
}