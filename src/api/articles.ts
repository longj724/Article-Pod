import { API_URL } from '@/lib/constants';

export const deleteArticle = async (articleId: string) => {
  const response = await fetch(`${API_URL}/articles/${articleId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete article');
  }

  return response.json();
};
