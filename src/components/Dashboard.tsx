import { GameState } from '../types';

interface Props {
  state: GameState;
  today: string;
}

export default function Dashboard({ state, today }: Props) {
  const xpPercent = (state.xp / state.xpToNext) * 100;
  const todayHabits = state.habits.filter(h => h.completedDates.includes(today));
  const totalTodayHabits = state.habits.length;
  const completionPercent = totalTodayHabits > 0 ? (todayHabits.length / totalTodayHabits) * 100 : 0;

  const motivationalQuotes = [
    "Кожен день — це нова можливість стати кращим!",
    "Маленькі кроки ведуть до великих змін.",
    "Дисципліна — це міст між цілями та досягненнями.",
    "Ти сильніший, ніж думаєш!",
    "Прогрес, не досконалість.",
    "Сьогоднішні зусилля — завтрашній успіх.",
    "Не зупиняйся, коли втомився. Зупинись, коли закінчиш.",
  ];
  const quote = motivationalQuotes[new Date().getDate() % motivationalQuotes.length];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Level & XP */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-500/30">
              {state.level}
            </div>
            <div>
              <h3 className="text-lg font-bold">Рівень {state.level}</h3>
              <p className="text-sm text-gray-400">{state.userName || 'Герой'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">{state.xp} / {state.xpToNext} XP</p>
            <p className="text-xs text-gray-500">Всього: {state.totalXpEarned} XP</p>
          </div>
        </div>
        
        {/* XP Bar */}
        <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${xpPercent}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="🔥" label="Серія" value={`${state.streakDays} дн.`} color="from-orange-500 to-red-500" />
        <StatCard icon="✅" label="Звикки" value={`${state.totalHabitsCompleted}`} color="from-green-500 to-emerald-500" />
        <StatCard icon="🍅" label="Помідори" value={`${state.pomodoroCompleted}`} color="from-red-500 to-pink-500" />
        <StatCard icon="📖" label="Записи" value={`${state.journal.length}`} color="from-blue-500 to-cyan-500" />
      </div>

      {/* Today's Progress */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>📊</span> Прогрес сьогодні
        </h3>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray={`${completionPercent}, 100`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {Math.round(completionPercent)}%
            </div>
          </div>
          <div>
            <p className="text-gray-300">
              Виконано <span className="text-purple-400 font-bold">{todayHabits.length}</span> з{' '}
              <span className="text-pink-400 font-bold">{totalTodayHabits}</span> звичок
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {completionPercent === 100 && totalTodayHabits > 0 ? '🎉 Все виконано!' : 'Продовжуй у тому ж дусі!'}
            </p>
          </div>
        </div>
      </div>

      {/* Motivation */}
      <div className="glass rounded-2xl p-6 border-l-4 border-purple-500">
        <p className="text-gray-300 italic text-lg">"{quote}"</p>
        <p className="text-sm text-gray-500 mt-2">— Мотивація дня</p>
      </div>

      {/* Recent Achievements */}
      {state.achievements.filter(a => a.unlocked).length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🏆</span> Останні досягнення
          </h3>
          <div className="flex flex-wrap gap-3">
            {state.achievements.filter(a => a.unlocked).slice(0, 6).map(ach => (
              <div key={ach.id} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                <span className="text-xl">{ach.icon}</span>
                <span className="text-sm text-gray-300">{ach.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="glass rounded-xl p-4 text-center hover:scale-105 transition-transform duration-300">
      <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-lg mb-2 shadow-lg`}>
        {icon}
      </div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}
