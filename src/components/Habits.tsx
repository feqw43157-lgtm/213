import { useState } from 'react';
import { Habit } from '../types';
import { playSound } from '../utils/sounds';

interface Props {
  habits: Habit[];
  today: string;
  onAdd: (name: string, icon: string, category: Habit['category'], xp: number) => void;
  onComplete: (id: string) => void;
  onRemove: (id: string) => void;
}

const categoryIcons: Record<Habit['category'], string> = {
  health: '💪',
  mind: '🧠',
  creative: '🎨',
  social: '👥',
};

const categoryColors: Record<Habit['category'], string> = {
  health: 'from-green-500 to-emerald-500',
  mind: 'from-blue-500 to-indigo-500',
  creative: 'from-purple-500 to-pink-500',
  social: 'from-orange-500 to-yellow-500',
};

const habitIcons = ['🏃', '📚', '💧', '🧘', '✍️', '🎵', '🥗', '💤', '🧹', '💻', '🌅', '🎯', '🚶', '📝', '🧠', '💊'];

export default function Habits({ habits, today, onAdd, onComplete, onRemove }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [category, setCategory] = useState<Habit['category']>('health');
  const [xp, setXp] = useState(10);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), icon, category, xp);
    setName('');
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    if (removingId === id) {
      onRemove(id);
      setRemovingId(null);
    } else {
      setRemovingId(id);
      setTimeout(() => setRemovingId(null), 3000);
    }
  };

  const todayHabits = habits.map(h => ({
    ...h,
    completedToday: h.completedDates.includes(today),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">🎯 Мої звички</h2>
        <button
          onClick={() => { setShowForm(!showForm); playSound('click'); }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
        >
          {showForm ? '✕ Закрити' : '+ Додати'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4 animate-slide-up">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Назва звички</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Наприклад: Ранкова пробіжка"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Іконка</label>
            <div className="flex flex-wrap gap-2">
              {habitIcons.map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                    icon === i ? 'bg-purple-500/30 ring-2 ring-purple-400 scale-110' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Категорія</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(Object.keys(categoryIcons) as Habit['category'][]).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-sm transition-all ${
                    category === cat
                      ? `bg-gradient-to-r ${categoryColors[cat]} text-white`
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {categoryIcons[cat]} {cat === 'health' ? 'Здоров\'я' : cat === 'mind' ? 'Розум' : cat === 'creative' ? 'Творчість' : 'Соціум'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Нагорода XP: {xp}</label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={xp}
              onChange={e => setXp(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 py-3 rounded-xl font-bold transition-all hover:scale-[1.02]"
          >
            ✨ Створити звичку
          </button>
        </form>
      )}

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🌱</div>
          <p className="text-gray-400 text-lg">Поки що немає звичок</p>
          <p className="text-gray-500 text-sm mt-2">Додай першу звичку і почни прокачувати себе!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todayHabits.map((habit, index) => (
            <div
              key={habit.id}
              className={`glass rounded-xl p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.01] animate-slide-up ${
                habit.completedToday ? 'opacity-70' : ''
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <button
                onClick={() => !habit.completedToday && onComplete(habit.id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                  habit.completedToday
                    ? 'bg-green-500/20 ring-2 ring-green-400'
                    : `bg-gradient-to-br ${categoryColors[habit.category]} hover:scale-110 hover:shadow-lg cursor-pointer`
                }`}
              >
                {habit.completedToday ? '✓' : habit.icon}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${habit.completedToday ? 'line-through text-gray-500' : ''}`}>
                  {habit.name}
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span>🔥 {habit.streak} дн.</span>
                  <span>⭐ +{habit.xpReward} XP</span>
                  <span className="hidden md:inline">📈 Найкраща: {habit.bestStreak}</span>
                </div>
              </div>

              <button
                onClick={() => handleRemove(habit.id)}
                className={`text-sm px-3 py-1 rounded-lg transition-all ${
                  removingId === habit.id
                    ? 'bg-red-500/20 text-red-400'
                    : 'text-gray-500 hover:text-red-400 hover:bg-white/5'
                }`}
              >
                {removingId === habit.id ? 'Точно?' : '✕'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
