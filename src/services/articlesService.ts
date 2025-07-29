import api from '../lib/api';
import { Article, ArticleFormData } from '../types';
import { mockArticles } from '../data/mockData';

export const articlesService = {
  async getAllArticles(): Promise<Article[]> {
    try {
      const response = await api.get('/articles');
      const data = response.data;
      
      // Ensure we always return an array
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.articles)) {
        return data.articles;
      } else if (data && Array.isArray(data.data)) {
        return data.data;
      } else {
        console.warn('API response is not an array:', data);
        return [];
      }
    } catch (error) {
      console.error('Error in getAllArticles:', error);
      // Return mock data when API fails
      console.log('Falling back to mock articles data');
      return mockArticles;
    }
  },

  async getArticleById(id: string): Promise<Article> {
    try {
      const response = await api.get(`/articles/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error loading article from API:', error);
      
      // Check if it's a network error, timeout, or 403/404
      const isNetworkError = error.code === 'ENOTFOUND' || 
                            error.code === 'ETIMEDOUT' || 
                            error.response?.status === 403 ||
                            error.response?.status === 404;
      
      if (isNetworkError) {
        console.log('Falling back to mock article data for ID:', id);
        // Return a mock article that matches the ID pattern
        const mockArticle = mockArticles.find(article => article.id === id);
        if (mockArticle) {
          return mockArticle;
        } else {
          // Create a fallback article if no mock matches
          return {
            id: id,
            title: 'Sample Article',
            content: 'This is a sample article shown when the API is unavailable. The actual article content would be loaded from the server when the connection is restored.',
            status: 'published' as const,
            author: {
              id: 'mock-author',
              email: 'author@example.com',
              username: 'author',
              firstName: 'Sample',
              lastName: 'Author'
            },
            likes: 0,
            isLiked: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
      }
      
      // Re-throw other types of errors
      throw error;
    }
  },

  async createArticle(data: ArticleFormData): Promise<Article> {
    const response = await api.post('/articles', data);
    return response.data;
  },

  async updateArticle(id: string, data: ArticleFormData): Promise<Article> {
    const response = await api.put(`/articles/${id}`, data);
    return response.data;
  },

  async deleteArticle(id: string): Promise<void> {
    await api.delete(`/articles/${id}`);
  },

  async likeArticle(id: string): Promise<void> {
    await api.post(`/articles/${id}/like`);
  },

  async unlikeArticle(id: string): Promise<void> {
    await api.delete(`/articles/${id}/like`);
  }
};
