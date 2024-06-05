import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IAccount } from './MyAccount';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import LoadingScreen from './LoadingScreen';
import { useNavigate } from 'react-router-dom';
import { copyToClipboard } from '../utils/copyToClipboard';
import CopyModal from './CopyModal';

const Wrapper = styled.div`
  padding: 0px 60px;
`;

const TitleBox = styled.div``;

const Title = styled.h2`
  display: inline-block;
  ${({ theme }) => theme.common.title};
  margin-right: 20px;
`;

const SortingButton = styled.button<{ $active: boolean }>`
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

const InfoBox = styled.div`
  padding: 30px;
  font-size: 28px;
`;

const GridContainer = styled.div`
  padding: 30px 30px 0px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
`;

const GridHeader = styled.div`
  ${({ theme }) => theme.common.flexCenter};
  height: 46px;
  color: ${({ theme }) => theme.colors.black};
  padding: 18px;
  font-size: 22px;
  border-top: 1px solid ${({ theme }) => theme.colors.main};
  border-bottom: 1px solid ${({ theme }) => theme.colors.main};
`;

const GridCell = styled.div`
  ${({ theme }) => theme.common.flexCenter};
  height: 46px;
  padding: 18px;
  font-size: 22px;
  color: ${({ theme }) => theme.colors.textGrey};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderGrey};
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

const TransferBtn = styled.button`
  width: 200px;
  height: 40px;
  font-size: 22px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.main};
  border: none;
  cursor: pointer;
  &:hover,
  &:active {
    background: ${({ theme }) => theme.colors.mainWithHover};
  }
`;

const Pagination = styled.div<{ $visible: boolean }>`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
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
      selected ? theme.colors.main : theme.colors.bgDarkGrey};
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

interface SendedAccountsProps {
  account: IAccount | null;
}

interface ISendedAccounts {
  accountName: string;
  accountNumber: string;
  date: string;
  counts: number;
}

const SendedAccounts: React.FC<SendedAccountsProps> = ({ account }) => {
  const [accounts, setAccounts] = useState<ISendedAccounts[]>([]);
  const [sortedAccounts, setSortedAccounts] = useState<ISendedAccounts[]>([]);
  const [sorting, setSorting] = useState<'date' | 'accountName' | 'counts'>(
    'date'
  );
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchTransactions = async () => {
    if (!account) return;
    setLoading(true);

    try {
      const sendTransactionsQuery = query(
        collection(db, 'transactions'),
        where('senderNumber', '==', account.number),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(sendTransactionsQuery);

      const sendedAccountsObj: { [key: string]: ISendedAccounts } = {};
      if (!snapshot.empty) {
        snapshot.docs.map((doc) => {
          const data = doc.data();

          if (sendedAccountsObj[data.receiverNumber]) {
            sendedAccountsObj[data.receiverNumber].counts += 1;
          } else {
            sendedAccountsObj[data.receiverNumber] = {
              accountName: data.receiverName,
              accountNumber: data.receiverNumber,
              date: data.createdAt.toDate().toLocaleString(),
              counts: 1,
            };
          }
        });

        const sendedAccountsData = Object.values(
          sendedAccountsObj
        ) as ISendedAccounts[];
        setAccounts(sendedAccountsData);
        setSortedAccounts(sendedAccountsData);
      }
    } catch (error) {
      console.error('Error fetching transactions: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [account]);

  useEffect(() => {
    if (sorting === 'date') {
      setSortedAccounts([...accounts]);
    } else if (sorting === 'accountName') {
      setSortedAccounts(
        [...accounts].sort((a, b) => a.accountName.localeCompare(b.accountName))
      );
    } else if (sorting === 'counts') {
      setSortedAccounts([...accounts].sort((a, b) => b.counts - a.counts));
    }

    setCurrentPage(1);
  }, [sorting, accounts]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAccounts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedAccounts.length / itemsPerPage);

  return (
    <Wrapper>
      <TitleBox>
        <Title>송금한 계좌</Title>
        {account && (
          <>
            <SortingButton
              $active={sorting === 'date'}
              onClick={() => setSorting('date')}
            >
              최신순
            </SortingButton>
            <SortingButton
              $active={sorting === 'accountName'}
              onClick={() => setSorting('accountName')}
            >
              이름순
            </SortingButton>
            <SortingButton
              $active={sorting === 'counts'}
              onClick={() => setSorting('counts')}
            >
              송금횟수순
            </SortingButton>
          </>
        )}
      </TitleBox>
      {account ? (
        <>
          <GridContainer>
            <GridHeader>예금주명</GridHeader>
            <GridHeader>은행명</GridHeader>
            <GridHeader>계좌번호</GridHeader>
            <GridHeader></GridHeader>
            {currentItems.map((sendedAccount) => (
              <React.Fragment key={sendedAccount.accountNumber}>
                <GridCell>{sendedAccount.accountName}</GridCell>
                <GridCell>실버뱅크</GridCell>
                <GridCellWithClick
                  onClick={() =>
                    copyToClipboard(sendedAccount.accountNumber, setCopySuccess)
                  }
                >
                  {sendedAccount.accountNumber}
                </GridCellWithClick>
                <GridCell>
                  <TransferBtn
                    onClick={() => {
                      navigate('/transfer', {
                        state: {
                          account,
                          receiver: sendedAccount.accountNumber,
                        },
                      });
                    }}
                  >
                    송금하기
                  </TransferBtn>
                </GridCell>
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
        </>
      ) : (
        <InfoBox>송금한 계좌가 없습니다.</InfoBox>
      )}
      <CopyModal copySuccess={copySuccess} />
    </Wrapper>
  );
};

export default SendedAccounts;
