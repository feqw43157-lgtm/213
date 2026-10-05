import { useState, useEffect } from 'react';

const capabilities = [
  {
    icon: '🎨',
    title: 'Створення веб-сайтів',
    description: 'Лендінги, портфоліо, блоги, інтернет-магазини та будь-які інші типи веб-сайтів з сучасним дизайном.',
    tech: ['React', 'Tailwind CSS', 'TypeScript'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: '⚡',
    title: 'Веб-додатки',
    description: 'Інтерактивні SPA, дашборди, панелі управління, калькулятори, планувальники та інші інструменти.',
    tech: ['React', 'Vite', 'State Management'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '🎮',
    title: 'Ігри та інтерактив',
    description: 'Браузери ігри, головоломки, вікторини, анімації та інтерактивні демо-проекти.',
    tech: ['Canvas', 'CSS Animations', 'Game Logic'],
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: '📊',
    title: 'Візуалізація даних',
    description: 'Графіки, діаграми, інфографіка, карти та інші способи візуального представлення інформації.',
    tech: ['Charts', 'SVG', 'D3.js'],
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: '🔧',
    title: 'Інтеграції та API',
    description: 'Підключення до зовнішніх сервісів, API, баз даних та інших інструментів для повноцінних рішень.',
    tech: ['REST API', 'Fetch', 'WebSockets'],
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: '📱',
    title: 'Адаптивний дизайн',
    description: 'Всі проекти працюють на будь-яких пристроях — від мобільних телефонів до великих моніторів.',
    tech: ['Responsive', 'Mobile-first', 'Flexbox/Grid'],
    color: 'from-indigo-500 to-violet-500',
  },
];

const examples = [
  { name: 'Лендінг', emoji: '🚀' },
  { name: 'Портфоліо', emoji: '💼' },
  { name: 'Блог', emoji: '📝' },
  { name: 'Магазин', emoji: '🛒' },
  { name: 'Дашборд', emoji: '📊' },
  { name: 'Калькулятор', emoji: '🧮' },
  { name: 'Гра', emoji: '🎮' },
  { name: 'Чат', emoji: '💬' },
  { name: 'Погода', emoji: '🌤️' },
  { name: 'Таймер', emoji: '⏱️' },
  { name: 'Туду-лист', emoji: '✅' },
  { name: 'Карта', emoji: '🗺️' },
];

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}</span>;
}

function FloatingParticle({ delay, size, x }: { delay: number; size: number; x: number }) {
  return (
    <div
      className="absolute rounded-full bg-white/10 animate-float"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${6 + Math.random() * 4}s`,
      }}
    />
  );
}

export default function App() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [showExamples, setShowExamples] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowExamples(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white overflow-hidden">
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.5} size={4 + Math.random() * 8} x={Math.random() * 100} />
        ))}
      </div>

      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-6xl md:text-8xl mb-6 animate-bounce-slow">🤖</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Що я можу?
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Я — AI-асистент для створення веб-додатків. Ось що я вмію робити для вас:
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4">
              <div className="text-3xl font-bold text-purple-400"><AnimatedCounter target={6} /></div>
              <div className="text-sm text-gray-400">напрямків</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4">
              <div className="text-3xl font-bold text-pink-400"><AnimatedCounter target={12} />+</div>
              <div className="text-sm text-gray-400">типів проектів</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4">
              <div className="text-3xl font-bold text-cyan-400">∞</div>
              <div className="text-sm text-gray-400">можливостей</div>
            </div>
          </div>

          <a href="#capabilities" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
            Дізнатись більше
            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-scroll-dot" />
          </div>
        </div>
      </header>

      {/* Capabilities Section */}
      <section id="capabilities" className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Мої можливості
          </h2>
          <p className="text-gray-400 text-center mb-16 text-lg">Натисніть на картку для деталей</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, index) => (
              <div
                key={index}
                className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 cursor-pointer transition-all duration-500 hover:scale-105 hover:bg-white/10 ${
                  activeCard === index ? 'ring-2 ring-purple-400 scale-105' : ''
                }`}
                onClick={() => setActiveCard(activeCard === index ? null : index)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cap.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{cap.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{cap.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{cap.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {cap.tech.map((t, i) => (
                      <span key={i} className="text-xs bg-white/10 px-3 py-1 rounded-full text-gray-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {activeCard === index && (
                  <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
                    <p className="text-sm text-gray-300">
                      ✨ Я створюю повноцінні робочі проекти з чистим кодом, сучасним дизайном та адаптивною версткою.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
            Що можна створити?
          </h2>
          <p className="text-gray-400 text-center mb-12 text-lg">Просто попросіть — і я створю!</p>

          {showExamples && (
            <div className="flex flex-wrap justify-center gap-3">
              {examples.map((ex, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 hover:bg-white/10 hover:scale-110 transition-all duration-300 cursor-default animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="text-xl mr-2">{ex.emoji}</span>
                  <span className="text-gray-200">{ex.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Технології
          </h2>
          <p className="text-gray-400 text-center mb-12 text-lg">Я використовую сучасний стек</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'React', icon: '⚛️' },
              { name: 'TypeScript', icon: '📘' },
              { name: 'Tailwind CSS', icon: '🎨' },
              { name: 'Vite', icon: '⚡' },
              { name: 'HTML5', icon: '🌐' },
              { name: 'CSS3', icon: '💅' },
              { name: 'JavaScript', icon: '📜' },
              { name: 'Node.js', icon: '🟢' },
            ].map((tech, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 hover:scale-105 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{tech.icon}</div>
                <div className="text-sm font-medium text-gray-300">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="text-5xl mb-6">💡</div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Готові почати?</h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Просто опишіть, що вам потрібно — і я створю це! 
              Будь-яка ідея може стати реальним веб-проектом за лічені хвилини.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 rounded-xl px-6 py-3 text-gray-200">
                <span className="text-purple-400 font-mono">→</span> "Зроби мені портфоліо"
              </div>
              <div className="bg-white/10 rounded-xl px-6 py-3 text-gray-200">
                <span className="text-pink-400 font-mono">→</span> "Створи гру"
              </div>
              <div className="bg-white/10 rounded-xl px-6 py-3 text-gray-200">
                <span className="text-cyan-400 font-mono">→</span> "Зроби дашборд"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/5">
        <p>Створено з ❤️ AI-асистентом • React + Tailwind CSS + TypeScript</p>
      </footer>
    </div>
  );
}
