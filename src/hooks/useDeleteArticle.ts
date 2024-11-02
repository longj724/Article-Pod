import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteArticle } from '@/api/articles';

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  return {
    deleteArticle: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error?.message,
  };
};
