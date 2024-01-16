import { useContext } from 'react';

import SplitPageContext from './context';
import styles from './style/master.module.scss';

export default function Master({ children }: { children: React.ReactNode }) {
  const { collapsed } = useContext(SplitPageContext);

  if (collapsed) {
    return null;
  }

  return <div className={styles.wrapper}>{children}</div>;
}
