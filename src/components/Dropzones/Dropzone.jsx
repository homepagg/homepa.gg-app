import React from 'react';
import { useDroppable } from '@dnd-kit/core';

import styles from './Dropzones.module.css';

const Dropzone = ({ action, text, hoverText }) => {
    const { setNodeRef, isOver, over } = useDroppable({
        id: action,
        data: { accepts: ['bookmark'] },
    });

    const hovering =
        over &&
        isOver &&
        over.id === action &&
        over.data.current.accepts.includes('bookmark');

    return (
        <div ref={setNodeRef} className={styles.zone}>
            <strong>{hovering ? hoverText : text}</strong>
        </div>
    );
};

export default Dropzone;
