'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { userApi } from '@/api';
import { User } from '@/model';
import { useUserStore } from '@/store';
import storage from '@/utils/storage';

import '../styles/global.scss';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const userStore = useUserStore();

  useEffect(() => {
    const tokens = storage.getToken();

    const fetchUser = async () => {
      const response = await userApi.getUser();
      userStore.setUser(
        new User({
          id: response.id,
          name: response.name,
          email: response.email,
        }),
      );
    };

    if (!tokens) {
      router.push('/login');
    } else {
      fetchUser();
      router.push('/bot-builder/story');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
