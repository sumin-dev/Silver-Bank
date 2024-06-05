import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IAccount } from '../components/MyAccount';
import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import LoadingScreen from '../components/LoadingScreen';
import { copyToClipboard } from '../utils/copyToClipboard';
import CopyModal from '../components/CopyModal';

const Wrapper = styled.div`
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TitleBox = styled.div``;

const Title = styled.h2`
  display: inline-block;
  ${({ theme }) => theme.common.title};
  margin-right: 20px;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 5px 10px;
  margin: 0 10px;
  font-size: 20px;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : theme.colors.black};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.main : theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.main};
  cursor: pointer;

  &:hover {
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.main : theme.colors.bgDarkGrey};
  }
`;

const GridContainer = styled.div`
  padding: 30px 30px 0px;
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr 1.5fr 2fr 2fr;
  width: 100%;
`;

const GridHeader = styled.div`
  ${({ theme }) => theme.common.flexCenter};
  height: 46px;
  background-color: ${({ theme }) => theme.colors.main};
  color: ${({ theme }) => theme.colors.white};
  padding: 18px;
  font-size: 22px;
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderGrey};
`;

const GridCell = styled.div`
  height: 46px;
  padding: 14px;
  text-align: left;
  font-size: 22px;
  color: ${({ theme }) => theme.colors.textGrey};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderGrey};
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.bgLightGrey};
  }
`;

const GridCellWithRed = styled(GridCell)`
  color: ${({ theme }) => theme.colors.red};
  text-align: right;
`;

const GridCellWithBlue = styled(GridCell)`
  color: ${({ theme }) => theme.colors.blue};
  text-align: right;
`;

const GridCellWithEmpty = styled(GridCell)`
  border-bottom: none;
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

const GridCellWithClick = styled(GridCell)`
  text-decoration: underline;
  cursor: pointer;
`;

const Pagination = styled.div<{ $visible: boolean }>`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
`;

const PageButton = styled.button<{ selected?: boolean }>`
  ${({ theme }) => theme.common.flexCenter};
  width: 40px;
  height: 40px;
  margin: 0 5px;
  font-size: 16px;
  color: ${({ selected, theme }) =>
    selected ? theme.colors.white : theme.colors.black};
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.main : theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.bgDarkGrey};
  cursor: ${({ selected }) => (selected ? 'default' : 'pointer')};

  &:hover {
    background-color: ${({ selected, theme }) =>
      selected ? theme.colors.main : theme.colors.bgLightGrey};
  }
`;

const PageButtonWithArrow = styled.button<{ disabled?: boolean }>`
  ${({ theme }) => theme.common.flexCenter};
  width: 40px;
  height: 40px;
  margin: 0 5px;
  color: ${({ disabled, theme }) =>
    disabled ? theme.colors.borderGrey : theme.colors.black};
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.colors.bgDarkGrey : theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.bgDarkGrey};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  &:hover {
    background-color: ${({ disabled, theme }) =>
      disabled ? theme.colors.bgDarkGrey : theme.colors.bgLightGrey};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

interface ITransaction {
  id: string;
  type: 'send' | 'receive';
  accountName: string;
  accountNumber: string;
  amount: string;
  date: string;
  memo: string;
}

const Transaction: React.FC = () => {
  const user = auth.currentUser;
  const [account, setAccount] = useState<IAccount | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    ITransaction[]
  >([]);
  const [filter, setFilter] = useState<'all' | 'send' | 'receive'>('all');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const fetchAccount = async () => {
    if (!user) return;

    setLoading(true);

    const accountQuery = query(
      collection(db, 'accounts'),
      where('userId', '==', user.uid)
    );

    const snapshot = await getDocs(accountQuery);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0].data();
      const account = {
        number: doc.number,
        username: doc.username,
        userId: doc.userId,
        valance: doc.valance,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        deletedAt: doc.deletedAt,
        id: snapshot.docs[0].id,
      };

      setAccount(account);
    }

    setLoading(false);
  };

  const fetchTransactions = async () => {
    if (!account) return;
    setLoading(true);

    try {
      const sendTransactionsQuery = query(
        collection(db, 'transactions'),
        where('senderNumber', '==', account.number)
      );

      const receiveTransactionsQuery = query(
        collection(db, 'transactions'),
        where('receiverNumber', '==', account.number)
      );

      const [sendSnapshot, receiveSnapshot] = await Promise.all([
        getDocs(sendTransactionsQuery),
        getDocs(receiveTransactionsQuery),
      ]);

      const transactionsDocs: DocumentData[] = [
        ...sendSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...receiveSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ];

      transactionsDocs.sort(
        (a, b) => b.createdAt.seconds - a.createdAt.seconds
      );

      const data = transactionsDocs.map((doc) => {
        if (account.number === doc.senderNumber) {
          return {
            id: doc.id,
            type: 'send',
            accountName: doc.receiverName,
            accountNumber: doc.receiverNumber,
            amount: doc.amount,
            date: doc.createdAt.toDate().toLocaleString(),
            memo: doc.memo,
          };
        }

        if (account.number === doc.receiverNumber) {
          return {
            id: doc.id,
            type: 'receive',
            accountName: doc.senderName,
            accountNumber: doc.senderNumber,
            amount: doc.amount,
            date: doc.createdAt.toDate().toLocaleString(),
            memo: doc.memo,
          };
        }
      }) as ITransaction[];

      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  useEffect(() => {
    if (account) fetchTransactions();
  }, [account]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter((transaction) => transaction.type === filter)
      );
    }

    setCurrentPage(1);
  }, [filter]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  return (
    <Wrapper>
      <TitleBox>
        <Title>거래내역</Title>
        <FilterButton
          $active={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          전체
        </FilterButton>
        <FilterButton
          $active={filter === 'receive'}
          onClick={() => setFilter('receive')}
        >
          입금
        </FilterButton>
        <FilterButton
          $active={filter === 'send'}
          onClick={() => setFilter('send')}
        >
          출금
        </FilterButton>
      </TitleBox>
      <GridContainer>
        <GridHeader>예금주명</GridHeader>
        <GridHeader>은행명</GridHeader>
        <GridHeader>계좌번호</GridHeader>
        <GridHeader>금액</GridHeader>
        <GridHeader>일시</GridHeader>
        <GridHeader>메모</GridHeader>
        {currentItems.map((transaction) => (
          <React.Fragment key={transaction.id}>
            <GridCell>{transaction.accountName}</GridCell>
            <GridCell>실버뱅크</GridCell>
            <GridCellWithClick
              onClick={() =>
                copyToClipboard(transaction.accountNumber, setCopySuccess)
              }
            >
              {transaction.accountNumber}
            </GridCellWithClick>
            {transaction.type === 'send' ? (
              <GridCellWithRed>{`- ${transaction.amount.toLocaleString()}`}</GridCellWithRed>
            ) : (
              <GridCellWithBlue>{`+ ${transaction.amount.toLocaleString()}`}</GridCellWithBlue>
            )}
            <GridCell>{transaction.date}</GridCell>
            <GridCell>{transaction.memo}</GridCell>
          </React.Fragment>
        ))}
        {currentItems.length < itemsPerPage &&
          Array.from({ length: itemsPerPage - currentItems.length }).map(
            (_, idx) => (
              <React.Fragment key={`empty-${idx}`}>
                <GridCellWithEmpty></GridCellWithEmpty>
                <GridCellWithEmpty></GridCellWithEmpty>
                <GridCellWithEmpty></GridCellWithEmpty>
                <GridCellWithEmpty></GridCellWithEmpty>
                <GridCellWithEmpty></GridCellWithEmpty>
                <GridCellWithEmpty></GridCellWithEmpty>
              </React.Fragment>
            )
          )}
      </GridContainer>
      <Pagination $visible={totalPages > 1}>
        <PageButtonWithArrow
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </PageButtonWithArrow>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <PageButton
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            selected={currentPage === idx + 1}
          >
            {idx + 1}
          </PageButton>
        ))}
        <PageButtonWithArrow
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </PageButtonWithArrow>
      </Pagination>
      <CopyModal copySuccess={copySuccess} />
    </Wrapper>
  );
};

export default Transaction;
