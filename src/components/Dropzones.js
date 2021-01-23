import React from 'react';
import cx from 'classnames';
import { useDrop } from 'react-dnd';
import Dropzone from './Dropzone';
import styles from './Dropzones.module.css';

const Dropzones = () => {
  const [{ canDrop }, dropzones] = useDrop({
    accept: 'bookmark',
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={dropzones}
      className={cx(styles.dropzones, { [styles['is-visible']]: canDrop })}>
      <Dropzone action="edit" hoverText="Drop it!" text="Edit" />
      <Dropzone action="delete" hoverText="Drop it!" text="Delete" />
    </div>
  );
};

export default Dropzones;
