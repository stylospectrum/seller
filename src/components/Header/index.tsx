import { RefObject, useContext, useRef } from 'react';
import { Avatar, Icon, ListItem, Popover } from '@stylospectrum/ui';
import { IPopover } from '@stylospectrum/ui/dist/types';

import HeaderButton from '../HeaderButton';
import SplitPageContext from '../SplitPage/context';
import styles from './index.module.scss';
import { useAuthStore } from '@/store';
import storage from '@/utils/storage';

import '@stylospectrum/ui/dist/icon/data/menu';
import '@stylospectrum/ui/dist/icon/data/log';

export default function Header() {
  const { toggleCollapse } = useContext(SplitPageContext);
  const popoverRef: RefObject<IPopover> = useRef(null);
  const accountBtnDomRef: RefObject<any> = useRef(null);
  const authStore = useAuthStore();

  const handleLogout = () => {
    authStore.setAccessToken('');
    storage.clearToken();
    window.location.assign(window.location.origin as unknown as string);
  };

  return (
    <>
      <header className={styles.container}>
        <div className={styles.items}>
          <HeaderButton>
            <Icon name="menu" onClick={toggleCollapse} />
          </HeaderButton>
          <Avatar
            ref={accountBtnDomRef}
            initials="FJ"
            interactive
            style={{ width: '2rem', height: '2rem' }}
            onClick={() => popoverRef.current?.showAt(accountBtnDomRef.current)}
          />
        </div>
      </header>

      <Popover ref={popoverRef} hideFooter>
        <div style={{ width: '12.37500rem' }}>
          <ListItem icon="log" onClick={handleLogout}>
            Logout
          </ListItem>
        </div>
      </Popover>
    </>
  );
}
