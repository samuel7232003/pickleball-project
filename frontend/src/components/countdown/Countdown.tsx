import { useEffect, useState } from 'react';
import css from './Countdown.module.css';
import text from '../../util/text';

interface CountdownTime {
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  initialTime: number; // in minutes
  onExpire?: () => void;
  className?: string;
}

export default function Countdown({ initialTime, onExpire, className }: CountdownProps) {
  const [countdown, setCountdown] = useState<CountdownTime>({
    minutes: initialTime,
    seconds: 0,
  });
  const [countdownTimer, setCountdownTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(countdownInterval);
          onExpire?.();
          return prev;
        }

        if (prev.seconds === 0) {
          return {
            minutes: prev.minutes - 1,
            seconds: 59,
          };
        }

        return {
          ...prev,
          seconds: prev.seconds - 1,
        };
      });
    }, 1000);

    setCountdownTimer(countdownInterval);

    return () => {
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
    };
  }, [initialTime, onExpire]);

  return (
    <div className={`${css.countdownContainer} ${className || ''}`}>
      <div className={css.countdownTitle}>{text["Countdown.title"]}</div>
      <div className={`${css.countdownClock} ${countdown.minutes === 0 ? css.countdownWarning : ''}`}>
        <div className={css.countdownUnit}>
          <span>{String(countdown.minutes).padStart(2, '0')}</span>
          <span className={css.countdownLabel}>{text["Countdown.minutes"]}</span>
        </div>
        <span>:</span>
        <div className={css.countdownUnit}>
          <span>{String(countdown.seconds).padStart(2, '0')}</span>
          <span className={css.countdownLabel}>{text["Countdown.seconds"]}</span>
        </div>
      </div>
    </div>
  );
} 