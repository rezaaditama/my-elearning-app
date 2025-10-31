import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { getCategories, type Category } from '../services/services.opentdb';
import { quizConfigSchema, type quizConfig } from '../schemas/quizConfig';
import { useLocalStorage } from '../Hooks/useLocalStorage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '../components/Form/FormField';
import Input from '../components/Form/Input';
import { useNavigate } from 'react-router-dom';
import { clearQuizState, loadQuizState } from '../utils/storage';

type FormSetupQuizProps = {
  onSubmit: (userConfiguration: quizConfig) => void;
};
const AMOUNT_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

const FormSetupQuiz: React.FC<FormSetupQuizProps> = ({ onSubmit }) => {
  //Fetching State
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasResume, setHasResume] = useState(false);

  //Form State
  const [savedDraft, setSavedDraft] = useLocalStorage<quizConfig | null>(
    'quiz_config_v1',
    null
  );

  const navigate = useNavigate();

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

  useEffect(() => {
    try {
      const saved = loadQuizState();
      const storeData = localStorage.getItem('quiz_resume_v1');
      setHasResume(Boolean(saved ?? storeData));
    } catch (error) {
      setHasResume(false);
    }
  }, []);

  const onFormSubmit = (values: quizConfig) => {
    const configuration = quizConfigSchema.parse(values);
    try {
      try {
        clearQuizState();
      } catch {}
      localStorage.setItem('quiz_config_v1', JSON.stringify(configuration));
    } catch (error) {
      console.warn('Failed to save quiz_config_v1', error);
    }
    onSubmit(configuration);
  };

  const handleContinue = () => {
    try {
      const saved = loadQuizState();
      const fallback = (() => {
        const raw = localStorage.getItem('quiz_resume_v1');
        return raw ? JSON.parse(raw) : null;
      })();

      const resume = saved ?? fallback;

      if (!resume) {
        window.alert('Tidak ada sesi kuis tersimpan untuk dilanjutkan.');
        return;
      }
      navigate('/quiz-session');
    } catch (error) {
      console.error('Failed to read resume', error);
      window.alert('Gagal membaca sesi tersimpan. Coba lagi.');
    }
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
        <FormField
          id='amount'
          label='Number of Questions'
          error={errors.amount?.message}
        >
          <select
            id='amount'
            {...register('amount', { valueAsNumber: true })}
            className='w-full border rounded-md p-2 mt-1 block px-3 py-2 border-neutral/50 shadow-sm focus:outline-neutral/50 focus:outline-1'
          >
            {AMOUNT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </FormField>

        {/* Kategori */}
        <FormField
          id='category'
          label='Category'
          error={errors.category?.message}
        >
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
        </FormField>

        {/* Difficulty */}
        <FormField
          label='Difficulty'
          id='difficulty'
          error={errors.difficulty?.message}
        >
          <div className='flex flex-col gap-y-1'>
            {['easy', 'medium', 'hard'].map((value) => (
              <label key={value} className='flex gap-2'>
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
        </FormField>

        {/* Type */}
        <FormField label='Question Type' id='type' error={errors.type?.message}>
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
        </FormField>

        {/* Timer */}
        <FormField
          label='Time (minutes)'
          id='totalTime'
          error={errors.totalTime?.message}
        >
          <Input
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
        </FormField>

        {/* Trigger */}
        <div className='flex flex-col gap-y-2'>
          <Button
            variant='primary'
            type={'submit'}
            disabled={isSubmitting}
            className='py-1.5'
          >
            Start Quiz
          </Button>
          {localStorage.getItem('quiz_resume_v1') && (
            <Button
              type='button'
              variant='secondary'
              onClick={handleContinue}
              disabled={!hasResume}
              className='py-1.5'
            >
              Continue Quiz
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormSetupQuiz;
