import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadQuizState, saveQuizState, clearQuizState } from '../utils/storage';
import { useInterval } from '../Hooks/useInterval';
import { fetchAndMapQuestions } from '../services/services.opentdb';
import QuestionCard from '../components/QuestionCard';
import type { Question } from '../types/quizType';
import { throttle } from '../utils/throttle';
import Button from '../components/Button';

const QuizSessionPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<
    {
      questionIdx: number;
      selected: string;
      correct?: string;
      isCorrect: boolean;
      answeredAt: number;
    }[]
  >([]);
  const [endTimestamp, setEndTimestamp] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const latestAnswersRef = useRef(answers);
  useEffect(() => {
    latestAnswersRef.current = answers;
  }, [answers]);

  // throttle save
  const saveThrottled = useRef(
    throttle((payload: any) => saveQuizState(payload), 700)
  );

  // Restore or start
  useEffect(() => {
    const saved = loadQuizState();
    if (saved) {
      const left = Math.max(
        0,
        Math.ceil((saved.endTimestamp - Date.now()) / 1000)
      );
      if (left <= 0) {
        // expired
        clearQuizState();
      } else {
        setQuestions(saved.questions);
        setAnswers(saved.answers ?? []);
        setCurrentIndex(saved.currentIndex);
        setEndTimestamp(saved.endTimestamp);
        setTimeLeft(left);
        setFinished(false);
        return;
      }
    }

    // start new
    const configuration = localStorage.getItem('quiz_config_v1');
    if (!configuration) {
      setError('Konfigurasi kuis tidak ditemukan. Kembali ke setup.');
      return;
    }
    try {
      const cfg = JSON.parse(configuration) as {
        amount: number;
        category?: number;
        difficulty?: string;
        type?: string;
        totalTime: number;
      };
      startNewSession(cfg).catch((e) => {
        console.error(e);
        setError(String(e) || 'Gagal memulai kuis');
      });
    } catch (e) {
      console.error('Invalid quiz_config_v1', e);
      setError('Konfigurasi kuis rusak. Kembali ke setup.');
    }
  }, []);

  // start new session
  const startNewSession = async (configuration: {
    amount: number;
    category?: number;
    difficulty?: string;
    type?: string;
    totalTime: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const questions = await fetchAndMapQuestions({
        amount: configuration.amount,
        category: configuration.category,
        difficulty: configuration.difficulty,
        type: configuration.type,
      });
      setQuestions(questions);
      setAnswers([]);
      setCurrentIndex(0);
      const now = Date.now();
      const endTime = now + (configuration.totalTime ?? 300) * 1000;
      setEndTimestamp(endTime);
      setTimeLeft(Math.ceil(configuration.totalTime ?? 300));
      setFinished(false);

      const payload = {
        questions: questions,
        answers: [],
        currentIndex: 0,
        endTimestamp: endTime,
        createdAt: new Date().toISOString(),
        totalTime: configuration.totalTime ?? 300,
      };
      saveQuizState(payload);
    } finally {
      setLoading(false);
    }
  };

  // interval sesuai dengan endTimestamp
  useInterval(() => {
    if (!endTimestamp || finished) return;
    const left = Math.max(0, Math.ceil((endTimestamp - Date.now()) / 1000));
    setTimeLeft(left);
    if (left <= 0) {
      handleFinish();
    }
  }, 1000);

  //prepare load quiz
  useEffect(() => {
    const handler = () => {
      const payload = {
        questions,
        answers,
        currentIndex,
        endTimestamp,
        createdAt: new Date().toISOString(),
        totalTime: Math.max(
          1,
          Math.ceil(((endTimestamp ?? 0) - Date.now()) / 1000)
        ),
      };

      try {
        // Save quiz
        localStorage.setItem('quiz_resume_v1', JSON.stringify(payload));
      } catch {}
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [questions, answers, currentIndex, endTimestamp]);

  // Handle Answer
  const handleAnswer = (choice: string) => {
    if (!questions[currentIndex]) return;

    const question = questions[currentIndex];
    const correct = question.correctAnswer ?? '';
    const isCorrect = choice === correct;

    // Check if an answer for this index already exists
    const existingIdx = answers.findIndex(
      (a) => a.questionIdx === currentIndex
    );

    let nextAnswers;
    if (existingIdx >= 0) {
      // update existing answer
      nextAnswers = answers.map((a) =>
        a.questionIdx === currentIndex
          ? {
              ...a,
              selected: choice,
              correct,
              isCorrect,
              answeredAt: Date.now(),
            }
          : a
      );
    } else {
      // push new answer
      const answer = {
        questionIdx: currentIndex,
        selected: choice,
        correct,
        isCorrect,
        answeredAt: Date.now(),
      };
      nextAnswers = [...answers, answer];
    }

    setAnswers(nextAnswers);
    latestAnswersRef.current = nextAnswers;

    const safeEnd = endTimestamp ?? Date.now();
    const persisted = {
      questions,
      answers: nextAnswers,
      currentIndex: currentIndex + 1,
      endTimestamp: safeEnd,
      createdAt: new Date().toISOString(),
      totalTime: Math.max(
        1,
        Math.ceil(((endTimestamp ?? 0) - Date.now()) / 1000)
      ),
    };
    saveThrottled.current(persisted);

    // Auto-advance after answer (same behaviour as before)
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = (
    answersToSave?: {
      questionIdx: number;
      selected: string;
      correct?: string;
      isCorrect: boolean;
      answeredAt: number;
    }[]
  ) => {
    setFinished(true);

    const finalAnswers = answersToSave ?? latestAnswersRef.current ?? answers;

    const payload = {
      questions,
      answers: finalAnswers,
      currentIndex,
      endTimestamp,
      createdAt: new Date().toISOString(),
      totalTime: Math.max(
        1,
        Math.ceil(((endTimestamp ?? 0) - Date.now()) / 1000)
      ),
    };

    try {
      localStorage.setItem('quiz_final_v1', JSON.stringify(payload));
    } catch (error) {
      console.warn('Failed to save final quiz results', error);
    }

    try {
      clearQuizState();
    } catch (e) {
      console.warn('clearQuizState failed', e);
    }

    navigate('/quiz-result', {
      state: {
        questions,
        answers: finalAnswers,
        totalTime: payload.totalTime,
        finishedAt: new Date().toISOString(),
      },
    });
  };

  const handleAbort = () => {
    if (!window.confirm('Yakin batalkan kuis? Progress akan dihapus.')) return;
    clearQuizState();
    navigate('/quiz-setup');
  };

  const handleSubmitAndExit = () => {
    const finalAnswers = latestAnswersRef.current ?? answers;
    const payload = {
      questions,
      answers: finalAnswers,
      currentIndex,
      endTimestamp,
      createdAt: new Date().toISOString(),
      totalTime: Math.max(
        1,
        Math.ceil(((endTimestamp ?? 0) - Date.now()) / 1000)
      ),
    };

    try {
      localStorage.setItem('quiz_final_v1', JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save final snapshot before exit', e);
    }

    // go to results page with data
    navigate('/quiz-result', {
      state: {
        questions,
        answers: finalAnswers,
        totalTime: payload.totalTime,
      },
    });

    try {
      clearQuizState();
    } catch (e) {
      console.warn('clearQuizState failed', e);
    }
  };

  const total = questions.length;
  const answeredCount = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const wrongCount = answeredCount - correctCount;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className='p-6 max-w-xl mx-auto'>
        <div className='card'>
          <div className='text-danger mb-3'>{error}</div>
          <div className='flex gap-2'>
            <button
              onClick={() => navigate('/quiz-setup')}
              className='btn-secondary'
            >
              Back to setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && questions.length === 0) {
    return (
      <div className='page-center'>
        <div>Loading questions...</div>
      </div>
    );
  }

  if (finished || timeLeft <= 0) {
    return (
      <div className='p-6 max-w-xl'>
        <div className='card'>
          <h2 className='text-xl font-semibold mb-4'>Hasil Kuis</h2>
          <p>Total soal: {total}</p>
          <p>Jumlah dijawab: {answeredCount}</p>
          <p>Benar: {correctCount}</p>
          <p>Salah: {wrongCount}</p>

          <div className='mt-4 flex gap-2'>
            <button
              className='btn-primary'
              onClick={() => {
                clearQuizState();
                navigate('/quiz-setup');
              }}
            >
              Mulai Ulang
            </button>
            <button
              className='btn-secondary'
              onClick={() => {
                clearQuizState();
                navigate('/');
              }}
            >
              Logout
            </button>
            <button className='btn-secondary' onClick={handleSubmitAndExit}>
              Lihat Detail / Export
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return (
      <div className='page-center'>
        <div>Menunggu soal...</div>
      </div>
    );
  }
  return (
    <div className='flex items-center justify-center min-h-screen bg-neutral-50 w-full h-full'>
      <div className='p-5 min-w-1/2 min-h-3/4 border border-neutral rounded-md'>
        <div className='flex justify-between items-center mb-4'>
          <div className='font-bold border p-1 border-black/50 rounded-md'>
            Total soal: {total} | Dikerjakan: {answeredCount}
          </div>
          <div
            role='status'
            aria-live='polite'
            className='font-bold border p-1 border-black/50 rounded-md'
          >
            Time left: <span className='font-mono'>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className='card'>
          <h3 className='mb-2 font-semibold'>
            Soal {currentIndex + 1} / {total}
          </h3>

          <QuestionCard
            key={currentQuestion.id ?? currentIndex}
            question={currentQuestion}
            index={currentIndex}
            onAnswer={handleAnswer}
            disabled={finished}
            storedAnswer={
              answers.find((a) => a.questionIdx === currentIndex)?.selected ??
              null
            }
          />

          <div className='mt-4 flex gap-2'>
            <Button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className='px-5 py-1'
              variant='secondary'
            >
              Prev
            </Button>
            <Button
              onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
              disabled={currentIndex === total - 1}
              className='px-5 py-1'
            >
              Next
            </Button>
            <Button
              onClick={() => handleAbort()}
              className='px-5 py-1 ml-auto'
              variant='danger'
            >
              Abort
            </Button>
            <Button onClick={() => handleFinish()} className='px-10 py-1'>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSessionPage;
