import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Input, ListItem, Popover } from '@stylospectrum/ui';
import { IPopover, Placement } from '@stylospectrum/ui/dist/types';

import { BotBuilderContext } from '../context';
import { Box } from '../utils/box';
import styles from './index.module.scss';
import { botBuilderStoryApi } from '@/api';
import { BotStoryBlockType } from '@/enums';

interface SearchInPopoverProps {
  onClose: () => void;
  data: Box;
}

export interface SearchInPopoverRef {
  open?: (opener: HTMLElement, parentId: string) => void;
  close?: () => void;
}

const getDefaultOptions = (data: Box) => {
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
    {
      id: BotStoryBlockType.Filter,
      icon: 'filter',
      title: 'Filter',
    },
    {
      id: BotStoryBlockType.Fallback,
      icon: 'fallback',
      title: 'Fallback',
    },
  ];

  if (data.type === BotStoryBlockType.UserInput) {
    const hasFilterBlock = data.children.some((child) => child.type === BotStoryBlockType.Filter);

    return defaultOptions.filter((option) => {
      if (data.children.length > 0) {
        if (hasFilterBlock) {
          return [BotStoryBlockType.Filter, BotStoryBlockType.Fallback].includes(option.id);
        }

        return option.id === BotStoryBlockType.Filter;
      }

      return [BotStoryBlockType.Filter, BotStoryBlockType.BotResponse].includes(option.id);
    });
  }

  if (data.type === BotStoryBlockType.BotResponse) {
    return defaultOptions.filter(
      (option) => ![BotStoryBlockType.BotResponse, BotStoryBlockType.Filter].includes(option.id),
    );
  }

  if ([BotStoryBlockType.Filter, BotStoryBlockType.Fallback].includes(data.type)) {
    return defaultOptions.filter((option) => option.id === BotStoryBlockType.BotResponse);
  }

  return defaultOptions;
};

const SearchInPopover = forwardRef<SearchInPopoverRef, SearchInPopoverProps>(
  ({ onClose, data }, ref) => {
    const searchRef = useRef<IPopover>(null);
    const dropDownRef = useRef<IPopover>(null);
    const parentId = useRef('');
    const [options, setOptions] = useState(getDefaultOptions(data));
    const { changeRawBlock } = useContext(BotBuilderContext);

    useEffect(() => {
      setOptions(getDefaultOptions(data));
    }, [data]);

    const handleOpen = (opener: HTMLElement, pId: string) => {
      parentId.current = pId;
      searchRef.current?.showAt(opener);
      setTimeout(() => {
        dropDownRef.current?.showAt(searchRef.current!);
      }, 10);
    };

    const handleClose = () => {
      searchRef.current?.hide();
      dropDownRef.current?.hide();
      onClose();
    };

    const handleItemClick = async (id: BotStoryBlockType) => {
      searchRef.current?.hide();
      dropDownRef.current?.hide();
      onClose();

      const res = await botBuilderStoryApi.createStoryBlock({
        name: '',
        type: id,
        parentId: parentId.current,
      });
      changeRawBlock(res!);
    };

    const handleSearch = (e: Event) => {
      const value = (e as any).detail;
      const searchedOptions = getDefaultOptions(data).filter((option) =>
        option.title.toLowerCase().includes(value.toLowerCase()),
      );

      if (searchedOptions.length > 0) {
        dropDownRef.current?.showAt(searchRef.current!);
      } else {
        dropDownRef.current?.hide();
      }

      setOptions(searchedOptions);
    };

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
            onBlur={() => {
              setTimeout(() => {
                handleClose();
              }, 500);
            }}
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
