import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Input, ListItem, Popover } from '@stylospectrum/ui';
import { IPopover, Placement } from '@stylospectrum/ui/dist/types';

import { ChatBotContext } from '../context';
import styles from './index.module.scss';
import { botStoryApi } from '@/api';
import { BotStoryBlockType } from '@/model/bot-story-block';

interface SearchInPopoverProps {
  onClose: () => void;
  type: BotStoryBlockType;
}

export interface SearchInPopoverRef {
  open?: (opener: HTMLElement, parentId: string) => void;
  close?: () => void;
}

const getDefaultOptions = (type: BotStoryBlockType) => {
  const defaultOptions = [
    {
      id: BotStoryBlockType.BotResponse,
      icon: 'response',
      title: 'Bot response',
    },
    {
      id: BotStoryBlockType.UserInput,
      icon: 'post',
      title: 'User input',
    },
  ];

  if (type === BotStoryBlockType.UserInput) {
    return defaultOptions.filter((option) => option.id !== BotStoryBlockType.UserInput);
  }

  return defaultOptions;
};

const SearchInPopover = forwardRef<SearchInPopoverRef, SearchInPopoverProps>(
  ({ onClose, type }, ref) => {
    const searchRef = useRef<IPopover>(null);
    const dropDownRef = useRef<IPopover>(null);
    const parentId = useRef('');
    const defaultOptions = getDefaultOptions(type);
    const [options, setOptions] = useState(defaultOptions);
    const { changeRawBlock, registerSearchInPopoverRef } = useContext(ChatBotContext);

    const handleOpen = (opener: HTMLElement, pId: string) => {
      parentId.current = pId;
      searchRef.current?.showAt(opener);
      setTimeout(() => {
        dropDownRef.current?.showAt(searchRef.current!);
      }, 10);
    };

    const handleClose = () => {
      searchRef.current!.hide();
      dropDownRef.current!.hide();
      onClose();
    };

    const handleItemClick = async (id: BotStoryBlockType) => {
      searchRef.current?.hide();
      dropDownRef.current?.hide();
      onClose();

      const res = await botStoryApi.createStoryBlock({
        name: '',
        type: id,
        parent_id: parentId.current,
      });
      changeRawBlock(res!);
    };

    const handleSearch = (e: Event) => {
      const value = (e as any).detail;
      const searchedOptions = defaultOptions.filter((option) =>
        option.title.toLowerCase().includes(value.toLowerCase()),
      );

      if (searchedOptions.length > 0) {
        dropDownRef.current?.showAt(searchRef.current!);
      } else {
        dropDownRef.current?.hide();
      }

      setOptions(searchedOptions);
    };

    useEffect(() => {
      searchRef.current!.setScaleElement(document.querySelector('#diagram')!);
      dropDownRef.current!.setScaleElement(document.querySelector('#diagram')!);
      registerSearchInPopoverRef({
        close: handleClose,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleClose]);

    useImperativeHandle(
      ref,
      () => ({
        open: handleOpen,
      }),
      [],
    );

    return (
      <>
        <Popover
          placement={Placement.Right}
          className={styles.popover}
          ref={searchRef}
          hideArrow
          hideFooter
          offsetX={-16}
        >
          <Input
            onChange={handleSearch}
            placeholder="Search"
            showSearch
            allowClear
            className={styles.input}
          />
        </Popover>
        <Popover className={styles.popover} ref={dropDownRef} hideArrow hideFooter offsetY={1}>
          <div style={{ width: '15.5rem' }}>
            {options.map((option) => (
              <ListItem
                key={option.id}
                icon={option.icon}
                onClick={() => handleItemClick(option.id)}
              >
                {option.title}
              </ListItem>
            ))}
          </div>
        </Popover>
      </>
    );
  },
);

SearchInPopover.displayName = 'SearchInPopover';

export default SearchInPopover;
