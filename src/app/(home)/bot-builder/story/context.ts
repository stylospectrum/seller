import { createContext } from 'react';

import { BotStoryBlock } from '@/model';

interface BotBuilderContextProps {
  changeRawBlock: (rawBlock: BotStoryBlock) => void;
}

export const BotBuilderContext = createContext<BotBuilderContextProps>({
  changeRawBlock: () => {},
});
