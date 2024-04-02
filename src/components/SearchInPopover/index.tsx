import { FC, useEffect, useRef } from 'react';
import { Input, ListItem, Popover } from '@stylospectrum/ui';
import { IPopover, Placement } from '@stylospectrum/ui/dist/types';

import styles from './index.module.scss';

interface SearchInPopoverProps {
  onClose?: () => void;
  onSearch?: (value: string, callback: Function) => void;
  onItemClick?: (option: any) => void;
  options: any[];
  opener: HTMLElement | null;
  offsetY?: number;
  offsetX?: number;
  placement?: Placement;
}

const SearchInPopover: FC<SearchInPopoverProps> = ({
  onClose,
  options,
  onItemClick,
  onSearch,
  opener,
  offsetX = -16,
  offsetY = 1,
  placement = Placement.Right,
}) => {
  const searchRef = useRef<IPopover>(null);
  const dropDownRef = useRef<IPopover>(null);

  useEffect(() => {
    if (opener && options.length > 0) {
      searchRef.current?.showAt(opener);
      setTimeout(() => {
        dropDownRef.current?.showAt(searchRef.current!);
      }, 10);
    }
  }, [opener, options.length]);

  const handleClose = () => {
    searchRef.current?.hide();
    dropDownRef.current?.hide();
    onClose?.();
  };

  const handleItemClick = (option: any) => {
    onItemClick?.(option);
    searchRef.current?.hide();
    dropDownRef.current?.hide();
    onClose?.();
  };

  const handleSearch = (e: Event) => {
    onSearch?.((e as any).detail, (noResult: boolean) => {
      if (noResult) {
        dropDownRef.current?.hide();
      } else {
        dropDownRef.current?.showAt(searchRef.current!);
      }
    });
  };

  return (
    <>
      <Popover
        placement={placement}
        className={styles.popover}
        ref={searchRef}
        hideArrow
        hideFooter
        offsetX={offsetX}
        offsetY={offsetY}
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
      <Popover className={styles.popover} ref={dropDownRef} offsetY={1} hideArrow hideFooter>
        <div style={{ width: '15.5rem' }}>
          {options.map((option) => (
            <ListItem
              key={option.id || option.type}
              icon={option.icon}
              onClick={() => handleItemClick(option)}
            >
              {option.name || option.title}
            </ListItem>
          ))}
        </div>
      </Popover>
    </>
  );
};

export default SearchInPopover;
