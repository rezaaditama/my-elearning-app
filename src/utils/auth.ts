import { redirect } from 'react-router-dom';

export const requireAuthLoader = async () => {
  try {
    const user = localStorage.getItem('quiz_user');
    if (!user) {
      return redirect('/'); // redirect to login
    }
    return null;
  } catch {
    return redirect('/');
  }
};
