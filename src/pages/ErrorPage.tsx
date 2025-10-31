import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Arahkan ke halaman login
  const handleBackHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-neutral-50 text-center px-4'>
      <h1 className='text-5xl font-bold text-primary mb-2'>Oops!</h1>
      <h2 className='text-2xl font-semibold text-neutral-700 mb-4'>
        404 - Page Not Found
      </h2>

      <p className='text-neutral-600 mb-6 max-w-md'>
        The page you are looking for might have been removed had it's name
        changed or is temporary unavailable
      </p>

      <Button
        variant='primary'
        onClick={handleBackHome}
        className='w-auto px-6 py-2'
      >
        Back to Login
      </Button>
    </div>
  );
};

export default NotFoundPage;
