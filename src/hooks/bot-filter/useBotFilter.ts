import { useQuery } from '@tanstack/react-query';

import { botBuilderStoryApi } from '@/api';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

type QueryFnType = typeof botBuilderStoryApi.getFilter;

type UseBotFilterOptions = {
  blockId: string;
  allowQuery: boolean;
  config?: QueryConfig<QueryFnType>;
};

export const useBotFilter = ({ blockId, allowQuery, config }: UseBotFilterOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['botFilter', blockId],
    queryFn: () => {
      if (allowQuery) {
        return botBuilderStoryApi.getFilter(blockId);
      }

      return null;
    },
    ...config,
  });
};
