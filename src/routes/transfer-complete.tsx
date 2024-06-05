import React, { useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Wrapper = styled.div`
  ${({ theme }) => theme.common.flexColumnCenter};
  justify-content: center;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.bgLightGrey};
  animation: ${fadeIn} 1s ease-in-out;
`;

const Title = styled.h1`
  font-size: 60px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.main};
  margin-bottom: 20px;
  animation: ${fadeIn} 1.5s ease-in-out;
`;

const Message = styled.p`
  font-size: 28px;
  color: ${({ theme }) => theme.colors.textGrey};
  margin-bottom: 40px;
  animation: ${fadeIn} 2s ease-in-out;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 30px;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.main};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.mainWithHover};
  }
`;

const TransferComplete: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const nodeRef = useRef(null);

  return (
    <CSSTransition
      in={true}
      appear={true}
      timeout={500}
      classNames="fade"
      nodeRef={nodeRef}
    >
      <Wrapper ref={nodeRef}>
        <Title>송금 완료!</Title>
        <Message>송금이 성공적으로 완료되었습니다.</Message>
        <Button onClick={handleHomeClick}>홈으로</Button>
      </Wrapper>
    </CSSTransition>
  );
};

export default TransferComplete;
