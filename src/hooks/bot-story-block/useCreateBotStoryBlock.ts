import { useMutation } from '@tanstack/react-query';

import { botBuilderStoryApi } from '@/api';
import { MutationConfig, queryClient } from '@/lib/react-query';

type useCreateStoryBlockOptions = {
  config?: MutationConfig<typeof botBuilderStoryApi.createStoryBlock>;
};

export const useCreateBotStoryBlock = ({ config }: useCreateStoryBlockOptions) => {
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['botStoryBlock'] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botStoryBlock'] });
    },
    ...config,
    mutationFn: botBuilderStoryApi.createStoryBlock,
  });
};
