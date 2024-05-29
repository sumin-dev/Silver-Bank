import styled from 'styled-components';
import MyAccount from '../components/MyAccount';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { IAccount } from '../components/Timeline';
import { collection, getDocs, query, where } from 'firebase/firestore';
import LoadingScreen from '../components/LoadingScreen';
import UpdateUserInfoModal from '../components/UpdateUserInfoModal';

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
  const [showModal, setModal] = useState<boolean>(false);

  const onModalClose = () => {
    setModal(false);
  };

  const checkFirstLogin = async () => {
    if (!user) return;

    const userQuery = query(
      collection(db, 'users'),
      where('userId', '==', user.uid)
    );
    const snapshot = await getDocs(userQuery);

    if (!snapshot.docs.length) {
      setModal(true);
    }
  };

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
    checkFirstLogin();

    fetchAccount();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Wrapper>
      {showModal && <UpdateUserInfoModal onClose={onModalClose} />}
      <MyAccount account={account} setAccount={setAccount} />
    </Wrapper>
  );
};

export default Home;
