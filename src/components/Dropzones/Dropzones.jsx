import React from 'react';
import cn from 'classnames';
import { useDroppable } from '@dnd-kit/core';

import Dropzone from './Dropzone';
import styles from './Dropzones.module.css';

const Dropzones = () => {
    const { setNodeRef, isOver, over } = useDroppable({
        id: 'dropzones',
    });

    const show = isOver || ['dropzone-delete', 'dropzone-edit'].includes(over?.id);

    return (
        <div
            ref={setNodeRef}
            className={cn(styles.zones, { [styles.droppable]: show })}
        >
            <Dropzone action="dropzone-edit" hoverText="Drop it!" text="Edit" />
            <Dropzone
                action="dropzone-delete"
                hoverText="Drop it!"
                text="Delete"
            />
        </div>
    );
};

export default Dropzones;
