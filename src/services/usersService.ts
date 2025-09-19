import api from '../lib/api';
import { User } from '../types';

export const usersService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by id:', error);
      return null;
    }
  }
};
