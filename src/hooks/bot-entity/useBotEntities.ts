import { useQuery } from '@tanstack/react-query';

import { botBuilderEntityApi } from '@/api';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

type QueryFnType = typeof botBuilderEntityApi.getEntities;

type UseBotEntitiesOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useBotEntities = ({ config }: UseBotEntitiesOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['botEntities'],
    queryFn: () => botBuilderEntityApi.getEntities(),
    ...config,
  });
};
