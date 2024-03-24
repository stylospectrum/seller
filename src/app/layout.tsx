'use client';

import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { userApi } from '@/api';
import { queryClient } from '@/lib/react-query';
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

      if (!response) {
        return;
      }

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
      <body>
        <QueryClientProvider client={queryClient}>{children} </QueryClientProvider>
      </body>
    </html>
  );
}
