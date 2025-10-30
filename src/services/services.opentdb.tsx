import axios from 'axios';

export type Category = { id: number; name: string };
export type RawQuestions = {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answer: string[];
};

const API_BASE = 'https://opentdb.com';
const CATEGORY_CACHE_KEY = 'otdb_categories_v1';
const CATEGORY_CACHE_TTL = 1000 * 60 * 60 * 24;

//Mengambil data category
export const getCategories = async (): Promise<Category[]> => {
  //Caching category dari localstorage
  try {
    const cacheCategory = localStorage.getItem(CATEGORY_CACHE_KEY);
    if (cacheCategory) {
      const parsed = JSON.parse(cacheCategory) as {
        timeStamp: number;
        data: Category[];
      };
      if (Date.now() - parsed.timeStamp < CATEGORY_CACHE_TTL) {
        return parsed.data;
      }
    }
  } catch (error) {
    console.warn('Category cache read failed', error);
  }

  //Fetching API
  const response = await axios.get(`${API_BASE}/api_category.php`);
  const categories = (response.data?.trivia_categories ?? []) as Category[];

  //Simpan cache
  try {
    localStorage.setItem(
      CATEGORY_CACHE_KEY,
      JSON.stringify({ timeStamp: Date.now(), data: categories })
    );
  } catch (error) {
    console.warn('Category cache write failed', error);
  }
  return categories;
};

//Mengambil data pertanyaan
export const fetchQuestions = async (params: {
  amount: number;
  category?: number;
  difficulty?: string;
  type?: string;
}): Promise<RawQuestions[]> => {
  const urlParams = new URLSearchParams();
  urlParams.set('amount', String(params.amount));

  if (params.category) urlParams.set('category', String(params.category));
  if (params.difficulty) urlParams.set('difficulty', params.difficulty);
  if (params.type) urlParams.set('type', params.type);

  const url = `${API_BASE}/api.php?${urlParams.toString()}`;
  const response = await axios.get(url);

  if (response.data.response_code !== 0) {
    throw new Error(
      `OpenTDB returned response_code=${response.data.response_code}`
    );
  }

  return response.data.results as RawQuestions[];
};
