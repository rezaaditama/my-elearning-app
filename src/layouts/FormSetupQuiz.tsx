// import { useEffect, useState } from 'react';
// import Button from '../components/Button';
// import { getCategories, type Category } from '../services/services.opentdb';

// export type QuizConfig = {
//   amount: number;
//   category?: number | undefined;
//   difficulty?: 'easy' | 'medium' | 'hard' | '';
//   type?: 'multiple' | 'boolean' | '';
//   totalTime: number;
// };

// const FormSetupQuiz = ({
//   onSubmit,
// }: {
//   onSubmit: (userConfiguration: QuizConfig) => void;
// }) => {
//   //Fetching State
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   //Form State
//   const [amount, setAmount] = useState<number>(10);
//   const [category, setCategory] = useState<number | ''>('');
//   const [difficulty, setDifficulty] = useState<QuizConfig['difficulty']>('');
//   const [type, setType] = useState<QuizConfig['type']>('multiple');
//   const [minutes, setMinutes] = useState<number>(5);

//   //Fetching Data Category
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         setLoading(true);
//         const data = await getCategories();
//         if (!data) return;
//         setCategories(data);
//       } catch (error) {
//         console.error('Gagal memfetching data', error);
//         if (mounted) {
//           setError('Gagal mengambil kategori. Coba Refresh Halaman');
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   //Fungsi Handle Start Quiz
//   const handleStart = () => {
//     if (!amount || amount < 1) {
//       setError('⚠️ Semua field wajib diisi dengan benar.');
//       return;
//     }
//     setError(null);

//     const UserConfiguration: QuizConfig = {
//       amount,
//       category: category === '' ? 10 : category,
//       difficulty: difficulty === '' ? 'easy' : difficulty,
//       type: type === '' ? 'multiple' : type,
//       totalTime: minutes * 60,
//     };
//     onSubmit(UserConfiguration);
//   };

//   return (
//     <div className='min-h-screen min-w-screen flex justify-center items-center'>
//       <div className='border p-5 space-y-4 border-neutral/50 shadow-md rounded-md w-1/3'>
//         <h1 className='text-2xl font-bold text-primary text-center'>
//           Setup Your Quiz
//         </h1>
//         {error && (
//           <div className='mb-4 text-center border border-danger bg-danger/15 text-danger px-4 py-3 rounded relative'>
//             {error}
//           </div>
//         )}
//         <div>
//           {/* Jumlah soal */}
//           <h2 className='font-bold text-neutral/80 text-md'>
//             Number of Questions
//           </h2>
//           <select
//             id='amount'
//             value={amount}
//             className='w-full border rounded-md p-2 mt-1 block px-3 py-2 border-neutral/50 shadow-sm focus:outline-neutral/50 focus:outline-1'
//           >
//             <option value='5'>5</option>
//             <option value='10'>10</option>
//             <option value='15'>15</option>
//             <option value='20'>20</option>
//           </select>
//         </div>

//         {/* Kategori */}
//         <div>
//           <h2 className='font-bold text-neutral/80 text-md'>Category</h2>
//           <select
//             id='category'
//             value={category}
//             onChange={(e) =>
//               setCategory(e.target.value === '' ? '' : Number(e.target.value))
//             }
//             className='w-full border rounded-md p-2 mt-1 block px-3 py-2 border-neutral/50 shadow-sm focus:outline-neutral/50 focus:outline-1'
//           >
//             {loading ? (
//               <option value=''>Loading...</option>
//             ) : (
//               categories.map((category) => (
//                 <option key={category.id} value={category.id}>
//                   {category.name}
//                 </option>
//               ))
//             )}
//           </select>
//         </div>

//         {/* Kesulitan */}
//         <fieldset>
//           <legend className='font-bold text-neutral/80 text-md'>
//             Difficult
//           </legend>
//           <div className='flex flex-col space-y-1'>
//             <label className='space-x-2'>
//               <input
//                 type='radio'
//                 name='difficulty'
//                 checked={difficulty === 'easy'}
//                 onChange={() => setDifficulty('easy')}
//               />
//               <span>Easy</span>
//             </label>
//             <label className='space-x-2'>
//               <input
//                 type='radio'
//                 name='difficulty'
//                 checked={difficulty === 'medium'}
//                 onChange={() => setDifficulty('medium')}
//               />
//               <span>Medium</span>
//             </label>
//             <label className='space-x-2'>
//               <input
//                 type='radio'
//                 name='difficulty'
//                 checked={difficulty === 'hard'}
//                 onChange={() => setDifficulty('hard')}
//               />
//               <span>Hard</span>
//             </label>
//           </div>
//         </fieldset>

//         {/* Type */}
//         <fieldset className='flex flex-col space-y-1'>
//           <legend className='font-bold text-neutral/80 text-md'>Type</legend>
//           <div className='flex flex-col space-y-1'>
//             <label className='space-x-2'>
//               <input
//                 type='radio'
//                 name='type'
//                 checked={type === 'multiple'}
//                 onChange={() => setType('multiple')}
//               />
//               <span>Multiple Choice</span>
//             </label>
//             <label className='space-x-2'>
//               <input
//                 type='radio'
//                 name='type'
//                 checked={type === 'boolean'}
//                 onChange={() => setType('boolean')}
//               />
//               <span>True / False</span>
//             </label>
//           </div>
//         </fieldset>

//         {/* Timer */}
//         <label className='block mb-4'>
//           <div className='text-sm font-medium mb-1'>Time (minutes)</div>
//           <input
//             type='number'
//             min={1}
//             max={120}
//             value={minutes}
//             onChange={(e) => setMinutes(Math.max(1, Number(e.target.value)))}
//             className='w-full p-2 border rounded'
//           />
//         </label>

//         {/* Trigger */}
//         <Button variant='primary' onClick={handleStart}>
//           Start Quiz
//         </Button>
//         <Button
//           variant='secondary'
//           onClick={() => {
//             setAmount(10);
//             setCategory('');
//             setDifficulty('');
//             setType('multiple');
//             setMinutes(5);
//           }}
//         >
//           Reset
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default FormSetupQuiz;

import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { getCategories, type Category } from '../services/services.opentdb';
import { quizConfigSchema, type quizConfig } from '../schemas/quizConfig';
import { useLocalStorage } from '../Hooks/useLocalStorage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type FormSetupQuizProps = {
  onSubmit: (userConfiguration: quizConfig) => void;
};
const AMOUNT_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

const FormSetupQuiz: React.FC<FormSetupQuizProps> = ({ onSubmit }) => {
  //Fetching State
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Form State
  const [savedDraft, setSavedDraft] = useLocalStorage<quizConfig | null>(
    'quiz_config_v1',
    null
  );

  // React Hook Form dengan Zod
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<quizConfig>({
    resolver: zodResolver(quizConfigSchema),
    defaultValues: savedDraft ?? {
      amount: 5,
      category: null,
      difficulty: 'easy',
      type: 'multiple',
      totalTime: 5 * 60,
    },
  });

  const totalTime = watch('totalTime');

  //Fetching Data Category
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
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

  useEffect(() => {
    const change = (values: any) => {
      try {
        setSavedDraft(values as quizConfig);
      } catch (error) {}
    };
    const subscription = (watch as any)(change);
    return () => subscription.unsubscribe();
  }, [watch, setSavedDraft]);

  // helper: set minutes -> totalTime (seconds)
  const handleMinutesChange = (minutes: number) => {
    const mins = Math.max(1, Math.min(24 * 60, Math.floor(minutes)));
    setValue('totalTime', mins * 60, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onFormSubmit = (values: quizConfig) => {
    const configuration = quizConfigSchema.parse(values);
    try {
      localStorage.setItem('quiz_config_v1', JSON.stringify(configuration));
    } catch (error) {
      console.warn('Failed to save quiz_config_v1', error);
    }
    onSubmit(configuration);
  };
  return (
    <div
      className='min-h-screen min-w-screen flex justify-center items-center'
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <form className='border p-5 space-y-4 border-neutral/50 shadow-md rounded-md w-1/3'>
        <h1 className='text-2xl font-bold text-primary text-center'>
          Setup Your Quiz
        </h1>
        {error && (
          <div className='mb-4 text-center border border-danger bg-danger/15 text-danger px-4 py-3 rounded relative'>
            {error}
          </div>
        )}

        {/* Jumlah soal */}
        <div>
          <label className='font-bold text-neutral/80 text-md' htmlFor='amount'>
            Number of Questions
          </label>
          <select
            id='amount'
            {...register('amount', { valueAsNumber: true })}
            className='w-full border rounded-md p-2 mt-1 block px-3 py-2 border-neutral/50 shadow-sm focus:outline-neutral/50 focus:outline-1'
          >
            {AMOUNT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.amount && (
            <p role='alert' className='text-sm text-danger mt-1'>
              {errors.amount.message}
            </p>
          )}
        </div>

        {/* Kategori */}
        <div>
          <label
            className='font-bold text-neutral/80 text-md'
            htmlFor='category'
          >
            Category
          </label>
          <select
            id='category'
            onChange={(e) => {
              const value = e.target.value;
              setValue('category', value === '' ? null : Number(value), {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            className='w-full border rounded-md p-2 mt-1 block px-3 py-2 border-neutral/50 shadow-sm focus:outline-neutral/50 focus:outline-1'
            aria-invalid={!!errors.category}
            defaultValue={savedDraft?.category ?? ''}
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

        {/* Difficulty */}
        <fieldset>
          <legend className='font-bold text-neutral/80 text-md'>
            Difficulty
          </legend>
          <div className='flex flex-col gap-y-1'>
            {['easy', 'medium', 'hard'].map((value) => (
              <label key={value} className='flex items-center gap-2'>
                <input
                  type='radio'
                  value={value}
                  {...register('difficulty')}
                  defaultChecked={(savedDraft?.difficulty ?? '') === value}
                />
                <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Type */}
        <fieldset>
          <legend className='font-bold text-neutral/80 text-md'>
            Question Type
          </legend>
          <div className='flex flex-row gap-4 mt-2'>
            {['multiple', 'boolean'].map((value) => (
              <label key={value} className='flex items-center gap-2'>
                <input
                  type='radio'
                  value={value}
                  {...register('type')}
                  defaultChecked={(savedDraft?.type ?? 'multiple') === value}
                />
                <span>
                  {value === 'boolean' ? 'True / False' : 'Multiple Choice'}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Timer */}
        <label className='block mb-4'>
          <div className='text-sm font-medium mb-1'>Time (minutes)</div>
          <input
            type='number'
            min={1}
            max={24 * 60}
            value={Math.max(1, Math.floor((totalTime ?? 300) / 60))}
            onChange={(e) => handleMinutesChange(Number(e.target.value))}
            className='w-full p-2 border rounded'
            aria-label='Quiz time in minutes'
          />
          {errors.totalTime && (
            <p role='alert' className='text-sm text-danger mt-1'>
              {errors.totalTime.message}
            </p>
          )}
        </label>

        {/* Trigger */}
        <div className='flex flex-col gap-y-2'>
          <Button variant='primary' type={'submit'} disabled={isSubmitting}>
            Start Quiztype
          </Button>
          <Button type='button' variant='secondary'>
            Continue Quiz
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormSetupQuiz;
