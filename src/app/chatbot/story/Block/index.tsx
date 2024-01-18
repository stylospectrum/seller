import { MouseEvent, RefObject, useRef, useState } from 'react';
import { Button, Icon, Menu, MenuButton, MenuItem } from '@stylospectrum/ui';
import { ButtonDesign, IMenu } from '@stylospectrum/ui/dist/types';

import styles from './index.module.scss';

import '@stylospectrum/ui/dist/icon/data/home';
import '@stylospectrum/ui/dist/icon/data/response';
import '@stylospectrum/ui/dist/icon/data/fallback';
import '@stylospectrum/ui/dist/icon/data/post';
import '@stylospectrum/ui/dist/icon/data/delete';
import '@stylospectrum/ui/dist/icon/data/add';

interface BlockProps {
  type: string;
  title: string;
  id: string;
  chosen: boolean;
  onClick: (e: MouseEvent) => void;
}

export default function Block({ type, title, id, chosen, onClick }: BlockProps) {
  const [hover, setHover] = useState(false);
  const menuRef: RefObject<IMenu> = useRef(null);
  const data: { [key: string]: { [key1: string]: string } } = {
    START_POINT: {
      icon: 'home',
      text: 'Start point',
    },
    DEFAULT_FALLBACK: {
      icon: 'fallback',
      text: 'Default fallback',
    },
    BOT_RESPONSE: {
      icon: 'response',
      text: 'Bot response',
    },
    USER_INPUT: {
      icon: 'post',
    },
  };

  function handleMouseEnter() {
    setHover(true);
  }

  function handleMouseLeave() {
    setHover(false);
  }

  function handleAddButtonClick(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div
      className={styles.container}
      data-type={type}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {chosen && <div className={styles.chosen} />}
      <div>
        <div className={styles.title}>{title}</div>

        {hover && (
          <>
            {['BOT_RESPONSE', 'USER_INPUT'].includes(type) && (
              <MenuButton
                className={styles['menu-button']}
                onButtonClick={(e) => e.preventDefault()}
                onArrowClick={(e) => {
                  e.stopPropagation();
                  menuRef.current?.showAt((e as any).detail);
                }}
              >
                Edit name
              </MenuButton>
            )}
            <Button
              circle
              type={ButtonDesign.Secondary}
              icon="add"
              className={styles['add-button']}
              onClick={handleAddButtonClick}
            />
          </>
        )}

        {hover && (
          <Menu ref={menuRef}>
            <MenuItem icon="delete" onClick={() => console.log('delete', id)}>
              Delete
            </MenuItem>
          </Menu>
        )}

        <div className={styles.body} onClick={onClick}>
          <Icon name={data[type].icon} className={styles.icon} />
          {data[type].text && <div className={styles.text}>{data[type].text}</div>}
        </div>
      </div>
    </div>
  );
}
