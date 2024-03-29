import { useQuery } from '@tanstack/react-query';

import { botBuilderStoryApi } from '@/api';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

type QueryFnType = typeof botBuilderStoryApi.getStoryUserInputBlocks;

type UseBotUserInputBlocksOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useBotUserInputBlocks = ({ config }: UseBotUserInputBlocksOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['botStoryUserInputsBlocks'],
    queryFn: () => botBuilderStoryApi.getStoryUserInputBlocks(),
    ...config,
  });
};
