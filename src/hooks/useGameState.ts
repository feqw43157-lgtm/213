import { useState, useEffect, useCallback } from 'react';
import { GameState, Habit, JournalEntry, Achievement } from '../types';
import { playSound, speak } from '../utils/sounds';

const STORAGE_KEY = 'lifequest_data';

const defaultAchievements: Achievement[] = [
  { id: 'first_habit', name: 'Перший крок', description: 'Виконай першу звичку', icon: '🌱', unlocked: false, condition: 'totalHabitsCompleted >= 1' },
  { id: 'habits_10', name: 'На шляху', description: 'Виконай 10 звичок', icon: '🔥', unlocked: false, condition: 'totalHabitsCompleted >= 10' },
  { id: 'habits_50', name: 'Машина звичок', description: 'Виконай 50 звичок', icon: '⚡', unlocked: false, condition: 'totalHabitsCompleted >= 50' },
  { id: 'habits_100', name: 'Легенда', description: 'Виконай 100 звичок', icon: '👑', unlocked: false, condition: 'totalHabitsCompleted >= 100' },
  { id: 'streak_3', name: '3 дні поспіль', description: 'Серія 3 дні', icon: '📅', unlocked: false, condition: 'streakDays >= 3' },
  { id: 'streak_7', name: 'Тиждень сили', description: 'Серія 7 днів', icon: '💪', unlocked: false, condition: 'streakDays >= 7' },
  { id: 'streak_30', name: 'Місяць дисципліни', description: 'Серія 30 днів', icon: '🏆', unlocked: false, condition: 'streakDays >= 30' },
  { id: 'level_5', name: 'Рівень 5', description: 'Досягни 5 рівня', icon: '⭐', unlocked: false, condition: 'level >= 5' },
  { id: 'level_10', name: 'Рівень 10', description: 'Досягни 10 рівня', icon: '🌟', unlocked: false, condition: 'level >= 10' },
  { id: 'pomodoro_5', name: 'Фокусник', description: 'Заверши 5 помідорів', icon: '🍅', unlocked: false, condition: 'pomodoroCompleted >= 5' },
  { id: 'pomodoro_20', name: 'Майстер фокусу', description: 'Заверши 20 помідорів', icon: '🎯', unlocked: false, condition: 'pomodoroCompleted >= 20' },
  { id: 'journal_7', name: 'Письменник', description: '7 записів у щоденнику', icon: '📖', unlocked: false, condition: 'journal.length >= 7' },
];

function getDefaultState(): GameState {
  return {
    level: 1,
    xp: 0,
    xpToNext: 100,
    totalXpEarned: 0,
    habits: [],
    journal: [],
    achievements: defaultAchievements,
    pomodoroCompleted: 0,
    totalHabitsCompleted: 0,
    streakDays: 0,
    lastActiveDate: '',
    userName: '',
    createdAt: new Date().toISOString(),
  };
}

function loadState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with default achievements to include any new ones
      const mergedAchievements = defaultAchievements.map(da => {
        const savedAch = parsed.achievements?.find((a: Achievement) => a.id === da.id);
        return savedAch || da;
      });
      return { ...getDefaultState(), ...parsed, achievements: mergedAchievements };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return getDefaultState();
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

function calculateLevel(totalXp: number): { level: number; xp: number; xpToNext: number } {
  let level = 1;
  let xpNeeded = 100;
  let remainingXp = totalXp;
  
  while (remainingXp >= xpNeeded) {
    remainingXp -= xpNeeded;
    level++;
    xpNeeded = Math.floor(100 * Math.pow(1.3, level - 1));
  }
  
  return { level, xp: remainingXp, xpToNext: xpNeeded };
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function useGameState() {
  const [state, setState] = useState<GameState>(loadState);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [leveledUp, setLeveledUp] = useState(false);

  // Save on every state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Check streak on load
  useEffect(() => {
    const today = getToday();
    if (state.lastActiveDate && state.lastActiveDate !== today) {
      const lastDate = new Date(state.lastActiveDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        // Streak broken
        setState(s => ({ ...s, streakDays: 0 }));
      }
    }
  }, []);

  const checkAchievements = useCallback((newState: GameState) => {
    let unlockedAny = false;
    const updatedAchievements = newState.achievements.map(ach => {
      if (ach.unlocked) return ach;
      
      let conditionMet = false;
      try {
        conditionMet = new Function('totalHabitsCompleted', 'streakDays', 'level', 'pomodoroCompleted', 'journal',
          `return ${ach.condition}`
        )(newState.totalHabitsCompleted, newState.streakDays, newState.level, newState.pomodoroCompleted, newState.journal);
      } catch (e) {
        conditionMet = false;
      }
      
      if (conditionMet) {
        unlockedAny = true;
        setNewAchievement({ ...ach, unlocked: true, unlockedAt: new Date().toISOString() });
        playSound('achievement');
        speak(`Досягнення розблоковано: ${ach.name}!`);
        return { ...ach, unlocked: true, unlockedAt: new Date().toISOString() };
      }
      return ach;
    });
    
    if (unlockedAny) {
      setState(s => ({ ...s, achievements: updatedAchievements }));
    }
  }, []);

  const addXp = useCallback((amount: number) => {
    setState(prev => {
      const newTotalXp = prev.totalXpEarned + amount;
      const { level, xp, xpToNext } = calculateLevel(newTotalXp);
      
      if (level > prev.level) {
        setLeveledUp(true);
        playSound('levelup');
        speak(`Вітаю! Ти досяг рівня ${level}!`);
        setTimeout(() => setLeveledUp(false), 3000);
      }
      
      const newState = {
        ...prev,
        level,
        xp,
        xpToNext,
        totalXpEarned: newTotalXp,
        lastActiveDate: getToday(),
        streakDays: prev.lastActiveDate === getToday() ? prev.streakDays : prev.streakDays + 1,
      };
      
      setTimeout(() => checkAchievements(newState), 500);
      return newState;
    });
  }, [checkAchievements]);

  const completeHabit = useCallback((habitId: string) => {
    const today = getToday();
    setState(prev => {
      const habit = prev.habits.find(h => h.id === habitId);
      if (!habit) return prev;
      if (habit.completedDates.includes(today)) return prev;
      
      playSound('success');
      speak(`+${habit.xpReward} досвіду!`);
      
      const updatedHabits = prev.habits.map(h => {
        if (h.id === habitId) {
          const newStreak = h.streak + 1;
          return {
            ...h,
            streak: newStreak,
            bestStreak: Math.max(h.bestStreak, newStreak),
            completedDates: [...h.completedDates, today],
          };
        }
        return h;
      });
      
      const newTotalHabits = prev.totalHabitsCompleted + 1;
      const newTotalXp = prev.totalXpEarned + habit.xpReward;
      const { level, xp, xpToNext } = calculateLevel(newTotalXp);
      
      if (level > prev.level) {
        setLeveledUp(true);
        playSound('levelup');
        speak(`Вітаю! Ти досяг рівня ${level}!`);
        setTimeout(() => setLeveledUp(false), 3000);
      }
      
      const newState = {
        ...prev,
        habits: updatedHabits,
        totalHabitsCompleted: newTotalHabits,
        level,
        xp,
        xpToNext,
        totalXpEarned: newTotalXp,
        lastActiveDate: today,
        streakDays: prev.lastActiveDate === today ? prev.streakDays : prev.streakDays + 1,
      };
      
      setTimeout(() => checkAchievements(newState), 500);
      return newState;
    });
  }, [checkAchievements]);

  const addHabit = useCallback((name: string, icon: string, category: Habit['category'], xpReward: number) => {
    playSound('click');
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      icon,
      streak: 0,
      bestStreak: 0,
      completedDates: [],
      xpReward,
      category,
      createdAt: new Date().toISOString(),
    };
    setState(s => ({ ...s, habits: [...s.habits, newHabit] }));
  }, []);

  const removeHabit = useCallback((habitId: string) => {
    playSound('click');
    setState(s => ({ ...s, habits: s.habits.filter(h => h.id !== habitId) }));
  }, []);

  const addJournalEntry = useCallback((mood: number, text: string, tags: string[]) => {
    playSound('success');
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: getToday(),
      mood,
      text,
      tags,
    };
    setState(s => ({ ...s, journal: [entry, ...s.journal] }));
    addXp(15);
  }, [addXp]);

  const completePomodoro = useCallback(() => {
    playSound('timer');
    speak('Чудово! Помідор завершено!');
    setState(prev => {
      const newState = {
        ...prev,
        pomodoroCompleted: prev.pomodoroCompleted + 1,
        lastActiveDate: getToday(),
        streakDays: prev.lastActiveDate === getToday() ? prev.streakDays : prev.streakDays + 1,
      };
      setTimeout(() => checkAchievements(newState), 500);
      return newState;
    });
    addXp(25);
  }, [addXp, checkAchievements]);

  const setUserName = useCallback((name: string) => {
    setState(s => ({ ...s, userName: name }));
    speak(`Привіт, ${name}! Давай почнемо!`);
  }, []);

  return {
    state,
    addXp,
    completeHabit,
    addHabit,
    removeHabit,
    addJournalEntry,
    completePomodoro,
    setUserName,
    newAchievement,
    setNewAchievement,
    leveledUp,
  };
}
