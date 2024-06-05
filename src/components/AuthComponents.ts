import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  width: 637px;
  height: 600px;
  ${({ theme }) => theme.common.flexColumnCenter};
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.bgLightGrey};
  padding: 40px 60px;
`;

export const Title = styled.h1`
  ${({ theme }) => theme.common.title};
  line-height: 48px;
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
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.bgDarkGrey};
  border-width: 0px;
  outline: none;
  background-repeat: no-repeat;
  background-size: 24px;
  background-position: 20px;
`;

export const InputWithName = styled.input`
  ${commonInputStyles}
  background-image: url('/icons/name.svg');
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
  ${({ theme }) => theme.common.flexCenter};
  font-size: 18px;
  line-height: 28px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.main};
  border: none;
  cursor: pointer;
`;

export const Error = styled.div<{ $visible: boolean }>`
  height: 16px;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.red};
`;

export const Switcher = styled.span`
  margin-top: 20px;
  line-height: 22px;
  a {
    font-weight: 700;
    color: black;
  }
`;
