import { useContext } from 'react';
import { Icon } from '@stylospectrum/ui';

import HeaderButton from '../HeaderButton';
import SplitPageContext from '../SplitPage/context';
import styles from './index.module.scss';

import '@stylospectrum/ui/dist/icon/data/menu';

export default function Header() {
  const { toggleCollapse } = useContext(SplitPageContext);

  return (
    <header className={styles.container}>
      <div className={styles.items}>
        <HeaderButton>
          <Icon name="menu" onClick={toggleCollapse} />
        </HeaderButton>
      </div>
    </header>
  );
}
