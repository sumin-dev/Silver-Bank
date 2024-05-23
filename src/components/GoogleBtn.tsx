import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../firebase';

const Logo = styled.img`
  height: 50px;
  cursor: pointer;
`;

export default function GoogleBtn() {
  const navigate = useNavigate();

  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return <Logo src="/google-logo.svg" onClick={onClick} />;
}
