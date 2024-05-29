import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Error,
  Form,
  InputBox,
  InputWithPassword,
  InputWithSubmit,
  Label,
  Title,
  Wrapper,
} from './AuthComponents';
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

const InfoBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 2px solid #729d39;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-size: 24px;
  font-weight: 600;
  color: #729d39;
`;

const CancelBtn = styled.div`
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 28px;
  font-weight: 400;
  color: #ffffff;
  background: #729d39;
  border: none;
  cursor: pointer;
  background-color: #9095a0;
`;

interface PaymentPasswordModalProps {
  onClose: () => void;
  onSubmit: (password: string) => Promise<boolean>;
  receiverInfo: { accountNumber: string; name: string };
}

const PaymentPasswordModal: React.FC<PaymentPasswordModalProps> = ({
  onClose,
  onSubmit,
  receiverInfo,
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [paymentPassword, setPaymentPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPaymentPassword(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    setLoading(true);
    const isValid = await onSubmit(paymentPassword);
    setLoading(false);

    if (!isValid) {
      setError('비밀번호가 틀렸습니다.');
      return;
    }

    onClose();
  };

  const onNumberPadClick = (value: string) => {
    if (paymentPassword.length < 6) {
      setPaymentPassword((prev) => prev + value);
      setError('');
    }
  };

  const onNumberPadDelete = () => {
    setPaymentPassword((prev) => prev.slice(0, -1));
    setError('');
  };

  const onNumberPadClear = () => {
    setPaymentPassword('');
    setError('');
  };

  return (
    <Overlay>
      <Wrapper>
        <Title>송금 비밀번호를 눌러주세요!</Title>
        <InfoBox>
          {`입금계좌: ${receiverInfo.accountNumber} (예금주명: ${receiverInfo.name})`}
        </InfoBox>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <InputBox>
            <Label htmlFor="paymentPassword">송금 비밀번호 6자리</Label>
            <InputWithPassword
              onChange={onChange}
              name="paymentPassword"
              id="paymentPassword"
              value={paymentPassword}
              placeholder="비밀번호를 입력해 주세요."
              type="password"
              readOnly
            />
            <NumberPad
              onClick={onNumberPadClick}
              onDelete={onNumberPadDelete}
              onClear={onNumberPadClear}
            />
          </InputBox>
          <Error $visible={error !== ''}>{error || ' '}</Error>
          <InputWithSubmit
            type="submit"
            value={isLoading ? '처리 중...' : '송금하기'}
          />{' '}
          <CancelBtn onClick={onClose}>송금취소</CancelBtn>
        </Form>
      </Wrapper>
    </Overlay>
  );
};

export default PaymentPasswordModal;
