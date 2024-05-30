import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Header = styled.header`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0;
`;
export const Logo = styled.img`
  height: 40px;
`;

export const LogoText = styled.img`
  height: 40px;
`;

export default function HeaderBar() {
  return (
    <Header>
      <Link to={'/'}>
        Silver Bank
        <Logo src="/logo.png" />
        <LogoText src="/logo-text.png" />
      </Link>
    </Header>
  );
}
