import React from "react";
import { slot_data } from "../json/slot_data";

export default function ActiveSlot(props) {
    const data = slot_data.find((item) => item.id === props.id)
    if (data) {
        const { content, type, image, id } = data
    
        return (
            <div className={`active-slot --${type}`}>
                <div className="number">
                    <span className="number__id">{id}</span>
                </div>

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
}