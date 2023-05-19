export const countDownTimer = (countDown) => {
  if (isEnded(countDown)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const now = new Date().getTime() / 1000;

  const difference = countDown - now;

  const days = Math.floor(difference / (60 * 60 * 24));
  const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((difference % (60 * 60)) / 60);
  const seconds = Math.floor(difference % 60);

  return { days, hours, minutes, seconds };
};

export const isEnded = (time) => {
  // convert argument from  seconds to milliseconds
  time = time * 1000;
  const targetDate = new Date(time).getTime();
  const now = new Date().getTime();

  return now > targetDate ? true : false;
};
