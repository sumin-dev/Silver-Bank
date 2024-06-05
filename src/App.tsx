import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './routes/home';
import Login from './routes/login';
import CreateAccount from './routes/create-account';
import styled, { ThemeProvider } from 'styled-components';
import { useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Layout from './components/Layout.tsx';
import { auth } from './firebase.ts';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AuthLayout from './components/AuthLayout.tsx';
import Profile from './routes/profile.tsx';
import Transfer from './routes/transfer.tsx';
import TransferComplete from './routes/transfer-complete.tsx';
import Transaction from './routes/transaction.tsx';
import Chart from './routes/chart.tsx';
import GlobalStyles from './styles/globalStyles.ts';
import theme from './styles/theme.ts';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'transfer',
        element: <Transfer />,
      },
      {
        path: 'transfer-complete',
        element: <TransferComplete />,
      },
      {
        path: 'transaction',
        element: <Transaction />,
      },
      {
        path: 'chart',
        element: <Chart />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'create-account',
        element: <CreateAccount />,
      },
    ],
  },
]);

const Wrapper = styled.div`
  height: 100vh;
  min-width: 1400px;
  ${({ theme }) => theme.common.flexCenter};
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <GlobalStyles />
        {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
