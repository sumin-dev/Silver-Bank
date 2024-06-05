import React, { useState } from 'react';
import styled from 'styled-components';
import { useSpeechSynthesis } from 'react-speech-kit';
import { changeNumberToKorean } from '../utils/changeNumberToKorean';
import {
  doc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { generateAccountNumber } from '../utils/generateAccountNumber';
import { useNavigate } from 'react-router-dom';
import { copyToClipboard } from '../utils/copyToClipboard';
import CopyModal from './CopyModal';

const Wrapper = styled.div`
  padding: 60px;
`;

const Title = styled.h2`
  display: inline-block;
  font-size: 36px;
  font-weight: 700;
  color: #171a1f;
`;

const AccountBtn = styled.button`
  width: 200px;
  height: 42px;
  font-size: 24px;
  color: #ffffff;
  background: #729d39;
  border: none;
  cursor: pointer;
  margin-left: 20px;
  &:hover,
  &:active {
    background: #6b8e23;
  }
`;

const InfoBox = styled.div`
  padding: 30px 30px 0px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  font-size: 28px;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 42px;
    margin-right: 20px;
    color: #9095a0;
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
  }
`;

const InfoText = styled.span`
  font-size: 36px;
  font-weight: 500;
  color: #9095a0;
`;

const InfoTextWithClick = styled.span`
  font-size: 36px;
  font-weight: 500;
  color: #9095a0;
  text-decoration: underline;
  cursor: pointer;
`;

export interface IAccount {
  id: string;
  number: string;
  username: string;
  userId: string;
  valance: number;
  createdAt: any;
  updatedAt: any;
  deletedAt: any | null;
}

interface MyAccountProps {
  account: IAccount | null;
  setAccount: React.Dispatch<React.SetStateAction<IAccount | null>>;
}

const MyAccount: React.FC<MyAccountProps> = ({ account, setAccount }) => {
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
      const userQuery = query(
        collection(db, 'users'),
        where('userId', '==', user.uid)
      );

      const snapshot = await getDocs(userQuery);
      const userDoc = snapshot.docs[0];

      const newAccount = {
        id: userDoc.id,
        number: generateAccountNumber(),
        valance: Math.floor(
          Math.random() * (maxValance - minValance) + minValance
        ),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        deletedAt: null,
        username: userDoc.data().username,
        userId: user.uid,
      };

      const batch = writeBatch(db);

      batch.set(doc(collection(db, 'accounts')), newAccount);

      batch.set(doc(collection(db, 'transactions')), {
        senderName: '은행장',
        senderNumber: '0287-6250-7205',
        receiverName: newAccount.username,
        receiverNumber: newAccount.number,
        amount: newAccount.valance,
        memo: '계좌 개설 축하금',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        deletedAt: null,
      });

      batch.set(doc(collection(db, 'transactions')), {
        senderName: newAccount.username,
        senderNumber: newAccount.number,
        receiverName: '관리자',
        receiverNumber: '0757-4055-7524',
        amount: 1000000,
        memo: '출금 샘플 데이터 (관리자)',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        deletedAt: null,
      });

      batch.set(doc(collection(db, 'transactions')), {
        senderName: newAccount.username,
        senderNumber: newAccount.number,
        receiverName: '은행장',
        receiverNumber: '0287-6250-7205',
        amount: 5000,
        memo: '출금 샘플 데이터 (은행장)',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        deletedAt: null,
      });

      batch.set(doc(collection(db, 'transactions')), {
        senderName: newAccount.username,
        senderNumber: newAccount.number,
        receiverName: '황수민',
        receiverNumber: '6355-0686-0415',
        amount: 10000,
        memo: '출금 샘플 데이터 (황수민)',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        deletedAt: null,
      });

      batch.set(doc(collection(db, 'transactions')), {
        senderName: newAccount.username,
        senderNumber: newAccount.number,
        receiverName: '개발자',
        receiverNumber: '8685-4513-2202',
        amount: 28000,
        memo: '출금 샘플 데이터 (개발자)',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        deletedAt: null,
      });

      batch.set(doc(collection(db, 'transactions')), {
        senderName: newAccount.username,
        senderNumber: newAccount.number,
        receiverName: '오감자',
        receiverNumber: '8846-4875-3545',
        amount: 77000,
        memo: '출금 샘플 데이터 (오감자)',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        deletedAt: null,
      });

      batch.set(doc(collection(db, 'transactions')), {
        senderName: newAccount.username,
        senderNumber: newAccount.number,
        receiverName: '자갈치',
        receiverNumber: '5090-8612-0990',
        amount: 131000,
        memo: '출금 샘플 데이터 (자갈치)',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        deletedAt: null,
      });

      await batch.commit();

      setAccount(newAccount);
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();
  const onTransferClick = () => {
    navigate('/transfer', { state: { account } });
  };
  const onTransactionClick = () => {
    navigate('/transaction');
  };

  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  return (
    <Wrapper>
      <Title>내 계좌</Title>
      {account ? (
        <>
          <AccountBtn onClick={onTransferClick}>송금하기</AccountBtn>
          <AccountBtn onClick={onTransactionClick}>거래내역</AccountBtn>
        </>
      ) : (
        <AccountBtn onClick={onOpenAccountBtnClick}>+ 계좌 만들기</AccountBtn>
      )}

      {account ? (
        <InfoBox>
          <Info>
            <svg
              onClick={() =>
                onSoundClick(
                  `실버뱅크 ${changeNumberToKorean(
                    account.number
                  )} (예금주명: ${account.username})`
                )
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
              onClick={() => copyToClipboard(account.number, setCopySuccess)}
            >{`실버뱅크 ${account.number} (예금주명: ${account.username})`}</InfoTextWithClick>
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
      <CopyModal copySuccess={copySuccess} />
    </Wrapper>
  );
};

export default MyAccount;
