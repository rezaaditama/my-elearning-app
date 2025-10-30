import { quizResumeSchema, type QuizResume } from '../schemas/quizResume';

//Key localstorage
const STORAGE_KEY = 'quiz_resume_v1';

//Simpan quiz
export const saveQuizState = (payload: QuizResume) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('saveQuizState failed', error);
  }
};

//Load quiz
export const loadQuizState = (): QuizResume | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    const response = quizResumeSchema.safeParse(parsed);
    if (!response.success) {
      console.warn('loadQuizState invalid schema', response.error);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return response.data;
  } catch (error) {
    console.warn('loadQuizState failed', error);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    return null;
  }
};

//Cleat quiz
export const clearQuizState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('clearQuizState failed', error);
  }
};
