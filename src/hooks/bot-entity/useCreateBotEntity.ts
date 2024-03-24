import { useMutation } from '@tanstack/react-query';

import { botBuilderEntityApi } from '@/api';
import { MutationConfig, queryClient } from '@/lib/react-query';

type useCreateBotEntityOptions = {
  config?: MutationConfig<typeof botBuilderEntityApi.createEntity>;
};

export const useCreateBotEntity = ({ config }: useCreateBotEntityOptions = {}) => {
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['botEntities'] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botEntities'] });
    },
    ...config,
    mutationFn: botBuilderEntityApi.createEntity,
  });
};
