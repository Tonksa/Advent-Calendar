import React from "react";
import { slot_data } from "../json/slot_data";

export default function ActiveSlot(props) {
    const data = slot_data.find((item) => item.id === props.id)
    const { content, type } = data

    return (
        <div className='active-slot'>
            <div className="">
                <p>{content}</p>
                <p>{type}</p>
            </div>
        </div>
    )
}