//Key localstorage
export const QUIZ_CONFIG_KEY = 'quiz_config_v1';
export const QUIZ_STATE_KEY = 'quiz_state_v1';

//Tipe soal yang dijawab
export type StoredAnswer = {
  questionIdx: number;
  selected: string;
  correct: string;
  isCorrect: boolean;
  answeredAt?: number;
};

//Type soal keseluruhan
export type StoredQuizState = {
  questions?: any[];
  answers?: StoredAnswer[];
  currentIndex?: number;
  startedAt?: number;
  totalTime?: number;
  finished?: boolean;
  amount?: number;
  type?: string;
};

//Fungsi menyimpan soal
export const saveQuizState = (storageQuiz: StoredQuizState) => {
  try {
    localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(storageQuiz));
  } catch (error) {
    console.error('Gagal menyimpan Quiz State', error);
  }
};

//Fungsi load soal
export const loadQuizState = (): StoredQuizState | null => {
  try {
    const data = localStorage.getItem(QUIZ_STATE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Load quiz state gagal', error);
    return null;
  }
};

//Fungsi clear soal
export const clearQuizState = () => {
  try {
    localStorage.removeItem(QUIZ_STATE_KEY);
  } catch (error) {
    console.error('Clear quiz state gagal', error);
  }
};
