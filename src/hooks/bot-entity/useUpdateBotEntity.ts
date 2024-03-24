import { useMutation } from '@tanstack/react-query';

import { botBuilderEntityApi } from '@/api';
import { MutationConfig, queryClient } from '@/lib/react-query';

type useUpdateBotEntityOptions = {
  config?: MutationConfig<typeof botBuilderEntityApi.updateEntity>;
};

export const useUpdateBotEntity = ({ config }: useUpdateBotEntityOptions = {}) => {
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['botEntities'] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botEntities'] });
    },
    ...config,
    mutationFn: botBuilderEntityApi.updateEntity,
  });
};
