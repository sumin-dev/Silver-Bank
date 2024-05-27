import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { IAccount } from './Timeline';
import { useSpeechSynthesis } from 'react-speech-kit';
import { changeNumberToKorean } from '../utils/changeNumberToKorean';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { generateAccountNumber } from '../utils/generateAccountNumber';
import { CSSTransition } from 'react-transition-group';

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
  font-size: 24px;
  color: #171a1f;
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
`;

const InfoTextWithClick = styled.span`
  font-size: 32px;
  font-weight: 600;
  color: #9095a0;
  text-decoration: underline;
  cursor: pointer;
`;

const Modal = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f3f4f6;
  color: #9095a0;
  font-size: 18px;
  padding: 20px 40px;
  border-radius: 5px;
`;

interface MyAccountProps {
  account?: IAccount | null;
}

const MyAccount: React.FC<MyAccountProps> = ({ account }) => {
  const { speak } = useSpeechSynthesis();
  const onSoundClick = (text: string) => {
    speak({ text });
  };

  const user = auth.currentUser;
  const onOpenAccountBtnClick = async () => {
    if (account || !user) return;
    const minValance = 1000000;
    const maxValance = 100000000;

    try {
      await addDoc(collection(db, 'accounts'), {
        number: generateAccountNumber(),
        valance: Math.floor(
          Math.random() * (maxValance - minValance) + minValance
        ),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: null,
        username: user.displayName,
        userId: user.uid,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const nodeRef = useRef(null);
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1000);
    } catch (error) {
      console.error('복사 실패!');
    }
  };

  return (
    <Wrapper>
      <Title>내 계좌</Title>
      {account ? (
        <AccountBtn>송금하기</AccountBtn>
      ) : (
        <AccountBtn onClick={onOpenAccountBtnClick}>+ 계좌 만들기</AccountBtn>
      )}
      <AccountBtn>거래내역 보기</AccountBtn>
      {account ? (
        <InfoBox>
          <Info>
            <svg
              onClick={() =>
                onSoundClick(`실버뱅크 ${changeNumberToKorean(account.number)}`)
              }
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
            <InfoTextWithClick
              onClick={() => copyToClipboard(`실버뱅크 ${account.number}`)}
            >{`실버뱅크 ${account.number}`}</InfoTextWithClick>
          </Info>

          <Info>
            <svg
              onClick={() => onSoundClick(`${account.valance} 원`)}
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
            <InfoText>{`${account.valance.toLocaleString()} 원`}</InfoText>
          </Info>
        </InfoBox>
      ) : (
        <InfoBox>계좌가 없습니다.</InfoBox>
      )}
      <CSSTransition
        in={copySuccess}
        timeout={300}
        classNames="modal"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <Modal ref={nodeRef}>복사되었습니다!</Modal>
      </CSSTransition>
    </Wrapper>
  );
};

export default MyAccount;
