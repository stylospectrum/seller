import { useQuery } from '@tanstack/react-query';

import { botBuilderStoryApi } from '@/api';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

type QueryFnType = typeof botBuilderStoryApi.getUserInputs;

type UseBotUserInputsOptions = {
  blockId: string;
  allowQuery: boolean;
  config?: QueryConfig<QueryFnType>;
};

export const useBotUserInputs = ({ blockId, allowQuery, config }: UseBotUserInputsOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['botUserInputs', blockId],
    queryFn: () => {
      if (allowQuery) {
        return botBuilderStoryApi.getUserInputs(blockId);
      }

      return null;
    },
    ...config,
  });
};
