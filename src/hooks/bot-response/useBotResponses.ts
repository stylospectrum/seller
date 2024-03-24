import { useQuery } from '@tanstack/react-query';

import { botBuilderStoryApi } from '@/api';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

type QueryFnType = typeof botBuilderStoryApi.getBotResponse;

type UseBotResponsesOptions = {
  blockId: string;
  allowQuery: boolean;
  config?: QueryConfig<QueryFnType>;
};

export const useBotResponses = ({ blockId, allowQuery, config }: UseBotResponsesOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['botResponses', blockId],
    queryFn: () => {
      if (allowQuery) {
        return botBuilderStoryApi.getBotResponse(blockId);
      }

      return null;
    },
    ...config,
  });
};
