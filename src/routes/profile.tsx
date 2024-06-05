import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../firebase';

const Wrapper = styled.div`
  padding: 60px;
`;

const Title = styled.h2`
  ${({ theme }) => theme.common.title};
`;

const LogoutBtn = styled.button`
  margin: 30px;
  width: 200px;
  height: 42px;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.red};
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
