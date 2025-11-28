import { api } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const healthService = {
  /**
   * Check backend connection
   * @returns {Promise} Health status
   */
  async checkBackendHealth() {
    try {
      const result = await api.get(API_ENDPOINTS.HEALTH);
      return {
        connected: true,
        message: 'Backend connected successfully',
        data: result
      };
    } catch (error) {
      return {
        connected: false,
        message: 'Backend connection failed',
        error: error.message
      };
    }
  }
};