'use client';

import { useRouter, useSelectedLayoutSegments } from 'next/navigation';

import { Header, Sidebar, SplitPage } from '@/components';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segs = useSelectedLayoutSegments();

  return (
    <SplitPage>
      <SplitPage.Master>
        <Header />
        <Sidebar defaultSelectedId={`/${segs.join('/')}`} onSelect={(id) => router.push(id)} />
      </SplitPage.Master>
      <SplitPage.Detail>{children}</SplitPage.Detail>
    </SplitPage>
  );
}
