import { useContext } from 'react';
import { Icon } from '@stylospectrum/ui';

import HeaderButton from '../HeaderButton';
import SplitPageContext from './context';
import styles from './style/detail.module.scss';

import '@stylospectrum/ui/dist/icon/data/menu';

export default function Detail({ children }: { children: React.ReactNode }) {
  const { collapsed, toggleCollapse } = useContext(SplitPageContext);

  return (
    <div className={styles.wrapper} style={{ width: collapsed ? '100%' : undefined }}>
      {collapsed && (
        <HeaderButton style={{ position: 'fixed', top: '0.31rem', left: '1rem' }}>
          <Icon name="menu" onClick={toggleCollapse} />
        </HeaderButton>
      )}
      {children}
    </div>
  );
}
