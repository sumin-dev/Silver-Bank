import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 30px;
`;

const Title = styled.h2`
  display: inline-block;
  font-size: 36px;
  line-height: 48px;
  font-weight: 700;
  color: #171a1f;
`;

const AccountBtn = styled.button`
  width: 144px;
  height: 40px;
  font-size: 20px;
  color: #ffffff;
  background: #729d39;
  border: none;
  cursor: pointer;
  margin-left: 20px;
  &:hover,
  &:active {
    background: #36622b;
  }
`;

const InfoBox = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  row-gap: 15px;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 40px;
    margin-right: 10px;
    color: #9095a0;
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
  }
`;

const InfoText = styled.span`
  font-size: 32px;
  font-weight: 600;
  color: #9095a0;
  text-decoration: underline;
  cursor: pointer;
`;

export default function MyAccount() {
  return (
    <Wrapper>
      <Title>내 계좌</Title>
      <AccountBtn>+ 계좌 만들기</AccountBtn>
      <AccountBtn>송금하기</AccountBtn>
      <InfoBox>
        <Info>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
            />
          </svg>
          <InfoText>실버뱅크 1234-56-7890</InfoText>
        </Info>

        <Info>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
            />
          </svg>
          <InfoText>잔액: 50,000원</InfoText>
        </Info>
      </InfoBox>
    </Wrapper>
  );
}
