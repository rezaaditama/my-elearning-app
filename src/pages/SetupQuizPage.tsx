import { useEffect, useState } from 'react';
import { getCategories, type Category } from '../services/services.opentdb';
import Button from '../components/Button';

// export type QuizPage;
export type QuizConfig = {
  amount: number;
  category?: number | undefined;
  difficulty?: 'easy' | 'medium' | 'hard' | '';
  type?: 'multiple' | 'boolean' | '';
  totalTime: number;
};

const SetupQuizPage = ({
  onStart,
}: {
  onStart: (UserConfiguration: QuizConfig) => void;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Form State
  const [amount, setAmount] = useState<number>(10);
  const [category, setCategory] = useState<number | ''>('');
  const [difficulty, setDifficulty] = useState<QuizConfig['difficulty']>('');
  const [type, setType] = useState<QuizConfig['type']>('multiple');
  const [minutes, setMinutes] = useState<number>(5);

  //Fethcing Category
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        if (!data) return;
        setCategories(data);
      } catch (error) {
        console.error('Gagal memfetching data', error);
        if (mounted) {
          setError('Gagal mengambil kategori. Coba Refresh Halaman');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  //Fungsi Handle Start Quiz
  const handleStart = () => {
    if (!amount || amount < 1) {
      setError('⚠️ Semua field wajib diisi dengan benar.');
      return;
    }
    setError(null);
    const UserConfiguration: QuizConfig = {
      amount,
      category: category === '' ? 10 : category,
      difficulty: difficulty === '' ? 'easy' : difficulty,
      type: type === '' ? 'multiple' : type,
      totalTime: minutes * 60,
    };

    //Menyimpan konfigurasi ke localstorage
    try {
      localStorage.setItem('quiz_config_v1', JSON.stringify(UserConfiguration));
    } catch (error) {}
    onStart(UserConfiguration);
  };

  return (
    <div className='min-h-screen min-w-screen flex justify-center items-center'>
      <div className='border p-5 space-y-4 border-neutral/50 shadow-md rounded-md w-1/3'>
        <h1 className='text-2xl font-bold text-primary text-center'>
          Setup Your Quiz
        </h1>
        {error && (
          <div className='mb-4 text-center border border-danger bg-danger/15 text-danger px-4 py-3 rounded relative'>
            {error}
          </div>
        )}
        <div>
          {/* Jumlah soal */}
          <h2 className='font-bold text-neutral/80 text-md'>
            Number of Questions
          </h2>
          <select
            id='amount'
            value={amount}
            className='w-full border rounded-md p-2 mt-1 block px-3 py-2 border-neutral/50 shadow-sm focus:outline-neutral/50 focus:outline-1'
          >
            <option value='5'>5</option>
            <option value='10'>10</option>
            <option value='15'>15</option>
            <option value='20'>20</option>
          </select>
        </div>

        {/* Kategori */}
        <div>
          <h2 className='font-bold text-neutral/80 text-md'>Category</h2>
          <select
            id='category'
            value={category}
            onChange={(e) =>
              setCategory(e.target.value === '' ? '' : Number(e.target.value))
            }
            className='w-full border rounded-md p-2 mt-1 block px-3 py-2 border-neutral/50 shadow-sm focus:outline-neutral/50 focus:outline-1'
          >
            {loading ? (
              <option value=''>Loading...</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Kesulitan */}
        <fieldset>
          <legend className='font-bold text-neutral/80 text-md'>
            Difficult
          </legend>
          <div className='flex flex-col space-y-1'>
            <label className='space-x-2'>
              <input
                type='radio'
                name='difficulty'
                checked={difficulty === 'easy'}
                onChange={() => setDifficulty('easy')}
              />
              <span>Easy</span>
            </label>
            <label className='space-x-2'>
              <input
                type='radio'
                name='difficulty'
                checked={difficulty === 'medium'}
                onChange={() => setDifficulty('medium')}
              />
              <span>Medium</span>
            </label>
            <label className='space-x-2'>
              <input
                type='radio'
                name='difficulty'
                checked={difficulty === 'hard'}
                onChange={() => setDifficulty('hard')}
              />
              <span>Hard</span>
            </label>
          </div>
        </fieldset>

        {/* Type */}
        <fieldset className='flex flex-col space-y-1'>
          <legend className='font-bold text-neutral/80 text-md'>Type</legend>
          <div className='flex flex-col space-y-1'>
            <label className='space-x-2'>
              <input
                type='radio'
                name='type'
                checked={type === 'multiple'}
                onChange={() => setType('multiple')}
              />
              <span>Multiple Choice</span>
            </label>
            <label className='space-x-2'>
              <input
                type='radio'
                name='type'
                checked={type === 'boolean'}
                onChange={() => setType('boolean')}
              />
              <span>True / False</span>
            </label>
          </div>
        </fieldset>

        {/* Timer */}
        <label className='block mb-4'>
          <div className='text-sm font-medium mb-1'>Time (minutes)</div>
          <input
            type='number'
            min={1}
            max={120}
            value={minutes}
            onChange={(e) => setMinutes(Math.max(1, Number(e.target.value)))}
            className='w-full p-2 border rounded'
          />
        </label>

        {/* Trigger */}
        <Button variant='primary' onClick={handleStart}>
          Start Quiz
        </Button>
        <Button
          variant='secondary'
          onClick={() => {
            setAmount(10);
            setCategory('');
            setDifficulty('');
            setType('multiple');
            setMinutes(5);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default SetupQuizPage;
