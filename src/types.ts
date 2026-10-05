export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  bestStreak: number;
  completedDates: string[];
  xpReward: number;
  category: 'health' | 'mind' | 'creative' | 'social';
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: number; // 1-5
  text: string;
  tags: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  condition: string;
}

export interface GameState {
  level: number;
  xp: number;
  xpToNext: number;
  totalXpEarned: number;
  habits: Habit[];
  journal: JournalEntry[];
  achievements: Achievement[];
  pomodoroCompleted: number;
  totalHabitsCompleted: number;
  streakDays: number;
  lastActiveDate: string;
  userName: string;
  createdAt: string;
}

export type Tab = 'dashboard' | 'habits' | 'pomodoro' | 'journal' | 'achievements';
