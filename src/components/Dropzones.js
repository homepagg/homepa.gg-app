import React from 'react';
import styled from 'styled-components/macro';
import { useDrop } from 'react-dnd';
import Dropzone from './Dropzone';

const Container = styled.div`
  display: ${(props) => (props.canDrop ? 'grid' : 'none')};
  grid-gap: 24px;
  grid-template: 0 / 1fr 1fr;
  list-style: none;
  margin: 0 36px;
  position: sticky;
  top: 24px;
  z-index: 1;
`;

const Dropzones = () => {
  const [{ canDrop }, container] = useDrop({
    accept: 'bookmark',
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Container canDrop={canDrop} ref={container}>
      <Dropzone action="edit" hoverText="Drop it!" text="Edit" />
      <Dropzone action="delete" hoverText="Drop it!" text="Delete" />
    </Container>
  );
};

export default Dropzones;
