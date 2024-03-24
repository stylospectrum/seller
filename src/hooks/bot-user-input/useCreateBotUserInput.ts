import { useMutation } from '@tanstack/react-query';

import { botBuilderStoryApi } from '@/api';
import { MutationConfig, queryClient } from '@/lib/react-query';

type useCreateBotUserInputOptions = {
  blockId: string;
  config?: MutationConfig<typeof botBuilderStoryApi.createUserInput>;
};

export const useCreateBotUserInput = ({ config, blockId }: useCreateBotUserInputOptions) => {
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['botUserInputs', blockId] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botUserInputs', blockId] });
    },
    ...config,
    mutationFn: botBuilderStoryApi.createUserInput,
  });
};
