import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Form/Input';
import { useEffect } from 'react';
import { userSchemas, type IUser } from '../schemas';
import { useLocalStorage } from '../Hooks/useLocalStorage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

//user validator
type UserForm = Omit<IUser, 'loggedAt'>;

//localstorage user
const LOCALSTORAGE_KEY = 'quiz_user';

const AuthLayout: React.FC = () => {
  const navigate = useNavigate();
  const [savedUser, setSavedUser] = useLocalStorage<IUser>(
    LOCALSTORAGE_KEY,
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserForm>({
    resolver: zodResolver(userSchemas.omit({ loggedAt: true })),
    defaultValues: savedUser
      ? { email: savedUser?.email, fullname: savedUser?.fullname }
      : undefined,
  });

  useEffect(() => {
    if (savedUser)
      reset({ email: savedUser.email, fullname: savedUser.fullname });
  }, [savedUser, reset]);

  //Handle Submit
  const onSubmit = async (values: UserForm) => {
    const data = userSchemas.safeParse({
      ...values,
      loggedAt: new Date().toISOString(),
    });
    if (!data.success) {
      console.warn('Invalid user payload', data.error);
      return;
    }
    setSavedUser(data.data);
    navigate('/quiz-setup');
  };
  return (
    <form
      className='w-1/3 p-5 rounded-md space-y-2 shadow-md bg-surface'
      onSubmit={handleSubmit(onSubmit)}
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
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label='Fullname'
          id='fullname'
          type='text'
          placeholder='Enter your fullname'
          {...register('fullname')}
          error={errors.fullname?.message}
        />
      </div>

      <div className='text-center space-y-2'>
        <Button type='submit' disabled={isSubmitting}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default AuthLayout;
