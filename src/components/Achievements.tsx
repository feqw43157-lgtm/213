import { Achievement } from '../types';

interface Props {
  achievements: Achievement[];
}

export default function Achievements({ achievements }: Props) {
  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);
  const percent = Math.round((unlocked.length / achievements.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">🏆 Досягнення</h2>
        <span className="text-sm text-gray-400">{unlocked.length}/{achievements.length}</span>
      </div>

      {/* Progress */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Прогрес розблокування</span>
          <span className="text-sm font-bold text-purple-400">{percent}%</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full transition-all duration-1000"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>✨</span> Розблоковані
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unlocked.map((ach, index) => (
              <div
                key={ach.id}
                className="glass rounded-xl p-4 flex items-center gap-4 border border-yellow-500/20 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center text-2xl">
                  {ach.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-yellow-400">{ach.name}</p>
                  <p className="text-sm text-gray-400">{ach.description}</p>
                  {ach.unlockedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(ach.unlockedAt).toLocaleDateString('uk-UA')}
                    </p>
                  )}
                </div>
                <div className="text-yellow-500 text-xl">✓</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🔒</span> Заблоковані
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {locked.map((ach, index) => (
              <div
                key={ach.id}
                className="glass rounded-xl p-4 flex items-center gap-4 opacity-50 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl grayscale">
                  {ach.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-400">{ach.name}</p>
                  <p className="text-sm text-gray-500">{ach.description}</p>
                </div>
                <div className="text-gray-600 text-xl">🔒</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
