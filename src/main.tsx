import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import LoginPage from './pages/LoginPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import QuizPage from './pages/SetupQuizPage';
import QuizSessionPage from './pages/QuizSessionPage';
import QuizResultPage from './pages/ResultQuizPage';
import { requireAuthLoader } from './utils/auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/quiz-setup',
    element: <QuizPage />,
    loader: requireAuthLoader,
  },
  {
    path: '/quiz-session',
    element: <QuizSessionPage />,
    loader: requireAuthLoader,
  },
  {
    path: '/quiz-result',
    element: <QuizResultPage />,
    loader: requireAuthLoader,
  },
]);

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <RouterProvider router={router} />
  // </StrictMode>
);
