import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
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
import { handleFirebaseError } from '../utils/handleFirebaseError';

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    confirmPassword: '',
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
    setError('');

    const { email, password, confirmPassword } = formState;
    if (isLoading || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setLoading(true);

      await createUserWithEmailAndPassword(auth, email, password);

      // await updateProfile(credentials.user, {
      //   displayName: name,
      // });

      navigate('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(handleFirebaseError(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>회원가입</Title>
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

        <InputBox>
          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
          <InputWithPassword
            onChange={onChange}
            name="confirmPassword"
            id="confirmPassword"
            value={formState.confirmPassword}
            placeholder="비밀번호를 입력해 주세요."
            type="password"
            required
          />
        </InputBox>

        <InputWithSubmit
          type="submit"
          value={isLoading ? '회원가입 중...' : '가입완료'}
        />
      </Form>
      <Error $visible={error !== ''}>{error || ' '}</Error>
      <Switcher>
        <Link to={'/login'}>다른 계정으로 로그인하기</Link>
      </Switcher>
    </Wrapper>
  );
}
