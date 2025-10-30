// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   clearQuizState,
//   loadQuizState,
//   saveQuizState,
//   type StoredAnswer,
//   type StoredQuizState,
// } from '../utils/storage';
// import { useInterval } from '../Hooks/useInterval';
// import { fetchQuestions } from '../services/services.opentdb';
// import QuestionCard from '../components/QuestionCard';
// import { decodeHtml } from '../utils/htmlDecode';

// const QuizSessionPage = () => {
//   const navigate = useNavigate();

//   //Local State
//   const [loading, setLoading] = useState(false);
//   const [questions, setQuestions] = useState<any[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answer, setAnswer] = useState<StoredAnswer[]>([]);
//   const [startedAt, setStartedAt] = useState<number | null>(null);
//   const [totalTime, setTotalTime] = useState<number>(300);
//   const [timeLeft, setTimeLeft] = useState<number>(300);
//   const [finished, setFinished] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   //Restore session
//   useEffect(() => {
//     const saved = loadQuizState();
//     if (saved && saved.question && !saved.finished) {
//       setQuestions(saved.question || []);
//       setAnswer(saved.answers || []);
//       setCurrentIndex(saved.currentIndex ?? 0);
//       setStartedAt(saved.startedAt ?? Date.now());
//       setTotalTime(saved.totalTime ?? 300);

//       //Set time left
//       const timeNow = Math.floor(
//         (Date.now() - (saved.startedAt ?? Date.now())) / 1000
//       );
//       const left = Math.max(0, (saved.totalTime ?? 300) - timeNow);
//       setTimeLeft(left);
//       if (left <= 0) {
//         setFinished(true);
//       }
//       return;
//     }

//     //Read Config and Fetch Questions
//     const dataConfiguration = localStorage.getItem('quiz_config_v1');
//     if (!dataConfiguration) {
//       setError('Konfigurasi kuis tidak ditemukan');
//       return;
//     }

//     const userConfiguration = JSON.parse(dataConfiguration) as {
//       amount: number;
//       category?: number;
//       difficulty?: string;
//       type?: string;
//       totalTime: number;
//     };

//     startNewSession(userConfiguration).catch((error: any) => {
//       console.error(error);
//       setError(String(error) || 'Gagal Memulai Kuis');
//     });
//   }, []);

//   //Timer
//   useInterval(() => {
//     if (!startedAt || finished) return;
//     const elapsed = Math.floor((Date.now() - startedAt) / 1000);
//     const left = Math.max(0, totalTime - elapsed);
//     setTimeLeft(left);
//     if (left <= 0) {
//       handleFinish();
//     }
//   }, 1000);

//   const startNewSession = async (userConfiguration: {
//     amount: number;
//     category?: number;
//     difficulty?: string;
//     type?: string;
//     totalTime: number;
//   }) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const data = await fetchQuestions({
//         amount: userConfiguration.amount,
//         category: userConfiguration.category,
//         difficulty: userConfiguration.difficulty,
//         type: userConfiguration.type,
//       });
//       setQuestions(data);
//       setAnswer([]);
//       setCurrentIndex(0);

//       const now = Date.now();
//       setStartedAt(now);
//       setTotalTime(userConfiguration.totalTime ?? 300);
//       setTimeLeft(userConfiguration.totalTime ?? 300);
//       setFinished(false);

//       //Initial State
//       const state: StoredQuizState = {
//         question: data,
//         answers: [],
//         currentIndex: 0,
//         startedAt: now,
//         totalTime: userConfiguration.totalTime ?? 300,
//         finished: false,
//         amount: userConfiguration.amount,
//         type: userConfiguration.type,
//       };
//       saveQuizState(state);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fungsi Handle Answer
//   const handleAnswer = (choices: string) => {
//     if (!questions[currentIndex]) return;

//     //Mencegah jawaban double
//     if (answer.find((choice) => choice.questionIdx === currentIndex)) {
//       return;
//     }

//     //Menyimpan jawaban baru
//     const question = questions[currentIndex];
//     const correct = question.correct_answer;
//     const isCorrect = choices === correct;
//     const answers: StoredAnswer = {
//       questionIdx: currentIndex,
//       selected: choices,
//       correct,
//       isCorrect,
//       answeredAt: Date.now(),
//     };

//     const newAnswer = [...answer, answers];
//     setAnswer(newAnswer);

//     //Persist
//     const persisted: StoredQuizState = {
//       question,
//       answers: newAnswer,
//       currentIndex: currentIndex + 1,
//       startedAt: startedAt ?? Date.now(),
//       totalTime,
//       finished: false,
//       amount: questions.length,
//       type: questions[0]?.type,
//     };
//     saveQuizState(persisted);

//     //Auto Advance
//     if (currentIndex + 1 < questions.length) {
//       setCurrentIndex((i) => i + 1);
//     } else {
//       handleFinish();
//     }
//   };

//   //Handle Finish
//   const handleFinish = () => {
//     setFinished(true);

//     //Update persisted
//     const persisted = {
//       questions,
//       answer,
//       currentIndex,
//       startedAt: startedAt ?? Date.now(),
//       totalTime,
//       finished: true,
//       amount: questions.length,
//       type: questions[0]?.type,
//     };
//     saveQuizState(persisted);
//   };

//   //Handle Abort
//   const handleAbort = () => {
//     if (
//       !confirm(
//         'Apakah anda yakin akan membatalkan kuis? progres anda akan dihapus'
//       )
//     )
//       return;
//     clearQuizState();
//     navigate('/quiz-setup');
//   };

//   //Handle Submit and Exit
//   const handleSubmitAndExit = () => {
//     navigate('quiz-result', {
//       state: { questions, answer, totalTime, startedAt },
//     });
//   };

//   const total = questions.length;
//   const answeredCount = answer.length;
//   const correctCount = answer.filter((correct) => correct.isCorrect).length;
//   const wrongCount = answeredCount - correctCount;

//   //Format Date
//   const formatTime = (second: number) => {
//     const minute = Math.floor(second / 60);
//     const sec = second % 60;
//     return `${minute}:${sec.toString().padStart(2, '0')}`;
//   };
//   // UI states
//   if (error) {
//     return (
//       <div className='p-6 max-w-xl mx-auto'>
//         <div className='card'>
//           <div className='text-danger mb-3'>{error}</div>
//           <div className='flex gap-2'>
//             <button
//               onClick={() => navigate('/quiz-setup')}
//               className='btn-secondary'
//             >
//               Back to setup
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (loading && !questions.length) {
//     return (
//       <div className='page-center'>
//         <div>Loading questions...</div>
//       </div>
//     );
//   }

//   if (finished || timeLeft <= 0) {
//     return (
//       <div className='p-6 max-w-xl mx-auto'>
//         <div className='card'>
//           <h2 className='text-xl font-semibold mb-4'>Hasil Kuis</h2>
//           <p>Total soal: {total}</p>
//           <p>Jumlah dijawab: {answeredCount}</p>
//           <p>Benar: {correctCount}</p>
//           <p>Salah: {wrongCount}</p>

//           <div className='mt-4 flex gap-2'>
//             <button
//               className='btn-primary'
//               onClick={() => {
//                 clearQuizState();
//                 navigate('/quiz-setup');
//               }}
//             >
//               Mulai Ulang
//             </button>
//             <button
//               className='btn-secondary'
//               onClick={() => {
//                 clearQuizState();
//                 navigate('/');
//               }}
//             >
//               Logout
//             </button>
//           </div>

//           <hr className='my-4' />

//           <h3 className='font-semibold mb-2'>Detail Jawaban</h3>
//           <div className='space-y-3'>
//             {answer.map((a) => {
//               const q = questions[a.questionIdx];
//               return (
//                 <div key={a.questionIdx} className='p-3 border rounded'>
//                   <div className='text-sm mb-1'>{decodeHtml(q.question)}</div>
//                   <div className='text-xs'>
//                     Jawaban kamu: {decodeHtml(a.selected)}
//                   </div>
//                   <div className='text-xs'>
//                     Jawaban benar: {decodeHtml(a.correct)}
//                   </div>
//                   <div
//                     className={`text-xs ${
//                       a.isCorrect ? 'text-success' : 'text-danger'
//                     }`}
//                   >
//                     {a.isCorrect ? 'Benar' : 'Salah'}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // normal quiz UI
//   return (
//     <div className='p-6 max-w-xl mx-auto'>
//       <div className='flex justify-between items-center mb-4'>
//         <div>
//           Total soal: {total} | Dikerjakan: {answeredCount}
//         </div>
//         <div>
//           Time left: <span className='font-mono'>{formatTime(timeLeft)}</span>
//         </div>
//       </div>

//       <div className='card animation-card'>
//         <h3 className='mb-2'>
//           Soal {currentIndex + 1} / {total}
//         </h3>

//         <QuestionCard
//           question={questions[currentIndex]}
//           onAnswer={handleAnswer}
//           disabled={finished}
//         />

//         <div className='mt-4 flex gap-2'>
//           <button
//             onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
//             disabled={currentIndex === 0}
//           >
//             Prev
//           </button>
//           <button
//             onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
//             disabled={currentIndex === total - 1}
//           >
//             Next
//           </button>
//           <button onClick={() => handleFinish()} className='ml-auto'>
//             Submit
//           </button>
//           <button onClick={() => handleAbort()} className='ml-2 btn-secondary'>
//             Abort
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizSessionPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  clearQuizState,
  loadQuizState,
  saveQuizState,
  type StoredAnswer,
  type StoredQuizState,
} from '../utils/storage';
import { useInterval } from '../Hooks/useInterval';
import { fetchQuestions } from '../services/services.opentdb';
import QuestionCard from '../components/QuestionCard';
import { decodeHtml } from '../utils/htmlDecode';

const QuizSessionPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<number>(300);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore or start
  useEffect(() => {
    const saved = loadQuizState();
    if (saved && Array.isArray(saved.questions) && !saved.finished) {
      setQuestions(saved.questions);
      setAnswers(saved.answers ?? []);
      setCurrentIndex(saved.currentIndex ?? 0);
      setStartedAt(saved.startedAt ?? Date.now());
      setTotalTime(saved.totalTime ?? 300);
      const elapsed = Math.floor(
        (Date.now() - (saved.startedAt ?? Date.now())) / 1000
      );
      const left = Math.max(0, (saved.totalTime ?? 300) - elapsed);
      setTimeLeft(left);
      if (left <= 0) setFinished(true);
      return;
    }

    const cfgRaw = localStorage.getItem('quiz_config_v1');
    if (!cfgRaw) {
      setError('Konfigurasi kuis tidak ditemukan. Kembali ke setup.');
      return;
    }
    const cfg = JSON.parse(cfgRaw) as {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(() => {
    if (!startedAt || finished) return;
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    const left = Math.max(0, totalTime - elapsed);
    setTimeLeft(left);
    if (left <= 0) handleFinish();
  }, 1000);

  async function startNewSession(cfg: {
    amount: number;
    category?: number;
    difficulty?: string;
    type?: string;
    totalTime: number;
  }) {
    setLoading(true);
    setError(null);
    try {
      const qs = await fetchQuestions({
        amount: cfg.amount,
        category: cfg.category,
        difficulty: cfg.difficulty,
        type: cfg.type,
      });
      setQuestions(qs);
      setAnswers([]);
      setCurrentIndex(0);
      const now = Date.now();
      setStartedAt(now);
      const tt = cfg.totalTime ?? 300;
      setTotalTime(tt);
      setTimeLeft(tt);
      setFinished(false);

      const state: StoredQuizState = {
        questions: qs,
        answers: [],
        currentIndex: 0,
        startedAt: now,
        totalTime: tt,
        finished: false,
        amount: cfg.amount,
        type: cfg.type,
      };
      saveQuizState(state);
    } finally {
      setLoading(false);
    }
  }

  const handleAnswer = (choice: string) => {
    if (!questions[currentIndex]) return;
    // prevent double
    if (answers.some((a) => a.questionIdx === currentIndex)) return;

    const q = questions[currentIndex];
    const correct = q.correct_answer;
    const isCorrect = choice === correct;
    const ans: StoredAnswer = {
      questionIdx: currentIndex,
      selected: choice,
      correct,
      isCorrect,
      answeredAt: Date.now(),
    };

    const nextAnswers = [...answers, ans];
    setAnswers(nextAnswers);

    const persisted: StoredQuizState = {
      questions,
      answers: nextAnswers,
      currentIndex: currentIndex + 1,
      startedAt: startedAt ?? Date.now(),
      totalTime,
      finished: false,
      amount: questions.length,
      type: questions[0]?.type,
    };
    saveQuizState(persisted);

    if (currentIndex + 1 < questions.length) setCurrentIndex((i) => i + 1);
    else handleFinish();
  };

  const handleFinish = () => {
    setFinished(true);
    const persisted: StoredQuizState = {
      questions,
      answers,
      currentIndex,
      startedAt: startedAt ?? Date.now(),
      totalTime,
      finished: true,
      amount: questions.length,
      type: questions[0]?.type,
    };
    saveQuizState(persisted);
  };

  const handleAbort = () => {
    if (!confirm('Yakin batalkan kuis? Progress akan dihapus.')) return;
    clearQuizState();
    navigate('/quiz-setup');
  };

  const handleSubmitAndExit = () => {
    // navigate to result page (leading slash)
    navigate('/quiz-result', {
      state: { questions, answers, totalTime, startedAt },
    });
  };

  // derived
  const total = questions.length;
  const answeredCount = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const wrongCount = answeredCount - correctCount;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // UI guards
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
      <div className='p-6 max-w-xl mx-auto'>
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

          <hr className='my-4' />
          <h3 className='font-semibold mb-2'>Detail Jawaban</h3>
          <div className='space-y-3'>
            {answers.map((a) => {
              const q = questions[a.questionIdx];
              return (
                <div key={a.questionIdx} className='p-3 border rounded'>
                  <div className='text-sm mb-1'>{decodeHtml(q.question)}</div>
                  <div className='text-xs'>
                    Jawaban kamu: {decodeHtml(a.selected)}
                  </div>
                  <div className='text-xs'>
                    Jawaban benar: {decodeHtml(a.correct)}
                  </div>
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
        </div>
      </div>
    );
  }

  // normal quiz UI - guard that question exists
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return (
      <div className='page-center'>
        <div>Menunggu soal...</div>
      </div>
    );
  }

  return (
    <div className='p-6 max-w-xl mx-auto'>
      <div className='flex justify-between items-center mb-4'>
        <div>
          Total soal: {total} | Dikerjakan: {answeredCount}
        </div>
        <div>
          Time left: <span className='font-mono'>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className='card animation-card'>
        <h3 className='mb-2'>
          Soal {currentIndex + 1} / {total}
        </h3>

        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          disabled={finished}
        />

        <div className='mt-4 flex gap-2'>
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
            disabled={currentIndex === total - 1}
          >
            Next
          </button>
          <button onClick={() => handleFinish()} className='ml-auto'>
            Submit
          </button>
          <button onClick={() => handleAbort()} className='ml-2 btn-secondary'>
            Abort
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSessionPage;
