import React, { useRef } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

const Modal = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.bgDarkGrey};
  color: ${({ theme }) => theme.colors.textGrey};
  font-size: 20px;
  padding: 20px 40px;
  border-radius: 5px;
`;

interface CopyModalProps {
  copySuccess: boolean;
}

const CopyModal: React.FC<CopyModalProps> = ({ copySuccess }) => {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      in={copySuccess}
      timeout={300}
      classNames="modal"
      unmountOnExit
      nodeRef={nodeRef}
    >
      <Modal ref={nodeRef}>복사되었습니다!</Modal>
    </CSSTransition>
  );
};

export default CopyModal;
