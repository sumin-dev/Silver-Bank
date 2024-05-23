import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  width: 637px;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  padding: 40px 60px;
`;

export const Title = styled.h1`
  font-size: 32px;
  line-height: 48px;
  font-weight: 700;
  color: #171a1f;
`;

export const Form = styled.form`
  padding-top: 24px;
  padding-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const InputBox = styled.div``;

export const Label = styled.label`
  font-size: 18px;
  line-height: 28px;
  font-weight: 700;
`;

const commonInputStyles = css`
  padding: 0px 20px 0px 60px;
  width: 100%;
  height: 52px;
  font-size: 18px;
  line-height: 28px;
  background-color: #f3f4f6;
  border-width: 0px;
  outline: none;
  background-repeat: no-repeat;
  background-size: 24px;
  background-position: 20px;
`;

export const InputWithEmail = styled.input`
  ${commonInputStyles}
  background-image: url('/icons/email.svg');
`;

export const InputWithPassword = styled.input`
  ${commonInputStyles}
  background-image: url('/icons/password.svg');
`;

export const InputWithSubmit = styled.input`
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
`;

export const Error = styled.div<{ $visible: boolean }>`
  height: 16px;
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  line-height: 22px;
  a {
    font-weight: 700;
    color: black;
  }
`;
