import React from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components/macro';
import { ReactComponent as CancelSvg } from '../images/icons/cancel.svg';

const modalStyles = {
  content: {
    backgroundColor: 'transparent',
    borderWidth: '0',
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    maxWidth: '400px',
    padding: '20px',
    position: 'relative',
    width: '100%',
    zIndex: '11',
  },
  overlay: {
    backgroundColor: 'hsl(var(--color-secondary))',
    bottom: '0',
    display: 'flex',
    left: '0',
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'fixed',
    right: '0',
    top: '0',
    zIndex: '10',
  },
};

const Close = styled.button`
  font-size: 24px;
  height: 40px;
  position: fixed;
  right: 0;
  top: 0;
  transform: translateX(-1px);
  width: 40px;
  z-index: 1;

  &::after {
    border-radius: 0;
    opacity: 0;
  }

  svg {
    display: block;
    height: 100%;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0 0 12px;
  text-transform: none;
`;

const Modal = ({ children, closeModal, isOpen, title }) => {
  return (
    <ReactModal isOpen={isOpen} style={modalStyles}>
      <Close onClick={() => closeModal(!isOpen)} title="Close">
        <CancelSvg />
      </Close>
      <Title>{title}</Title>
      {children}
    </ReactModal>
  );
};

export default Modal;
