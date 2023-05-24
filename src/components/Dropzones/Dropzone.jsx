import React from 'react';
import { useDrop } from 'react-dnd';

import styles from './Dropzones.module.scss';

const Dustbin = ({ action, text, hoverText }) => {
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: 'bookmark',
        drop: () => ({ type: action }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    return (
        <div className={styles.zone} ref={drop}>
            <strong>{canDrop && isOver ? hoverText : text}</strong>
        </div>
    );
};

export default Dustbin;
