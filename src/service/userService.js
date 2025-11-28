import { api } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const userService = {
  /**
   * Get user preferences
   * @param {string} userId - User ID
   * @returns {Promise} User preferences
   */
  async getUserPreferences(userId) {
    const endpoint = API_ENDPOINTS.USER_PREFERENCES.replace(':id', userId);
    return await api.get(endpoint);
  },

  /**
   * Update user preferences
   * @param {string} userId - User ID  
   * @param {object} preferences - Preferences data
   * @returns {Promise} Updated preferences
   */
  async updateUserPreferences(userId, preferences) {
    const endpoint = API_ENDPOINTS.USER_PREFERENCES.replace(':id', userId);
    return await api.patch(endpoint, preferences);
  }
};