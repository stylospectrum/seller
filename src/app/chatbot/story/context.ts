import { createContext } from 'react';

import { BotStoryBlock } from '@/model';

interface ChatBotContextProps {
  changeRawBlock: (rawBlock: BotStoryBlock) => void;
}

export const ChatBotContext = createContext<ChatBotContextProps>({
  changeRawBlock: () => {},
});
