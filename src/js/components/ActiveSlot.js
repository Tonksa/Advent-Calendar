import React from "react";
import { slot_data } from "../json/slot_data";

export default function ActiveSlot(props) {
    const data = slot_data.find((item) => item.id === props.id)
    const { content, type, image, id } = data

    console.log(data)

    return (
        <div className={`active-slot --${type}`}>
            <div className="inner">
                {type === 'image' &&
                    <img src={image} alt={`Slot Number ${id}`} />
                }

                <p className="text">{content}</p>
                {/* <p className="">{type}</p> */}
            </div>
        </div>
    )
}