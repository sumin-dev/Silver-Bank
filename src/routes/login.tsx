import React, { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  Error,
  Form,
  InputBox,
  InputWithEmail,
  InputWithPassword,
  InputWithSubmit,
  Label,
  Switcher,
  Title,
  Wrapper,
} from '../components/AuthComponents';
import GoogleBtn from '../components/GoogleBtn';
import styled from 'styled-components';
import { handleFirebaseError } from '../utils/handleFirebaseError';

const Divider = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 20px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #dee1e6;
  }

  &::before {
    margin-right: 10px;
  }

  &::after {
    margin-left: 10px;
  }
`;

const DividerText = styled.span`
  line-height: 22px;
  color: #171a1f;
`;

interface FormState {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(' ');

    const { email, password } = formState;
    if (isLoading || !email || !password) return;

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      navigate('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error);
        setError(handleFirebaseError(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>오늘도 반가워요! 👋</Title>
      <Form onSubmit={onSubmit} autoComplete="off">
        <InputBox>
          <Label htmlFor="email">이메일</Label>
          <InputWithEmail
            onChange={onChange}
            name="email"
            id="email"
            value={formState.email}
            placeholder="이메일을 입력해 주세요."
            type="email"
            required
          />
        </InputBox>

        <InputBox>
          <Label htmlFor="password">비밀번호</Label>
          <InputWithPassword
            onChange={onChange}
            name="password"
            id="password"
            value={formState.password}
            placeholder="비밀번호를 입력해 주세요."
            type="password"
            required
          />
        </InputBox>

        <InputWithSubmit
          type="submit"
          value={isLoading ? '로그인 중...' : '로그인'}
        />
      </Form>
      <Error $visible={error !== ''}>{error || ' '}</Error>
      <Divider>
        <DividerText>또는</DividerText>
      </Divider>
      <GoogleBtn />
      <Switcher>
        실버뱅크가 처음이세요? <Link to={'/create-account'}>회원가입하기</Link>
      </Switcher>
    </Wrapper>
  );
}
