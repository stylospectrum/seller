import { createContext } from 'react';

import { SearchInPopoverRef } from './SearchInPopover';
import { BotStoryBlock } from '@/model';

interface ChatBotContextProps {
  changeRawBlock: (rawBlock: BotStoryBlock) => void;
  registerSearchInPopoverRef: (ref: SearchInPopoverRef) => void;
}

export const ChatBotContext = createContext<ChatBotContextProps>({
  changeRawBlock: () => {},
  registerSearchInPopoverRef: () => {},
});
