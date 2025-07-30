import api from '../lib/api';
import { Comment } from '../types';
import { mockComments } from '../data/mockData';
import axios from 'axios';

export const commentsService = {
  async getCommentsByArticleId(articleId: string): Promise<Comment[]> {
    try {
      // Use the correct endpoint that matches our backend
      const response = await api.get(`/articles/${articleId}/comments`);

      // The API should return an array of comments.
      // We add checks for different possible successful response structures.
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data && Array.isArray(response.data.comments)) {
        return response.data.comments;
      }

      console.warn('Comments API returned an unexpected data structure:', response.data);
      return [];

    } catch (error) {
      // A 404 error from this endpoint means the article exists but has no comments.
      // This is a normal, expected case, so we return an empty array.
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log(`No comments found for article ${articleId}. Returning empty array.`);
        return [];
      }

      // For any other unexpected error (e.g., 500 Internal Server Error, network timeout),
      // we log it and fall back to mock data to keep the UI from breaking.
      console.error('An unexpected error occurred fetching comments, using mock data:', error);
      return mockComments.filter(comment => comment.articleId === articleId);
    }
  },

  async addComment(articleId: string, content: string): Promise<Comment> {
    try {
      // Use the correct endpoint that matches our backend
      const response = await api.post(`/articles/${articleId}/comments`, { content });
      return response.data;
    } catch (error) {
      console.error('Error posting comment:', error);
      // For demo purposes, create a mock comment on failure
      const mockComment: Comment = {
        id: Date.now().toString(),
        content,
        articleId,
        author: {
          id: 'current-user',
          email: 'user@example.com',
          username: 'user',
          firstName: 'Current',
          lastName: 'User',
          role: 'user'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return Promise.reject(mockComment); // Reject with mock data so UI can show it
    }
  },
};
