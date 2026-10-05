import { useState, useEffect } from 'react';
import { Tab } from './types';
import { useGameState } from './hooks/useGameState';
import { speak, playSound } from './utils/sounds';
import Dashboard from './components/Dashboard';
import Habits from './components/Habits';
import Pomodoro from './components/Pomodoro';
import Journal from './components/Journal';
import Achievements from './components/Achievements';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export default function App() {
  const {
    state,
    completeHabit,
    addHabit,
    removeHabit,
    addJournalEntry,
    completePomodoro,
    setUserName,
    newAchievement,
    setNewAchievement,
    leveledUp,
  } = useGameState();

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showWelcome, setShowWelcome] = useState(!state.userName);
  const [nameInput, setNameInput] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const today = getToday();

  // Welcome greeting
  useEffect(() => {
    if (state.userName && !showWelcome) {
      const hour = new Date().getHours();
      const greeting = hour < 12 ? 'Доброго ранку' : hour < 18 ? 'Доброго дня' : 'Доброго вечора';
      if (soundEnabled) {
        setTimeout(() => speak(`${greeting}, ${state.userName}!`), 500);
      }
    }
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      setShowWelcome(false);
      playSound('success');
    }
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Головна', icon: '🏠' },
    { id: 'habits', label: 'Звички', icon: '🎯' },
    { id: 'pomodoro', label: 'Таймер', icon: '🍅' },
    { id: 'journal', label: 'Щоденник', icon: '📖' },
    { id: 'achievements', label: 'Нагороди', icon: '🏆' },
  ];

  // Welcome screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full animate-scale-in">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4 animate-bounce-slow">⚔️</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              LifeQuest
            </h1>
            <p className="text-gray-400">Прокачай своє життя як у RPG!</p>
          </div>

          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div className="glass rounded-2xl p-6 space-y-4">
              <label className="text-sm text-gray-400 block">Як тебе звати, герою?</label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Введи своє ім'я..."
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                🚀 Почати пригоду!
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>🎮 Звички • ⏱️ Фокус • 📝 Щоденник • 🏆 Досягнення</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Achievement Notification */}
      {newAchievement && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-gradient-to-r from-yellow-900/90 to-amber-900/90 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-4 shadow-2xl shadow-yellow-500/20 max-w-xs">
            <div className="flex items-center gap-3">
              <div className="text-3xl animate-wiggle">{newAchievement.icon}</div>
              <div>
                <p className="text-xs text-yellow-400 font-medium">🏆 ДОСЯГНЕННЯ!</p>
                <p className="font-bold">{newAchievement.name}</p>
                <p className="text-sm text-gray-400">{newAchievement.description}</p>
              </div>
              <button
                onClick={() => setNewAchievement(null)}
                className="text-gray-400 hover:text-white ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level Up Notification */}
      {leveledUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="animate-scale-in text-center">
            <div className="text-8xl mb-4 animate-bounce-slow">⬆️</div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
              РІВЕНЬ {state.level}!
            </h2>
            <p className="text-gray-300 text-lg">Ти стаєш сильнішим!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/20">
              {state.level}
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-sm">{state.userName}</p>
              <p className="text-xs text-gray-400">{state.xp}/{state.xpToNext} XP</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg px-3 py-1">
              <span className="text-sm">🔥</span>
              <span className="text-sm font-bold">{state.streakDays}</span>
            </div>
            <button
              onClick={() => { setSoundEnabled(!soundEnabled); playSound('click'); }}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                soundEnabled ? 'bg-white/10' : 'bg-white/5 opacity-50'
              }`}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {activeTab === 'dashboard' && <Dashboard state={state} today={today} />}
        {activeTab === 'habits' && (
          <Habits
            habits={state.habits}
            today={today}
            onAdd={addHabit}
            onComplete={completeHabit}
            onRemove={removeHabit}
          />
        )}
        {activeTab === 'pomodoro' && (
          <Pomodoro onComplete={completePomodoro} totalCompleted={state.pomodoroCompleted} />
        )}
        {activeTab === 'journal' && (
          <Journal entries={state.journal} onAdd={addJournalEntry} />
        )}
        {activeTab === 'achievements' && (
          <Achievements achievements={state.achievements} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/5">
        <div className="max-w-4xl mx-auto px-2">
          <div className="flex justify-around">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); playSound('click'); }}
                className={`flex flex-col items-center gap-1 py-3 px-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'text-purple-400 bg-purple-500/10'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span className={`text-xl transition-transform ${activeTab === tab.id ? 'scale-110' : ''}`}>
                  {tab.icon}
                </span>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
