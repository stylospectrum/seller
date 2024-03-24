import { useMutation } from '@tanstack/react-query';

import { botBuilderStoryApi } from '@/api';
import { MutationConfig, queryClient } from '@/lib/react-query';

type useCreateBotUserInputOptions = {
  blockId: string;
  config?: MutationConfig<typeof botBuilderStoryApi.createFilter>;
};

export const useCreateBotFilter = ({ config, blockId }: useCreateBotUserInputOptions) => {
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['botFilter', blockId] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botFilter', blockId] });
    },
    ...config,
    mutationFn: botBuilderStoryApi.createFilter,
  });
};
