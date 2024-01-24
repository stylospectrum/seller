'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';

import { Header, Sidebar, SplitPage } from '@/components';
import storage from '@/utils/storage';

import '../styles/global.scss';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState('');
  const router = useRouter();
  const segs = useSelectedLayoutSegments();

  useEffect(() => {
    const tokens = storage.getToken();
    setAccessToken(tokens?.accessToken);

    if (!tokens) {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en">
      <body>
        {accessToken ? (
          <SplitPage>
            <SplitPage.Master>
              <Header />
              <Sidebar
                defaultSelectedId={`/${segs.join('/')}`}
                onSelect={(id) => router.push(id)}
              />
            </SplitPage.Master>
            <SplitPage.Detail>{children}</SplitPage.Detail>
          </SplitPage>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
