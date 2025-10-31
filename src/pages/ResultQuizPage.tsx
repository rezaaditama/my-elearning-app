import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';

type QuestionLike = {
  id?: string;
  question: string;
  choices?: string[];
  correctAnswer?: string;
};

type LocationState = {
  questions?: QuestionLike[];
  answers?: {
    questionIdx: number;
    selected: string;
    correct?: string;
    isCorrect: boolean;
    answeredAt?: number;
  }[];
  totalTime?: number;
  startedAt?: string | number;
  finishedAt?: string | number;
};

const downloadFile = (
  filename: string,
  content: string,
  mime = 'application/json'
) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const toCSV = (questions: QuestionLike[], answers: any[]) => {
  const rows = [
    ['No', 'Question', 'Your Answer', 'Correct Answer', 'Is Correct'],
    ...answers.map((a: any) => {
      const q = questions[a.questionIdx] ?? { question: '-' };
      return [
        String(a.questionIdx + 1),
        q.question?.replace(/\n/g, ' ') ?? '-',
        a.selected ?? '-',
        a.correct ?? '-',
        a.isCorrect ? 'TRUE' : 'FALSE',
      ];
    }),
  ];
  return rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
};

const QuizResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const locationState = (state ?? {}) as LocationState;

  // fallback to persisted results
  const fallback = useMemo(() => {
    try {
      const raw =
        localStorage.getItem('quiz_final_v1') ||
        localStorage.getItem('quiz_resume_v1');
      return raw ? (JSON.parse(raw) as LocationState) : null;
    } catch {
      return null;
    }
  }, []);

  const data = {
    questions: (locationState.questions ??
      fallback?.questions ??
      []) as QuestionLike[],
    answers: (locationState.answers ?? fallback?.answers ?? []) as any[],
    totalTime: locationState.totalTime ?? fallback?.totalTime ?? 0,
    startedAt: locationState.startedAt ?? fallback?.startedAt ?? null,
    finishedAt:
      locationState.finishedAt ??
      fallback?.finishedAt ??
      new Date().toISOString(),
  };

  const total = data.questions.length;
  const answeredCount = data.answers.length;
  const correctCount = data.answers.filter((a) => a.isCorrect).length;
  const wrongCount = answeredCount - correctCount;
  const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // if no data, redirect to setup
  if (!data.questions || data.questions.length === 0) {
    setTimeout(() => navigate('/quiz-setup'), 300);
    return (
      <div className='p-6 text-center'>
        Tidak ada data hasil. Mengarahkan ke halaman setup...
      </div>
    );
  }

  const handleRestart = () => {
    localStorage.removeItem('quiz_final_v1');
    localStorage.removeItem('quiz_resume_v1');
    navigate('/quiz-setup');
  };

  const handleFinish = () => {
    localStorage.removeItem('quiz_final_v1');
    localStorage.removeItem('quiz_resume_v1');
    localStorage.removeItem('quiz_user');
    navigate('/');
  };

  const handleDownloadJSON = () => {
    const payload = {
      meta: {
        total,
        answeredCount,
        correctCount,
        wrongCount,
        totalTime: data.totalTime,
      },
      questions: data.questions,
      answers: data.answers,
    };
    downloadFile(
      `quiz-result-${new Date().toISOString()}.json`,
      JSON.stringify(payload, null, 2),
      'application/json'
    );
  };

  const handleExportCSV = () => {
    const csv = toCSV(data.questions, data.answers);
    downloadFile(
      `quiz-result-${new Date().toISOString()}.csv`,
      csv,
      'text/csv'
    );
  };

  const handlePrint = () => window.print();

  return (
    <main className='min-h-screen min-w-screen flex items-start justify-center bg-neutral-50 p-6'>
      <div className='w-full max-w-5xl'>
        {/* Header */}
        <header className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-extrabold text-neutral-900'>
              Quiz Results
            </h1>
            <p className='text-sm text-neutral-600 mt-1'>
              Summary of results & answer details
            </p>
          </div>

          <div className='flex flex-row gap-2'>
            <Button
              onClick={handleDownloadJSON}
              className='px-3 py-2 rounded-md borde text-sm'
              aria-label='Download JSON'
              variant='primary'
            >
              Download JSON
            </Button>
            <Button
              onClick={handleExportCSV}
              className='px-3 py-2 rounded-md bordertext-sm'
              aria-label='Export CSV'
              variant='secondary'
            >
              Export CSV
            </Button>
            <Button
              onClick={handlePrint}
              className='px-3 py-2 rounded-md border text-sm'
              aria-label='Print result'
              variant='primary'
            >
              Print
            </Button>
          </div>
        </header>

        {/* Content Grid */}
        <section className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
          {/* Left: Summary */}
          <aside className='lg:col-span-1 bg-white border rounded-lg p-5 shadow-sm'>
            <div className='flex items-center gap-4'>
              <div className='w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary'>
                {scorePercent}%
              </div>
              <div>
                <h2 className='text-lg font-semibold'>Score</h2>
                <p className='text-sm text-neutral-600'>
                  True: {correctCount} • Wrong: {wrongCount}
                </p>
                <p className='text-sm text-neutral-600'>
                  Total questions: {total}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className='mt-4'>
              <div
                className='w-full bg-neutral-100 rounded-full h-3 overflow-hidden'
                role='progressbar'
                aria-valuenow={scorePercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label='Score progress'
              >
                <div
                  style={{ width: `${scorePercent}%` }}
                  className='h-3 bg-primary transition-all'
                />
              </div>
              <div className='mt-2 text-xs text-neutral-500'>
                Score: {scorePercent}%
              </div>
            </div>

            {/* Stats */}
            <div className='mt-6 grid grid-cols-2 gap-2'>
              <div className='p-3 bg-neutral-50 border rounded'>
                <div className='text-sm text-neutral-500'>Answered</div>
                <div className='text-xl font-semibold'>{answeredCount}</div>
              </div>
              <div className='p-3 bg-neutral-50 border rounded'>
                <div className='text-sm text-neutral-500'>Not Answered</div>
                <div className='text-xl font-semibold'>
                  {total - answeredCount}
                </div>
              </div>
              <div className='p-3 bg-neutral-50 border rounded'>
                <div className='text-sm text-neutral-500'>Time (second)</div>
                <div className='text-xl font-semibold'>{data.totalTime}</div>
              </div>
              <div className='p-3 bg-neutral-50 border rounded'>
                <div className='text-sm text-neutral-500'>Date</div>
                <div className='text-base font-semibold'>
                  {new Date(data.finishedAt ?? Date.now()).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='mt-6 flex flex-col gap-2'>
              <Button
                onClick={handleRestart}
                className='w-full px-4 py-2 rounded-md font-semibold'
                aria-label='Mulai ulang'
                variant='primary'
              >
                Start Again
              </Button>
              <Button
                onClick={handleFinish}
                className='w-full px-4 py-2'
                aria-label='Selesai dan keluar'
                variant='accent'
              >
                Logout
              </Button>
            </div>
          </aside>

          {/* Detail Jawaban */}
          <main className='lg:col-span-2'>
            <div
              className='bg-white border rounded-lg p-5 shadow-sm space-y-4'
              aria-live='polite'
            >
              <h3 className='text-lg font-semibold'>Answer Details</h3>

              <ol className='space-y-3'>
                {data.answers.map((a, idx) => {
                  const q = data.questions[a.questionIdx] ?? { question: '—' };

                  return (
                    <li key={idx} className='p-4 border rounded-lg'>
                      <div className='flex items-start justify-between gap-4'>
                        <div className='flex-1'>
                          <div className='text-sm text-neutral-600 mb-2'>
                            Question {a.questionIdx + 1}
                          </div>
                          <div className='font-medium text-neutral-900 mb-2'>
                            {q.question}
                          </div>

                          <div className='grid gap-2'>
                            {/* show choices, show your answer + correct */}
                            {Array.isArray(q.choices) &&
                            q.choices.length > 0 ? (
                              q.choices.map((c, ci) => {
                                const isSelected =
                                  String(c) === String(a.selected);
                                const isCorrect =
                                  String(c) === String(a.correct);
                                return (
                                  <div
                                    key={ci}
                                    className={`p-2 rounded flex items-center gap-3 text-sm border ${
                                      isCorrect
                                        ? 'bg-success/10 border-success'
                                        : isSelected
                                        ? 'bg-primary/10 border-primary'
                                        : 'bg-neutral-50 border-neutral-100'
                                    }`}
                                  >
                                    <div
                                      className={`w-3 h-3 rounded-full ${
                                        isCorrect
                                          ? 'bg-success'
                                          : isSelected
                                          ? 'bg-primary'
                                          : 'bg-neutral-300'
                                      }`}
                                    />
                                    <div
                                      className={`${
                                        isCorrect
                                          ? 'font-semibold text-success'
                                          : isSelected
                                          ? 'font-semibold text-primary'
                                          : 'text-neutral-700'
                                      }`}
                                    >
                                      {c}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className='space-y-1 text-sm'>
                                <div>
                                  <span className='text-neutral-500'>
                                    Your answer:{' '}
                                  </span>
                                  <span className='font-medium'>
                                    {a.selected}
                                  </span>
                                </div>
                                <div>
                                  <span className='text-neutral-500'>
                                    Correct answer:{' '}
                                  </span>
                                  <span className='font-medium'>
                                    {a.correct ?? '-'}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className='w-32 text-right'>
                          <div
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              a.isCorrect
                                ? 'bg-success/10 text-success'
                                : 'bg-danger/10 text-danger'
                            }`}
                          >
                            {a.isCorrect ? 'True' : 'False'}
                          </div>
                          <div className='mt-2 text-xs text-neutral-500'>
                            {a.answeredAt
                              ? new Date(a.answeredAt).toLocaleTimeString()
                              : ''}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </main>
        </section>
      </div>
    </main>
  );
};

export default QuizResultPage;
