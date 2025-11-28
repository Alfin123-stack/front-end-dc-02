export const API_BASE_URL = 'http://localhost:3000'; // 🔥 PORT 3000

export const API_ENDPOINTS = {
  // Quiz Generation
  GENERATE_GEMINI_QUIZ: '/api/ai/generate',
  GENERATE_GEMMA_QUIZ: '/api/quiz/generate',
  
  // User Preferences
  USER_PREFERENCES: '/api/users/:id/preferences',
  
  // Health Check
  HEALTH: '/health'
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};