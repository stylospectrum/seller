import { useMutation } from '@tanstack/react-query';

import { botBuilderEntityApi } from '@/api';
import { MutationConfig, queryClient } from '@/lib/react-query';

type useDeleteBotVariableOptions = {
  config?: MutationConfig<typeof botBuilderEntityApi.deleteVariable>;
};

export const useDeleteBotVariable = ({ config }: useDeleteBotVariableOptions = {}) => {
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['botVariables'] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botVariables'] });
    },
    ...config,
    mutationFn: botBuilderEntityApi.deleteVariable,
  });
};
