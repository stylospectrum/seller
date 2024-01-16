import { useContext } from 'react';
import classNames from 'classnames';

import SidebarContext from './context';
import styles from './style/submenu.module.scss';

export interface SubmenuProps {
  id: string;
  name: string;
}

export default function Submenu(props: SubmenuProps) {
  const { selectedId, onSelect } = useContext(SidebarContext);

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles['wrapper-active']]: selectedId === props.id,
      })}
      onClick={() => onSelect(props.id)}
    >
      <div className={styles.text}>{props.name}</div>
    </div>
  );
}
