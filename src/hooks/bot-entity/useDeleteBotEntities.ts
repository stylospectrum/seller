import { useMutation } from '@tanstack/react-query';

import { botBuilderEntityApi } from '@/api';
import { MutationConfig, queryClient } from '@/lib/react-query';

type useDeleteBotEntitiesOptions = {
  config?: MutationConfig<typeof botBuilderEntityApi.deleteEntities>;
};

export const useDeleteBotEntities = ({ config }: useDeleteBotEntitiesOptions = {}) => {
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['botEntities'] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botEntities'] });
    },
    ...config,
    mutationFn: botBuilderEntityApi.deleteEntities,
  });
};
