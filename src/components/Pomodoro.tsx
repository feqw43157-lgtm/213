import { useState, useEffect, useRef } from 'react';
import { playSound, speak } from '../utils/sounds';

interface Props {
  onComplete: () => void;
  totalCompleted: number;
}

type Mode = 'work' | 'shortBreak' | 'longBreak';

const MODES: Record<Mode, { label: string; duration: number; color: string; icon: string }> = {
  work: { label: 'Робота', duration: 25 * 60, color: 'from-red-500 to-orange-500', icon: '🍅' },
  shortBreak: { label: 'Коротка перерва', duration: 5 * 60, color: 'from-green-500 to-emerald-500', icon: '☕' },
  longBreak: { label: 'Довга перерва', duration: 15 * 60, color: 'from-blue-500 to-cyan-500', icon: '🌴' },
};

export default function Pomodoro({ onComplete, totalCompleted }: Props) {
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      handleComplete();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleComplete = () => {
    playSound('timer');
    if (mode === 'work') {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      onComplete();
      
      if (newSessions % 4 === 0) {
        speak('Чудово! Час на довгу перерву!');
        setMode('longBreak');
        setTimeLeft(MODES.longBreak.duration);
      } else {
        speak('Гарна робота! Коротка перерва.');
        setMode('shortBreak');
        setTimeLeft(MODES.shortBreak.duration);
      }
    } else {
      speak('Перерва закінчилась. Час працювати!');
      setMode('work');
      setTimeLeft(MODES.work.duration);
    }
  };

  const switchMode = (newMode: Mode) => {
    if (isRunning) return;
    playSound('click');
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
  };

  const toggleTimer = () => {
    playSound('click');
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    playSound('click');
    setIsRunning(false);
    setTimeLeft(MODES[mode].duration);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - (timeLeft / MODES[mode].duration);
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">🍅 Помідорний таймер</h2>

      {/* Mode Selector */}
      <div className="flex gap-2 justify-center">
        {(Object.keys(MODES) as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            disabled={isRunning}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === m
                ? `bg-gradient-to-r ${MODES[m].color} text-white shadow-lg`
                : 'bg-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-50'
            }`}
          >
            {MODES[m].icon} {MODES[m].label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="flex justify-center py-8">
        <div className="relative">
          <svg width="280" height="280" className="-rotate-90">
            <circle
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
            />
            <circle
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke="url(#timerGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={mode === 'work' ? '#ef4444' : mode === 'shortBreak' ? '#22c55e' : '#3b82f6'} />
                <stop offset="100%" stopColor={mode === 'work' ? '#f97316' : mode === 'shortBreak' ? '#10b981' : '#06b6d4'} />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-mono font-bold tracking-wider">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-400 mt-2">{MODES[mode].label}</div>
            {isRunning && (
              <div className="mt-2 flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-red-400">В процесі</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={toggleTimer}
          className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 ${
            isRunning
              ? 'bg-white/10 hover:bg-white/15 text-white'
              : `bg-gradient-to-r ${MODES[mode].color} text-white shadow-lg hover:shadow-xl`
          }`}
        >
          {isRunning ? '⏸ Пауза' : '▶ Старт'}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 transition-all hover:scale-105"
        >
          🔄 Скинути
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{sessions}</p>
          <p className="text-xs text-gray-400">Сесій сьогодні</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-orange-400">{totalCompleted}</p>
          <p className="text-xs text-gray-400">Всього помідорів</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{Math.round(sessions * 25 / 60 * 10) / 10}г</p>
          <p className="text-xs text-gray-400">Годин фокусу</p>
        </div>
      </div>

      {/* Tips */}
      <div className="glass rounded-xl p-4 border-l-4 border-red-500">
        <p className="text-sm text-gray-300">
          💡 <strong>Порада:</strong> Працюй 25 хвилин без відволікань, потім 5 хвилин відпочинь. 
          Кожні 4 сесії — довга перерва 15 хвилин.
        </p>
      </div>
    </div>
  );
}
