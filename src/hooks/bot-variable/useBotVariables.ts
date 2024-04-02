import { useQuery } from '@tanstack/react-query';

import { botBuilderEntityApi } from '@/api';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

type QueryFnType = typeof botBuilderEntityApi.getVariables;

type UseBotVariablesOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useBotVariables = ({ config }: UseBotVariablesOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['botVariables'],
    queryFn: () => botBuilderEntityApi.getVariables(),
    ...config,
  });
};
