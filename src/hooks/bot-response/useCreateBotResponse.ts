import { useMutation } from '@tanstack/react-query';

import { botBuilderStoryApi } from '@/api';
import { MutationConfig, queryClient } from '@/lib/react-query';

type useCreateBotResponseOptions = {
  blockId: string;
  config?: MutationConfig<typeof botBuilderStoryApi.createBotResponse>;
};

export const useCreateBotResponse = ({ config, blockId }: useCreateBotResponseOptions) => {
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['botResponses', blockId] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botResponses', blockId] });
    },
    ...config,
    mutationFn: botBuilderStoryApi.createBotResponse,
  });
};
