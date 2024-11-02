import { useQuery } from '@tanstack/react-query';
import { Article } from '@/lib/types';

export const useArticles = () => {
  return useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/articles');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json() as Promise<Article[]>;
    },
  });
};
