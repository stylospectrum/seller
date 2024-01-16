import { useState } from 'react';

import SidebarContext from './context';
import Menu from './Menu';
import menuData from './mockData';
import styles from './style/index.module.scss';

interface SidebarProps {
  defaultSelectedId: string;
  onSelect: (id: string) => void;
}

export default function Sidebar(props: SidebarProps) {
  const [selectedId, setSelectedId] = useState(props.defaultSelectedId || '');

  function handleSelect(id: string) {
    setSelectedId(id);
    props.onSelect(id);
  }

  return (
    <SidebarContext.Provider value={{ selectedId, onSelect: handleSelect }}>
      <ul className={styles.wrapper}>
        {menuData.map((menu) => (
          <Menu subMenus={menu.children as any} key={menu.id} name={menu.name} icon={menu.icon} />
        ))}
      </ul>
    </SidebarContext.Provider>
  );
}
