import {
  KeyboardEvent,
  MouseEvent,
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button, Icon, Input, Menu, MenuButton, MenuItem, MessageBox } from '@stylospectrum/ui';
import { ButtonDesign, IButton, IInput, IMenu } from '@stylospectrum/ui/dist/types';

import { BotBuilderContext } from '../context';
import SearchInPopover, { SearchInPopoverRef } from '../SearchInPopover';
import { Box } from '../utils/box';
import { CustomHierarchyNode } from '../utils/hierarchy';
import styles from './index.module.scss';
import { botBuilderStoryApi } from '@/api';
import { BotStoryBlockType } from '@/enums';
import Portal from '@/utils/Portal';

import '@stylospectrum/ui/dist/icon/data/add';
import '@stylospectrum/ui/dist/icon/data/delete';
import '@stylospectrum/ui/dist/icon/data/fallback';
import '@stylospectrum/ui/dist/icon/data/home';
import '@stylospectrum/ui/dist/icon/data/post';
import '@stylospectrum/ui/dist/icon/data/response';
import '@stylospectrum/ui/dist/icon/data/move';
import '@stylospectrum/ui/dist/icon/data/filter';

interface BlockProps extends CustomHierarchyNode<Box> {
  chosen: boolean;
  onClick: (e: MouseEvent) => void;
  name: string;
}

const blockTemplate: { [key: string]: { [key1: string]: string } } = {
  [BotStoryBlockType.StartPoint]: {
    icon: 'home',
    text: 'Start point',
  },
  [BotStoryBlockType.DefaultFallback]: {
    icon: 'fallback',
    text: 'Default fallback',
  },
  [BotStoryBlockType.BotResponse]: {
    icon: 'response',
    text: 'Bot response',
  },
  [BotStoryBlockType.UserInput]: {
    icon: 'post',
  },
  [BotStoryBlockType.Filter]: {
    icon: 'filter',
    text: 'Filter',
  },
  [BotStoryBlockType.Fallback]: {
    icon: 'fallback',
    text: 'Fallback',
  },
};

export default function Block({ data, chosen, onClick, name }: BlockProps) {
  const [innerName, setInnerName] = useState(name);
  const [msgBoxOpened, setMsgBoxOpened] = useState(false);
  const [hover, setHover] = useState(false);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [editName, setEditName] = useState(false);
  const menuRef: RefObject<IMenu> = useRef(null);
  const editNameInputRef: RefObject<IInput> = useRef(null);
  const searchInPopoverRef: RefObject<SearchInPopoverRef> = useRef(null);
  const addButtonRef: RefObject<IButton> = useRef(null);
  const { changeRawBlock } = useContext(BotBuilderContext);
  const isDeleteMany = useMemo(
    () => data.children.length > 0 && data.type !== BotStoryBlockType.Filter,
    [data],
  );
  const enableAdd = useMemo(
    () =>
      data.type !== BotStoryBlockType.StartPoint &&
      data.type !== BotStoryBlockType.DefaultFallback &&
      data.parent?.type !== BotStoryBlockType.DefaultFallback &&
      data.parent?.type !== BotStoryBlockType.Fallback &&
      !(
        [BotStoryBlockType.Filter, BotStoryBlockType.Fallback].includes(data.type) &&
        data.children.length > 0
      ),
    [data],
  );
  const enableMenu = useMemo(
    () =>
      data.type !== BotStoryBlockType.StartPoint &&
      data.type !== BotStoryBlockType.DefaultFallback &&
      data.parent?.type !== BotStoryBlockType.StartPoint &&
      data.parent?.type !== BotStoryBlockType.DefaultFallback,
    [data],
  );
  const enableDelete = useMemo(
    () =>
      !(
        data.parent?.type === BotStoryBlockType.UserInput &&
        data.children?.[0]?.type === BotStoryBlockType.UserInput
      ),
    [data],
  );

  useEffect(() => {
    if (editName) {
      setTimeout(() => {
        editNameInputRef.current?.shadowRoot?.querySelector('input')?.focus();
      });
    }
  }, [editName]);

  function handleAddButtonClick(e: MouseEvent) {
    e.stopPropagation();
    setPopoverOpened(true);
    searchInPopoverRef.current?.open?.(addButtonRef.current!, data.id);
  }

  async function handleConfirmDelete() {
    const res = await botBuilderStoryApi.deleteStoryBlock({
      id: data.id,
      isDeleteMany,
    });
    changeRawBlock(res!);
    setMsgBoxOpened(false);
  }

  async function handleEditName(val: string) {
    const res = await botBuilderStoryApi.updateStoryBlock({
      id: data.id,
      name: val,
    });
    setInnerName(res!.name!);
    setEditName(false);
  }

  useEffect(() => {
    setInnerName(name);
  }, [name]);

  return (
    <>
      <div
        className={styles.container}
        data-type={data.type}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          if (popoverOpened) return;
          setHover(false);
        }}
      >
        {chosen && <div className={styles.chosen} />}
        <div>
          {editName ? (
            <Input
              ref={editNameInputRef}
              className={styles['edit-name-input']}
              defaultValue={innerName}
              onBlur={() => setEditName(false)}
              onEscape={() => setEditName(false)}
              onEnter={(e) => handleEditName((e as any).detail)}
            />
          ) : (
            <div className={styles.title}>{innerName}</div>
          )}

          {hover && !editName && (
            <>
              {enableMenu && (
                <MenuButton
                  className={styles['menu-button']}
                  onButtonClick={(e) => {
                    e.preventDefault();
                    setEditName(true);
                  }}
                  onArrowClick={(e) => {
                    e.stopPropagation();
                    menuRef.current?.showAt((e as any).detail);
                  }}
                >
                  Edit name
                </MenuButton>
              )}
              {enableAdd && (
                <Button
                  ref={addButtonRef}
                  circle
                  type={ButtonDesign.Secondary}
                  icon="add"
                  className={styles['add-button']}
                  onClick={handleAddButtonClick}
                />
              )}
            </>
          )}

          {hover && (
            <Menu ref={menuRef}>
              <MenuItem icon="move">Move</MenuItem>
              {enableDelete && (
                <MenuItem icon="delete" onClick={() => setMsgBoxOpened(true)}>
                  Delete
                </MenuItem>
              )}
            </Menu>
          )}

          <div
            className={styles.body}
            onClick={(e) => {
              setEditName(false);
              onClick(e);
            }}
          >
            <Icon name={blockTemplate[data.type].icon} className={styles.icon} />
            {blockTemplate[data.type].text && (
              <div className={styles.text}>{blockTemplate[data.type].text}</div>
            )}
          </div>
        </div>
      </div>
      <SearchInPopover
        data={data}
        ref={searchInPopoverRef}
        onClose={() => {
          if (popoverOpened) {
            setHover(false);
            setPopoverOpened(false);
          }
        }}
      />
      <Portal open={msgBoxOpened}>
        <MessageBox headerText="Delete block">
          {isDeleteMany
            ? 'Are you sure you want to delete this block and the following items?'
            : 'Are you sure you want to delete this block?'}
          <Button slot="ok-button" onClick={handleConfirmDelete}>
            Confirm
          </Button>
          <Button
            slot="cancel-button"
            onClick={() => setMsgBoxOpened(false)}
            type={ButtonDesign.Tertiary}
          >
            Cancel
          </Button>
        </MessageBox>
      </Portal>
    </>
  );
}
