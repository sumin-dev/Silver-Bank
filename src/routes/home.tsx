import styled from 'styled-components';
import MyAccount from '../components/MyAccount';

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  overflow-y: scroll;
  grid-template-rows: 1fr 1.5fr;
`;

export default function Home() {
  return (
    <Wrapper>
      <MyAccount />
    </Wrapper>
  );
}
