import React from 'react';
import styled from 'styled-components/macro';
import { useDrop } from 'react-dnd';

const Container = styled.div`
  align-items: center;
  border: 1px dashed;
  display: flex;
  height: 20vh;
  justify-content: center;
  min-height: 80px;
  padding: 20px 40px;
`;

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
    <Container ref={drop}>
      <strong>{canDrop && isOver ? hoverText : text}</strong>
    </Container>
  );
};

export default Dustbin;
