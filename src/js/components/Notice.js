import React from "react";

export default function Notice(props) {
    const { text, displayTime } = props
    // const noticeDisplayTime = '10s'

    return (
        <div className="notice">
            <div
                className="notice__inner"
                // data-display-time={displayTime}
                >
                <p>{text} notice here</p>
            </div>
        </div>
    )
}