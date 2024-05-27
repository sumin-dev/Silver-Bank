import styled from 'styled-components';
import MyAccount from '../components/MyAccount';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { IAccount } from '../components/Timeline';
import { collection, getDocs, query, where } from 'firebase/firestore';
import LoadingScreen from '../components/LoadingScreen';

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  overflow-y: scroll;
  grid-template-rows: 1fr 1.5fr;
`;

const Home: React.FC = () => {
  const user = auth.currentUser;
  const [account, setAccount] = useState<IAccount | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  const fetchAccount = async () => {
    if (!user) return;

    setLoading(true);

    const accountQuery = query(
      collection(db, 'accounts'),
      where('userId', '==', user.uid)
    );

    const snapshot = await getDocs(accountQuery);

    if (snapshot.docs.length) {
      const doc = snapshot.docs[0].data();
      const {
        number,
        username,
        userId,
        valance,
        createdAt,
        updatedAt,
        deletedAt,
      } = doc;
      const account = {
        number,
        username,
        userId,
        valance,
        createdAt,
        updatedAt,
        deletedAt,
        id: snapshot.docs[0].id,
      };

      setAccount(account);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Wrapper>
      <MyAccount account={account} />
    </Wrapper>
  );
};

export default Home;
