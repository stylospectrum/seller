import { useState } from 'react';

import SplitPageContext from './context';
import Detail from './Detail';
import Master from './Master';
import styles from './style/index.module.scss';

export default function SplitPage({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  function toggleCollapse() {
    setCollapsed((prev) => !prev);
  }

  return (
    <SplitPageContext.Provider value={{ collapsed, toggleCollapse }}>
      <div className={styles.wrapper}>{children}</div>
    </SplitPageContext.Provider>
  );
}

SplitPage.Master = Master;
SplitPage.Detail = Detail;
