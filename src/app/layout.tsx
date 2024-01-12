'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import storage from '@/utils/storage';

import '../styles/global.scss';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const tokens = storage.getToken();

    if (!tokens) {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
