import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import {
    EditableInput,
    Hue,
    Saturation,
} from 'react-color/lib/components/common/';
import { CustomPicker } from 'react-color';

import styles from './ColorPicker.module.css';

const Pointer = ({ className }) => {
    return <div className={className} />;
};

const ColorPicker = ({ classes, hsl, hsv, hex, onChange }) => {
    const [open, setOpen] = useState(false);
    const colorPicker = useRef();

    const HuePointer = () => <Pointer className={styles.huePointer} />;
    const SaturationPointer = () => (
        <Pointer className={styles.saturationPointer} />
    );

    const toggleShow = (event) => {
        event.preventDefault();
        setOpen(!open);
    };

    useEffect(() => {
        const handleClick = (event) =>
            !colorPicker.current.contains(event.target) && setOpen(false);

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className={cn(styles.container, classes)} ref={colorPicker}>
            <button className={styles.button} onClick={toggleShow}>
                <div className={styles.swatch} styles={{ '--color': hex }} />
                {hex}
            </button>
            <div className={cn(styles.picker, { [styles.open]: open })}>
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
