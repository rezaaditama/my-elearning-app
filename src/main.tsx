import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import LoginPage from './pages/LoginPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import QuizPage from './pages/SetupQuizPage';
import QuizSessionPage from './pages/QuizSessionPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/quiz-setup',
    element: <QuizPage />,
  },
  {
    path: '/quiz-session',
    element: <QuizSessionPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <RouterProvider router={router} />
  // </StrictMode>
);
