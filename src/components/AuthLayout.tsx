import { Outlet } from 'react-router-dom';
import HeaderBar from './HeaderBar';

export default function AuthLayout() {
  return (
    <>
      <HeaderBar />
      <Outlet />
    </>
  );
}
