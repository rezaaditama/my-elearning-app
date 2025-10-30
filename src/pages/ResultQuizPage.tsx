// === FILE: src/pages/QuizResultPage.tsx ===
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * QuizResultPage
 * - Hanya render hasil (summary + detail).
 * - Mencoba baca dari location.state; jika kosong -> fallback ke localStorage quiz_final_v1 atau quiz_resume_v1.
 */

type LocationState = {
  questions?: any[]; // ganti ke Question[] jika kamu punya tipe di sini
  answers?: any[];
  totalTime?: number;
  startedAt?: string | number;
  finishedAt?: string | number;
};

const QuizResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const locationState = (state ?? {}) as LocationState;

  const fallback = useMemo(() => {
    try {
      const raw =
        localStorage.getItem('quiz_final_v1') ||
        localStorage.getItem('quiz_resume_v1');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const data = {
    questions: locationState.questions ?? fallback?.questions ?? [],
    answers: locationState.answers ?? fallback?.answers ?? [],
    totalTime: locationState.totalTime ?? fallback?.totalTime ?? 0,
    startedAt: locationState.startedAt ?? fallback?.createdAt ?? null,
    finishedAt: locationState.finishedAt ?? new Date().toISOString(),
  };

  // if no data at all, redirect to setup
  if (!data.questions || data.questions.length === 0) {
    setTimeout(() => navigate('/quiz-setup'), 250);
    return (
      <div className='p-6'>
        Tidak ada data hasil. Mengarahkan ke halaman setup...
      </div>
    );
  }

  const total = data.questions.length;
  const answeredCount = data.answers.length;
  const correctCount = data.answers.filter((a: any) => a.isCorrect).length;
  const wrongCount = answeredCount - correctCount;

  return (
    <div className='p-6 max-w-xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Hasil Kuis</h1>

      <div className='mb-4'>
        <p>Total soal: {total}</p>
        <p>Jumlah dijawab: {answeredCount}</p>
        <p>Benar: {correctCount}</p>
        <p>Salah: {wrongCount}</p>
        <p>Waktu pengerjaan (detik): {data.totalTime}</p>
      </div>

      <div className='space-y-3'>
        {data.answers.map((a: any, idx: number) => {
          const q = data.questions[a.questionIdx];
          return (
            <div key={idx} className='p-3 border rounded'>
              <div className='text-sm mb-1'>{q?.question ?? '—'}</div>
              <div className='text-xs'>Jawaban kamu: {a.selected}</div>
              <div className='text-xs'>Jawaban benar: {a.correct}</div>
              <div
                className={`text-xs ${
                  a.isCorrect ? 'text-success' : 'text-danger'
                }`}
              >
                {a.isCorrect ? 'Benar' : 'Salah'}
              </div>
            </div>
          );
        })}
      </div>

      <div className='mt-6 flex gap-2'>
        <button
          className='btn-primary'
          onClick={() => {
            // clear final & resume (start fresh)
            localStorage.removeItem('quiz_final_v1');
            localStorage.removeItem('quiz_resume_v1');
            navigate('/quiz-setup');
          }}
        >
          Mulai Ulang
        </button>

        <button
          className='btn-secondary'
          onClick={() => {
            localStorage.removeItem('quiz_final_v1');
            localStorage.removeItem('quiz_resume_v1');
            navigate('/');
          }}
        >
          Selesai / Logout
        </button>
      </div>
    </div>
  );
};

export default QuizResultPage;
