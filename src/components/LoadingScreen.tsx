import styled, { keyframes } from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  border: 16px solid ${({ theme }) => theme.colors.borderGrey};
  border-top: 16px solid ${({ theme }) => theme.colors.main};
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: ${spin} 2s linear infinite;
`;

export default function LoadingScreen() {
  return (
    <Wrapper>
      <Spinner />
    </Wrapper>
  );
}
