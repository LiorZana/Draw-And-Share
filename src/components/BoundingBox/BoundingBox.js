import React from 'react';

const BoundingBox = ({ x = 100, y = 100, width = 100, height = 100, translate = { x: 0, y: 0 } }) => {

    if (height > 0 && width > 0) {
        return <path
            transform={`translate(${translate.x}, ${translate.y})`}
            style={{ stroke: 'black', strokeWidth: 1, fill: 'none' }}
            className="box"
            d={`M${x} ${y} L${x + width} ${y} L${x + width} ${y + height} L${x} ${y + height} L${x} ${y}`}
        />
    } else {
        return (false);
    }

}

export default BoundingBox;