import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Form/Input';
import { useEffect, useState, type FormEvent } from 'react';

interface User {
  email: string;
  fullname: string;
  loggedAt?: string;
}

// Utils validasi email
const validateEmail = (value: string) => {
  const v = value.trim();
  return v.length > 3 && /\S+@\S+\.\S+/.test(v);
};

//localstorage user
const LOCALSTORAGE_KEY = 'quiz_user';

const AuthLayout = () => {
  const navigate = useNavigate();

  // Contoller Input
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [error, setError] = useState<string>('');

  //Backup user
  useEffect(() => {
    try {
      const data = localStorage.getItem(LOCALSTORAGE_KEY);
      if (data) {
        const user: Partial<User> = JSON.parse(data);
        setUser(user);
      }
    } catch (error) {
      console.warn('Failed to load user from localstorage', error);
    }
  }, []);

  //Handle Submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    //Validasi Input
    const email = (formData.get('email') as string)?.trim();
    const fullname = (formData.get('fullname') as string)?.trim();

    if (!email || !fullname) {
      setError('Email dan Nama harus diisi!');
      return;
    }

    if (!validateEmail(email)) {
      setError('Masukkan alamat email yang valid.');
      return;
    }

    //Menyimpan user ke localstorage
    const user: User = {
      email,
      fullname,
      loggedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(user));
      navigate('/quiz');
    } catch (error) {
      console.error('Gagal menyimpan data ke localstorage', error);
      setError(
        'Gagal menyimpan data. Pastikan browser mengizinkan penyimpanan'
      );
    }
  };

  const handleContinueSaved = () => {
    const data = localStorage.getItem(LOCALSTORAGE_KEY);
    if (!data) {
      alert('Tidak ada quiz yang tersimpan, silahkan login kembali');
      return;
    }
    navigate('/setup');
  };

  return (
    <form
      className='w-1/3 p-5 rounded-md space-y-2 shadow-md bg-surface'
      onSubmit={handleSubmit}
    >
      <div className='text-center'>
        <h1 className='font-bold text-3xl text-primary'>Welcome to Quiz App</h1>
        <p className='text-md text-neutral/80'>Log in to start your quiz</p>
      </div>
      <div className='space-y-2 py-2'>
        <Input
          label='Email'
          id='email'
          type='email'
          placeholder='Enter your e-mail'
          defaultValue={user?.email ?? ''}
          required
        />
        <Input
          label='Fullname'
          id='fullname'
          type='text'
          placeholder='Enter your name'
          defaultValue={user?.fullname ?? ''}
          required
        />
      </div>
      {error && (
        <div role='alert' className='text-sm text-danger'>
          {error}
        </div>
      )}
      <div className='text-center space-y-2'>
        <Button type='submit'>
          {localStorage.getItem(LOCALSTORAGE_KEY) ? 'Continue Quiz' : 'Submit'}
        </Button>
        <Button
          onClick={handleContinueSaved}
          variant='ghost'
          className='text-primary decoration-1 underline'
        >
          Lanjutkan quiz yang tersimpan
        </Button>
      </div>
    </form>
  );
};

export default AuthLayout;
