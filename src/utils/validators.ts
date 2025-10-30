//Utils email validator
export const emailValidator = (email: string) => {
  const emailValid = email.trim();
  return /\S+@\S+\.\S+/.test(emailValid);
};
