import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import {
  EditableInput,
  Hue,
  Saturation,
} from 'react-color/lib/components/common/';
import { CustomPicker } from 'react-color';
import styles from './ColorPicker.module.css';

export const HuePointer = () => {
  return <div className={styles.huePointer} />;
};

export const SaturationPointer = () => {
  return <div className={styles.satPointer} />;
};

const ColorPicker = ({ classes, hsl, hsv, hex, onChange }) => {
  const [shows, setShow] = useState(false);
  const colorPicker = useRef();

  const toggleShow = (event) => {
    event.preventDefault();
    setShow(!shows);
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (colorPicker.current.contains(event.target)) return;
      setShow(false);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className={cx(styles.container, classes)} ref={colorPicker}>
      <button className={styles.button} onClick={toggleShow}>
        <span className={styles.swatch} style={{ backgroundColor: hex }} />
        {hex}
      </button>
      <div className={styles.picker} style={{ display: shows ? '' : 'none' }}>
        <div className={styles.saturation}>
          <Saturation
            hsl={hsl}
            hsv={hsv}
            pointer={SaturationPointer}
            onChange={onChange}
          />
        </div>
        <div className={styles.hue}>
          <Hue
            hsl={hsl}
            direction="vertical"
            pointer={HuePointer}
            onChange={onChange}
          />
        </div>
        <div className={styles.input}>
          <EditableInput value={hex} onChange={onChange} />
        </div>
      </div>
    </div>
  );
};

export default CustomPicker(ColorPicker);
