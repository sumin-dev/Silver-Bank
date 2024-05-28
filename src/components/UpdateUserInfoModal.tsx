import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Error,
  Form,
  InputBox,
  InputWithName,
  InputWithPassword,
  InputWithSubmit,
  Label,
  Title,
  Wrapper,
} from './AuthComponents';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../firebase';
import NumberPad from './NumberPad';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

interface FormState {
  username: string;
  paymentPassword: string;
}

interface UpdateUserInfoModalProps {
  onClose: () => void;
}

const UpdateUserInfoModal: React.FC<UpdateUserInfoModalProps> = ({
  onClose,
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>({
    username: '',
    paymentPassword: '',
  });
  const [error, setError] = useState<string>('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const user = auth.currentUser;
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const { username, paymentPassword } = formState;
    if (isLoading || !user || !username || !paymentPassword) return;

    const isSixDigitNumber = /^\d{6}$/.test(paymentPassword);

    if (!isSixDigitNumber) {
      setError('송금 비밀번호는 숫자 6자리로 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, 'users'), {
        userId: user.uid,
        username,
        paymentPassword,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: null,
      });

      onClose();
    } catch (error) {
      setError('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const onNumberPadClick = (value: string) => {
    if (formState.paymentPassword.length < 6) {
      setFormState((prev) => ({
        ...prev,
        ['paymentPassword']: formState.paymentPassword + value,
      }));
    }
  };

  const onNumberPadDelete = () => {
    setFormState((prev) => ({
      ...prev,
      ['paymentPassword']: formState.paymentPassword.slice(0, -1),
    }));
  };

  const onNumberPadClear = () => {
    setFormState((prev) => ({
      ...prev,
      ['paymentPassword']: '',
    }));
  };

  return (
    <Overlay>
      <Wrapper>
        <Title>처음 오셨군요! 👋</Title>
        <Form onSubmit={onSubmit} autoComplete="off">
          <InputBox>
            <Label htmlFor="username">이름 (예금주명)</Label>
            <InputWithName
              onChange={onChange}
              name="username"
              id="username"
              value={formState.username}
              placeholder="이름을 정확히 입력해 주세요."
              type="text"
              required
            />
          </InputBox>
          <InputBox>
            <Label htmlFor="paymentPassword">송금 비밀번호 6자리</Label>
            <InputWithPassword
              onChange={onChange}
              name="paymentPassword"
              id="paymentPassword"
              value={formState.paymentPassword}
              placeholder="비밀번호를 입력해 주세요."
              type="text"
              readOnly
            />
            <NumberPad
              onClick={onNumberPadClick}
              onDelete={onNumberPadDelete}
              onClear={onNumberPadClear}
            />
          </InputBox>
          <InputWithSubmit
            type="submit"
            value={isLoading ? '저장 중...' : '입력완료'}
          />{' '}
        </Form>
        <Error $visible={error !== ''}>{error || ' '}</Error>
      </Wrapper>
    </Overlay>
  );
};

export default UpdateUserInfoModal;
