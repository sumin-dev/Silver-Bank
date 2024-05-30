import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../firebase';

const Wrapper = styled.div`
  padding: 60px;
`;

const Title = styled.h2`
  font-size: 40px;
  font-weight: 700;
  color: #171a1f;
`;

const LogoutBtn = styled.button`
  margin: 30px;
  width: 200px;
  height: 48px;
  font-size: 28px;
  color: #ffffff;
  background: tomato;
  border: none;
  cursor: pointer;
`;

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const onLogOut = async () => {
    const ok = confirm('로그아웃하시겠습니까?');

    if (ok) {
      await auth.signOut();
      navigate('/login');
    }
  };

  return (
    <Wrapper>
      <Title>설정</Title>
      <LogoutBtn onClick={onLogOut}>로그아웃</LogoutBtn>
    </Wrapper>
  );
};

export default Profile;
