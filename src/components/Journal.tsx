import { useState } from 'react';
import { JournalEntry } from '../types';
import { playSound } from '../utils/sounds';

interface Props {
  entries: JournalEntry[];
  onAdd: (mood: number, text: string, tags: string[]) => void;
}

const moodEmojis = ['😢', '😔', '😐', '😊', '🤩'];
const moodLabels = ['Жахливо', 'Погано', 'Нормально', 'Добре', 'Чудово'];
const moodColors = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400', 'text-emerald-400'];

export default function Journal({ entries, onAdd }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [mood, setMood] = useState(3);
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    onAdd(mood, text.trim(), tagList);
    setText('');
    setTags('');
    setMood(3);
    setShowForm(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📖 Щоденник</h2>
        <button
          onClick={() => { setShowForm(!showForm); playSound('click'); }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
        >
          {showForm ? '✕ Закрити' : '+ Записати'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4 animate-slide-up">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Як ти себе почуваєш?</label>
            <div className="flex justify-between">
              {moodEmojis.map((emoji, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMood(i + 1)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                    mood === i + 1 ? 'bg-white/10 scale-110 ring-2 ring-purple-400' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="text-3xl">{emoji}</span>
                  <span className="text-xs text-gray-400">{moodLabels[i]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Що сталося сьогодні?</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Розкажи про свій день..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Теги (через кому)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="робота, спорт, навчання"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 py-3 rounded-xl font-bold transition-all hover:scale-[1.02]"
          >
            💾 Зберегти запис (+15 XP)
          </button>
        </form>
      )}

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-gray-400 text-lg">Щоденник порожній</p>
          <p className="text-gray-500 text-sm mt-2">Запиши свої думки та отримай +15 XP!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="glass rounded-xl p-5 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{moodEmojis[entry.mood - 1]}</span>
                  <div>
                    <p className={`font-medium ${moodColors[entry.mood - 1]}`}>{moodLabels[entry.mood - 1]}</p>
                    <p className="text-xs text-gray-500">{formatDate(entry.date)}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">{entry.text}</p>
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {entry.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded-lg text-gray-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
