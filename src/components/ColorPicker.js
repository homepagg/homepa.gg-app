import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import {
  EditableInput,
  Hue,
  Saturation,
} from 'react-color/lib/components/common/';
import { CustomPicker } from 'react-color';

const Button = styled.button`
  display: block;
`;

const Container = styled.div`
  display: flex;
  position: relative;
`;

const HueSat = styled.div`
  position: relative;
  z-index: 0;
`;

const HueContainer = styled(HueSat)`
  grid-area: hue;
`;

const HuePointer = styled.div`
  background-color: #fff;
  border: 1px solid #333;
  height: 3px;
  left: -1px;
  position: absolute;
  top: -1px;
  width: 24px;
`;

const Input = styled.div`
  grid-column: span 2;
  input {
    background-color: #eee;
    border: 0;
    font-size: 1.1rem;
    height: 2rem;
    line-height: 2rem;
    padding: 0;
    text-align: center;
  }
`;

const Picker = styled.div`
  background-color: #fff;
  border: 1px solid #333;
  border-radius: 3px;
  display: ${(props) => (props.shows ? 'grid' : 'none')};
  grid-gap: 5px;
  grid-template:
    'saturation hue' 110px
    'input input' auto
    / 1fr 22px;
  min-width: 16rem;
  padding: 1rem;
  position: absolute;
  transform: translate(-1.65rem, 2.7rem);
  z-index: 1;

  &::after,
  &::before {
    border-color: transparent;
    border-style: solid;
    border-width: 0 0.8rem 0.8rem;
    content: '';
    left: 2.1rem;
    position: absolute;
  }

  &::after {
    border-bottom-color: #333;
    bottom: calc(100% + 1px);
    z-index: 0;
  }

  &::before {
    border-bottom-color: #fff;
    bottom: 100%;
    z-index: 1;
  }
`;

const SaturationPointer = styled.div`
  background-color: #000;
  border: 1px solid #fff;
  border-radius: 50%;
  height: 8px;
  transform: translate(-50%, -50%);
  width: 8px;
`;

const SaturationContainer = styled(HueSat)`
  grid-area: saturation;
`;

const Swatch = styled.div`
  background-color: ${(props) => props.color};
  border-radius: 3px;
  display: block;
  height: 1.5em;
  overflow: hidden;
  width: 2em;

  &::before {
    bottom: 0;
    content: '';
    cursor: pointer;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
  }
`;

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
    <Container ref={colorPicker}>
      <Button onClick={toggleShow}>
        <Swatch color={hex} />
        {hex}
      </Button>
      <Picker shows={shows}>
        <SaturationContainer>
          <Saturation
            hsl={hsl}
            hsv={hsv}
            pointer={SaturationPointer}
            onChange={onChange}
          />
        </SaturationContainer>
        <HueContainer>
          <Hue
            hsl={hsl}
            direction="vertical"
            pointer={HuePointer}
            onChange={onChange}
          />
        </HueContainer>
        <Input>
          <EditableInput value={hex} onChange={onChange} />
        </Input>
      </Picker>
    </Container>
  );
};

export default CustomPicker(ColorPicker);
