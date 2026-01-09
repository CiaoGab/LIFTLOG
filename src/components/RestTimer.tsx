import React, { useState, useEffect, useCallback } from 'react';

interface RestTimerProps {
  initialSeconds?: number;
  onDismiss: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({ initialSeconds = 90, onDismiss }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          setIsRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const formatTime = useCallback((s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const addTime = (amount: number) => {
    setSeconds(s => Math.max(0, s + amount));
    setIsRunning(true);
  };

  const progress = ((initialSeconds - seconds) / initialSeconds) * 100;

  return (
    <div className="flex items-center gap-2 bg-primary/10 rounded-full pl-1 pr-2 py-1">
      {/* Progress ring */}
      <div className="relative size-8 flex items-center justify-center">
        <svg className="size-8 -rotate-90" viewBox="0 0 32 32">
          <circle
            cx="16" cy="16" r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-primary/20"
          />
          <circle
            cx="16" cy="16" r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={88}
            strokeDashoffset={88 - (progress / 100) * 88}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000"
          />
        </svg>
        <span className="absolute text-[10px] font-bold text-primary">
          {seconds <= 0 ? '✓' : ''}
        </span>
      </div>

      {/* Time display */}
      <span className={`font-mono font-bold text-sm ${seconds <= 0 ? 'text-green-500' : 'text-primary'}`}>
        {seconds <= 0 ? 'Rest done!' : formatTime(seconds)}
      </span>

      {/* Quick adjust buttons */}
      <div className="flex gap-1">
        <button
          onClick={() => addTime(-15)}
          className="size-6 rounded-full bg-white dark:bg-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
        >
          -15
        </button>
        <button
          onClick={() => addTime(15)}
          className="size-6 rounded-full bg-white dark:bg-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
        >
          +15
        </button>
      </div>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="size-6 rounded-full hover:bg-white/50 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};

