import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Article } from '@/lib/types';

interface ArticleSubmissionData {
  url: string;
  textToSpeechModel: string;
}

export const useArticleSubmission = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ url, textToSpeechModel }: ArticleSubmissionData) => {
      const response = await fetch('http://localhost:8000/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, textToSpeechModel }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json() as Promise<Article>;
    },
    onSuccess: (data) => {
      console.log('data', data);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  return {
    submitArticle: (url: string, textToSpeechModel: string) =>
      mutation.mutate({ url, textToSpeechModel }),
    isLoading: mutation.isPending,
    error: mutation.error ? mutation.error.message : null,
    isSuccess: mutation.isSuccess,
  };
};
