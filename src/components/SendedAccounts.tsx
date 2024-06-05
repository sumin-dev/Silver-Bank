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
  margin-right: 20px;
  font-size: 36px;
  font-weight: 700;
  color: #171a1f;
`;

const SortingButton = styled.button<{ $active: boolean }>`
  padding: 5px 10px;
  margin: 0 10px;
  font-size: 20px;
  color: ${(props) => (props.$active ? '#ffffff' : '#171a1f')};
  background-color: ${(props) => (props.$active ? '#729d39' : '#ffffff')};
  border: 1px solid #729d39;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.$active ? '#6b8e23' : '#f2f2f2')};
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 46px;
  color: #171a1f;
  padding: 18px;
  font-size: 22px;
  border-top: 1px solid #729d39;
  border-bottom: 1px solid #729d39;
`;

const GridCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 46px;
  padding: 18px;
  font-size: 22px;
  color: #9095a0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid #ddd;
`;

const GridCellWithEmpty = styled(GridCell)`
  border-bottom: none;
  &:nth-child(even) {
    background-color: #ffffff;
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
  color: #ffffff;
  background: #729d39;
  border: none;
  cursor: pointer;
  &:hover,
  &:active {
    background: #36622b;
  }
`;

const Pagination = styled.div<{ $visible: boolean }>`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
`;

const PageButton = styled.button<{ selected?: boolean }>`
  width: 40px;
  height: 40px;
  margin: 0 5px;
  font-size: 16px;
  color: ${(props) => (props.selected ? '#ffffff' : '#171a1f')};
  background-color: ${(props) => (props.selected ? '#729d39;' : '#ffffff')};
  border: 1px solid #f0f0f0;
  cursor: ${(props) => (props.selected ? 'default' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) => (props.selected ? '#729d39;' : '#f2f2f2')};
  }
`;

const PageButtonWithArrow = styled.button<{ disabled?: boolean }>`
  width: 40px;
  height: 40px;
  margin: 0 5px;
  color: ${(props) => (props.disabled ? '#ccc' : '#171a1f')};
  background-color: ${(props) => (props.disabled ? '#f0f0f0' : '#ffffff')};
  border: 1px solid #f0f0f0;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) => (props.disabled ? '#f0f0f0' : '#f2f2f2')};
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
