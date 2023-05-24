import React from 'react';
import ReactModal from 'react-modal';

import { ReactComponent as CancelSvg } from '../../images/icons/cancel.svg';

import styles from './Modal.module.scss';

const Modal = ({ children, closeModal, isOpen, title }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            className={styles.content}
            overlayClassName={styles.overlay}
        >
            <button
                className={styles.close}
                onClick={() => closeModal(!isOpen)}
                title="Close"
            >
                <CancelSvg />
            </button>
            <h1 className={styles.title}>{title}</h1>
            {children}
        </ReactModal>
    );
};

export default Modal;
