import React from 'react';
import cn from 'classnames';
import { useDrop } from 'react-dnd';

import Dropzone from './Dropzone';
import styles from './Dropzones.module.scss';

const Dropzones = () => {
    const [{ canDrop }, container] = useDrop({
        accept: 'bookmark',
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
        }),
    });

    return (
        <div
            className={cn(styles.zones, { [styles.droppable]: canDrop })}
            ref={container}
        >
            <Dropzone action="edit" hoverText="Drop it!" text="Edit" />
            <Dropzone action="delete" hoverText="Drop it!" text="Delete" />
        </div>
    );
};

export default Dropzones;
