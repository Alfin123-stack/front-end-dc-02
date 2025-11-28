import { healthService, quizService, userService } from './index.js';

export const testAllEndpoints = async () => {
  console.log('🧪 ===== TESTING BACKEND CONNECTION =====\n');

  // Test 1: Health Check
  console.log('1. Testing Health Check...');
  const health = await healthService.checkBackendHealth();
  if (health.connected) {
    console.log('✅ Health: BACKEND CONNECTED');
    console.log('   Message:', health.data?.message);
  } else {
    console.log('❌ Health: BACKEND OFFLINE');
    console.log('   Error:', health.error);
    return; // Stop jika backend offline
  }

  // Test 2: Generate Quiz
  console.log('\n2. Testing Quiz Generation...');
  try {
    const quiz = await quizService.generateGemmaQuiz('1001', 2);
    console.log('✅ Quiz Generation: SUCCESS');
    console.log('   Model:', quiz.model || 'Gemma');
    console.log('   Questions:', quiz.quiz?.length || quiz.data?.length);
    console.log('   Title:', quiz.tutorial?.title || quiz.title);
  } catch (error) {
    console.log('❌ Quiz Generation: FAILED');
    console.log('   Error:', error.message);
  }

  // Test 3: User Preferences
  console.log('\n3. Testing User Preferences...');
  try {
    const prefs = await userService.getUserPreferences('user-123');
    console.log('✅ User Preferences: SUCCESS');
    console.log('   Data:', prefs.data ? 'Received' : 'No data');
  } catch (error) {
    console.log('❌ User Preferences: FAILED');
    console.log('   Error:', error.message);
  }

  console.log('\n🎯 ===== TESTING COMPLETED =====');
};