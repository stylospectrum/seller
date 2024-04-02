import { FC, useEffect, useState } from 'react';
import { BusyIndicator } from '@stylospectrum/ui';

import { Box } from '../utils/box';
import { SearchInPopover } from '@/components';
import { BotStoryBlockType } from '@/enums';
import { useCreateBotStoryBlock } from '@/hooks';
import Portal from '@/utils/Portal';

interface SearchStoryBlockProps {
  onClose: () => void;
  data: Box;
  opener: HTMLElement | null;
}

const getDefaultOptions = (data: Box) => {
  const defaultOptions = [
    {
      type: BotStoryBlockType.BotResponse,
      icon: 'response',
      title: 'Bot response',
    },
    {
      type: BotStoryBlockType.UserInput,
      icon: 'post',
      title: 'User input',
    },
    {
      type: BotStoryBlockType.Filter,
      icon: 'filter',
      title: 'Filter',
    },
    {
      type: BotStoryBlockType.Fallback,
      icon: 'fallback',
      title: 'Fallback',
    },
  ];

  if (data.type === BotStoryBlockType.UserInput) {
    const hasFilterBlock = data.children.some((child) => child.type === BotStoryBlockType.Filter);
    const hasFallbackBlock = data.children.some(
      (child) => child.type === BotStoryBlockType.Fallback,
    );

    return defaultOptions.filter((option) => {
      if (data.children.length > 0) {
        if (hasFilterBlock && !hasFallbackBlock) {
          return [BotStoryBlockType.Filter, BotStoryBlockType.Fallback].includes(option.type);
        }

        return option.type === BotStoryBlockType.Filter;
      }

      return [BotStoryBlockType.Filter, BotStoryBlockType.BotResponse].includes(option.type);
    });
  }

  if (data.type === BotStoryBlockType.BotResponse) {
    return defaultOptions.filter(
      (option) =>
        ![
          BotStoryBlockType.BotResponse,
          BotStoryBlockType.Filter,
          BotStoryBlockType.Fallback,
        ].includes(option.type),
    );
  }

  if ([BotStoryBlockType.Filter, BotStoryBlockType.Fallback].includes(data.type)) {
    return defaultOptions.filter((option) => option.type === BotStoryBlockType.BotResponse);
  }

  return defaultOptions;
};

const SearchStoryBlock: FC<SearchStoryBlockProps> = ({ onClose, data, opener }) => {
  const [options, setOptions] = useState(getDefaultOptions(data));
  const botStoryBlockMutation = useCreateBotStoryBlock({});

  useEffect(() => {
    setOptions(getDefaultOptions(data));
  }, [data]);

  const handleItemClick = async ({ type }: { type: BotStoryBlockType }) => {
    await botStoryBlockMutation.mutateAsync({
      name: '',
      type,
      parentId: data.id,
    });
  };

  const handleSearch = (value: string, callback: Function) => {
    const searchedOptions = getDefaultOptions(data).filter((option) =>
      option.title.toLowerCase().includes(value.toLowerCase()),
    );

    callback(searchedOptions.length === 0);
    setOptions(searchedOptions);
  };

  return (
    <>
      <Portal open={botStoryBlockMutation.isPending}>
        <BusyIndicator global />
      </Portal>

      <SearchInPopover
        opener={opener}
        onClose={onClose}
        onItemClick={handleItemClick}
        onSearch={handleSearch}
        options={options}
      />
    </>
  );
};

export default SearchStoryBlock;
