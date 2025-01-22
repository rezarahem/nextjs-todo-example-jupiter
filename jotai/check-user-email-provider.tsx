'use client';

import { useAtomValue } from 'jotai';
import { userIdAtom } from './user-id-atom';
import Login from '@/components/auth/login';

export const CheckUserEmailProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const id = useAtomValue(userIdAtom);
  return <>{id ? children : <Login />}</>;
};
