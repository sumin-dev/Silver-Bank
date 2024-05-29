import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './routes/home';
import Login from './routes/login';
import CreateAccount from './routes/create-account';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Layout from './components/Layout.tsx';
import { auth } from './firebase.ts';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AuthLayout from './components/AuthLayout.tsx';
import Chart from './routes/chart.tsx';
import Profile from './routes/profile.tsx';
import Transfer from './routes/transfer.tsx';
import TransferComplete from './routes/transfer-complete.tsx';

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
        path: 'chart',
        element: <Chart />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'transfer',
        element: <Transfer />,
      },
      {
        path: 'transfer-complete',
        element: <TransferComplete />,
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

const GlobalStyles = createGlobalStyle`
${reset};
* {
  box-sizing: border-box;
  font-family: "Noto Sans KR", sans-serif;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-text-fill-color: #000;
  -webkit-box-shadow: 0 0 0px 1000px #f3f4f6 inset;
  transition: background-color 5000s ease-in-out 0s;
  font-family: "Noto Sans KR", sans-serif;
}
.modal-enter {
  transform: translate(-50%, -100%);
}
.modal-enter-active {
  transform: translate(-50%, 10px);
  transition: transform 500ms;
}
.modal-exit {
  transform: translate(-50%, 10px);
}
.modal-exit-active {
  transform: translate(-50%, -100%);
  transition: transform 500ms;
}
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
