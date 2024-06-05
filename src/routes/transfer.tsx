import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSpeechSynthesis } from 'react-speech-kit';
import { changeNumberToKorean } from '../utils/changeNumberToKorean';
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import PaymentPasswordModal from '../components/PaymentPasswordModal';
import { IAccount } from '../components/MyAccount';

const Wrapper = styled.div`
  padding: 60px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Title = styled.h2`
  display: inline-block;
  ${({ theme }) => theme.common.title};
`;

const Form = styled.form`
  padding: 30px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 48px;
    margin-right: 20px;
    color: ${({ theme }) => theme.colors.textGrey};
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
  }
`;

const Label = styled.label`
  font-size: 36px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textGrey};
  flex-shrink: 0;
`;

const Input = styled.input`
  padding: 10px 20px;
  margin-left: 30px;
  font-size: 28px;
  color: ${({ theme }) => theme.colors.main};
  border: 2px solid ${({ theme }) => theme.colors.main};
  border-radius: 4px;
  outline: none;
  flex-grow: 1;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textGrey};
  }

  /* For Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* For Firefox */
  -moz-appearance: textfield;
`;

const BtnContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const InputWithSubmit = styled.input`
  ${({ theme }) => theme.common.flexCenter};
  flex-grow: 1;
  height: 60px;
  font-size: 30px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.main};
  border: none;
  cursor: pointer;
`;

const CancelBtn = styled.button`
  flex-grow: 1;
  height: 60px;
  font-size: 30px;
  color: ${({ theme }) => theme.colors.white};
  border: none;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.red};
`;

const Error = styled.div<{ $visible: boolean }>`
  display: flex;
  justify-content: center;
  margin-top: 50px;
  padding: 10px;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.red};
  background-color: ${({ theme }) => theme.colors.bgDarkGrey};
  border-radius: 4px;
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
`;

interface FormState {
  receiver: string;
  amount: string;
  memo: string;
}

const Transfer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const account = location.state?.account as IAccount;
  const receiver = location.state.receiver || '';

  const { speak } = useSpeechSynthesis();
  const onSoundClick = (text: string) => {
    speak({ text });
  };

  const [isLoading, setLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>({
    receiver,
    amount: '',
    memo: '',
  });
  const [showPasswordModal, setPasswordModal] = useState<boolean>(false);
  const [receiverInfo, setReceiverInfo] = useState<{
    accountNumber: string;
    name: string;
  }>({ accountNumber: '', name: '' });
  const [error, setError] = useState<string>('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const { receiver, amount } = formState;
    if (isLoading || !receiver || !amount) return;

    if (formState.receiver === account.number) {
      setError('출금계좌와 입금계좌가 같습니다.');
      return;
    }

    if (+amount > account.valance) {
      setError(`잔액이 ${account.valance.toLocaleString()}원입니다.`);
      return;
    }

    try {
      setLoading(true);

      const accountQuery = query(
        collection(db, 'accounts'),
        where('number', '==', receiver)
      );

      const snapshot = await getDocs(accountQuery);

      if (snapshot.empty) {
        setError('입금계좌를 찾을 수 없습니다.');
        return;
      }

      const doc = snapshot.docs[0];
      setReceiverInfo({
        accountNumber: receiver,
        name: doc.data().username,
      });

      setPasswordModal(true);
    } catch (error) {
      console.error(error);
      setError('계좌 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const validatePaymentPassword = async (
    password: string
  ): Promise<boolean> => {
    try {
      const userQuery = query(
        collection(db, 'users'),
        where('userId', '==', account.userId)
      );

      const snapshot = await getDocs(userQuery);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0].data();
        return doc.paymentPassword === password;
      }

      return false;
    } catch (error) {
      setError('송금 중 오류가 발생했습니다.');
      return false;
    }
  };

  const updateTransaction = async () => {
    const { receiver, amount, memo } = formState;

    try {
      setLoading(true);

      const accountQuery = query(
        collection(db, 'accounts'),
        where('number', '==', receiver)
      );

      const receiverDoc = (await getDocs(accountQuery)).docs[0];

      const receiverRef = doc(db, 'accounts', receiverDoc.id);
      const senderRef = doc(db, 'accounts', account.id);

      const batch = writeBatch(db);

      batch.update(senderRef, {
        valance: account.valance - +amount,
      });

      batch.update(receiverRef, {
        valance: receiverDoc.data().valance + +amount,
      });

      batch.set(doc(collection(db, 'transactions')), {
        senderName: account.username,
        senderNumber: account.number,
        receiverName: receiverDoc.data().username,
        receiverNumber: receiver,
        amount: +amount,
        memo,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        deletedAt: null,
      });

      await batch.commit();

      navigate('/transfer-complete');
    } catch (error) {
      setError('송금 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    const isValid = await validatePaymentPassword(password);

    if (isValid) {
      await updateTransaction();
    }

    return isValid;
  };

  return (
    <Wrapper>
      <Title>송금하기</Title>
      <Form onSubmit={onSubmit} autoComplete="off">
        <InputBox>
          <svg
            onClick={() =>
              onSoundClick(
                `출금계좌: 실버뱅크 ${changeNumberToKorean(
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
          <Label>출금계좌: </Label>
          <Input
            type="text"
            value={`실버뱅크 ${account.number} (예금주명: ${account.username})`}
            readOnly
            required
          />
        </InputBox>

        <InputBox>
          <svg
            onClick={() =>
              onSoundClick(
                `입금계좌: 실버뱅크 ${changeNumberToKorean(formState.receiver)}`
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
          <Label htmlFor="receiver">입금계좌: </Label>
          <Input
            onChange={onChange}
            name="receiver"
            id="receiver"
            type="text"
            placeholder="계좌번호를 입력해 주세요. ex) 1234-5678-9123"
            value={formState.receiver}
            required
          />
        </InputBox>

        <InputBox>
          <svg
            onClick={() => onSoundClick(`보낼금액: ${formState.amount}원`)}
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
          <Label htmlFor="amount">보낼금액: </Label>
          <Input
            onChange={onChange}
            name="amount"
            id="amount"
            type="number"
            placeholder="보낼금액을 입력해 주세요."
            value={formState.amount}
            required
          />
        </InputBox>

        <InputBox>
          <svg
            onClick={() => onSoundClick(`메모: ${formState.memo}`)}
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
          <Label htmlFor="memo">
            메&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&thinsp;&thinsp;모:{' '}
          </Label>
          <Input
            onChange={onChange}
            name="memo"
            id="memo"
            type="text"
            value={formState.memo}
          />
        </InputBox>

        <Error $visible={error !== ''}>{'❌ ' + error || ' '}</Error>

        <BtnContainer>
          <InputWithSubmit type="submit" value="송금하기" />
          <CancelBtn onClick={() => navigate('/')}>송금취소</CancelBtn>
        </BtnContainer>
      </Form>

      {showPasswordModal && (
        <PaymentPasswordModal
          onClose={() => setPasswordModal(false)}
          onSubmit={handlePasswordSubmit}
          receiverInfo={receiverInfo}
        />
      )}
    </Wrapper>
  );
};

export default Transfer;
