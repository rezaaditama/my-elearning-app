import axios from 'axios';

export type Category = { id: number; name: string };
export type RawQuestions = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answer: string[];
};

const API_BASE = 'https://opentdb.com';
const CATEGORY_CACHE_KEY = 'otdb_categories_v1';
const CATEGORY_CACHE_TTL = 1000 * 60 * 60 * 24;

//Mengambil data category
export const getCategories = async (): Promise<Category[]> => {
  //Mengambil localstorage
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
    console.warn('Category cache read failed');
  }

  //Fetching API
  const res = await axios.get(`${API_BASE}/api_category.php`);
  const categories = (res.data?.trivia_categories ?? []) as Category[];

  //Simpan cache
  try {
    localStorage.setItem(
      CATEGORY_CACHE_KEY,
      JSON.stringify({ timeStamp: Date.now(), data: categories })
    );
  } catch (error) {
    console.warn('Category cache write failed');
  }
  return categories;
};

//Mengambil data pertanyaan
export const fetchQuestions = async (userConfiguration: {
  amount: number;
  category?: number;
  difficulty?: string;
  type?: string;
}): Promise<RawQuestions[]> => {
  const urlParams = new URLSearchParams();
  urlParams.set('amount', String(userConfiguration.amount));
  if (userConfiguration.category) {
    urlParams.set('category', String(userConfiguration.category));
  }
  if (userConfiguration.difficulty) {
    urlParams.set('difficulty', userConfiguration.difficulty);
  }
  if (userConfiguration.type) {
    urlParams.set('type', userConfiguration.type);
  }
  const url = `${API_BASE}/api.php?${urlParams.toString()}`;
  const response = await axios.get(url);
  if (response.data.response_code !== 0) {
    throw Error(
      `OpenTDB returned response_code=${response.data.response_code}`
    );
  }
  return response.data.results as RawQuestions[];
};
