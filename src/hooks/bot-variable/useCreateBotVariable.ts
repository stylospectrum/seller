import { useMutation } from '@tanstack/react-query';

import { botBuilderEntityApi } from '@/api';
import { MutationConfig, queryClient } from '@/lib/react-query';

type useCreateBotVariableOptions = {
  config?: MutationConfig<typeof botBuilderEntityApi.createVariable>;
};

export const useCreateBotVariable = ({ config }: useCreateBotVariableOptions = {}) => {
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['botVariables'] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botVariables'] });
    },
    ...config,
    mutationFn: botBuilderEntityApi.createVariable,
  });
};
