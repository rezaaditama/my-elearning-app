import { useEffect, useRef } from 'react';

//Hooks untuk set interval
export const useInterval = (
  callback: () => void,
  delay: number | null
): void => {
  const savedRef = useRef(callback);
  useEffect(() => {
    savedRef.current = callback;
  }, [callback]);
  useEffect(() => {
    //Kalau delay = null maka return
    if (delay === null) return;
    const id = setInterval(() => savedRef.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};
