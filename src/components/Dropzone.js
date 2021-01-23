import React from 'react';
import cx from 'classnames';
import { useDrop } from 'react-dnd';
import styles from './Dropzone.module.css';

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
    <div ref={drop} className={cx(styles.dropper)}>
      <strong>{canDrop && isOver ? hoverText : text}</strong>
    </div>
  );
};

export default Dustbin;
