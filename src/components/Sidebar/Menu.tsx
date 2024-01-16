import { useState } from 'react';
import { Icon } from '@stylospectrum/ui';

import styles from './style/menu.module.scss';
import Submenu, { SubmenuProps } from './Submenu';

import '@stylospectrum/ui/dist/icon/data/circle-task';
import '@stylospectrum/ui/dist/icon/data/navigation-down-arrow';
import '@stylospectrum/ui/dist/icon/data/navigation-up-arrow';

interface MenuProps {
  name: string;
  icon: string;
  subMenus: SubmenuProps[];
}

export default function Menu(props: MenuProps) {
  const [collapsed, setCollapsed] = useState(false);

  function toggleCollapse() {
    setCollapsed((prev) => !prev);
  }

  return (
    <>
      <div className={styles.wrapper} onClick={toggleCollapse}>
        <div className={styles.icon}>
          <Icon name={props.icon} />
        </div>

        <div className={styles.text}>{props.name}</div>

        <div className={styles.spacer} />

        <div className={styles.arrow}>
          <Icon name={collapsed ? 'navigation-up-arrow' : 'navigation-down-arrow'} />
        </div>
      </div>

      {collapsed || (
        <div className={styles['sub-menu']}>
          {props.subMenus.map((child) => (
            <Submenu key={child.id} {...child} />
          ))}
        </div>
      )}
    </>
  );
}
