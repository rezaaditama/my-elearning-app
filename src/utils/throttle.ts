export const throttle = (fn: (...params: any[]) => void, delay = 500) => {
  let last = 0;
  return (...params: any[]) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...params);
    }
  };
};
