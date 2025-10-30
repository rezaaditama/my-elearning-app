import FormSetupQuiz, { type QuizConfig } from '../layouts/FormSetupQuiz';
import { useNavigate } from 'react-router-dom';

const SetupQuizPage = () => {
  //UseNavigate
  const navigate = useNavigate();

  const handleStart = (userConfiguration: QuizConfig) => {
    //Simpan di localstorage dan arahkan ke quiz session
    try {
      localStorage.setItem('quiz_config_v1', JSON.stringify(userConfiguration));
      navigate('/quiz-session');
    } catch {}
  };
  return <FormSetupQuiz onSubmit={handleStart} />;
};

export default SetupQuizPage;
