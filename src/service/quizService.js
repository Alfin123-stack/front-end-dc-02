import { api } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const quizService = {
  /**
   * Generate quiz menggunakan Gemini AI
   * @param {string} tutorialId - ID tutorial
   * @returns {Promise} Quiz data
   */
  async generateGeminiQuiz(tutorialId) {
    return await api.post(API_ENDPOINTS.GENERATE_GEMINI_QUIZ, {
      tutorialId: tutorialId
    });
  },

  /**
   * Generate quiz menggunakan Gemma AI  
   * @param {string} tutorialId - ID tutorial
   * @param {number} count - Jumlah soal (default: 5)
   * @returns {Promise} Quiz data
   */
  async generateGemmaQuiz(tutorialId, count = 5) {
    return await api.post(API_ENDPOINTS.GENERATE_GEMMA_QUIZ, {
      tutorialId: tutorialId,
      id: tutorialId, // 🔥 BACKEND PAKAI "id" BUKAN "tutorialId"
      count: count
    });
  }
};