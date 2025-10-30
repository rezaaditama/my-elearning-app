import FormSetupQuiz from '../layouts/FormSetupQuiz';
import { useNavigate } from 'react-router-dom';
import type { quizConfig } from '../schemas/quizConfig';

const SetupQuizPage = () => {
  //UseNavigate
  const navigate = useNavigate();

  const handleStart = (userConfiguration: quizConfig) => {
    //Simpan di localstorage dan arahkan ke quiz session
    try {
      localStorage.setItem('quiz_config_v1', JSON.stringify(userConfiguration));
      navigate('/quiz-session');
    } catch (error) {
      console.error('Failed to save quiz config', error);
    }
  };

  return <FormSetupQuiz onSubmit={handleStart} />;
};

export default SetupQuizPage;
