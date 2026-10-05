// Web Speech API для озвучки
export function speak(text: string, options?: { pitch?: number; rate?: number; lang?: string }) {
  if (!('speechSynthesis' in window)) return;
  
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = options?.pitch ?? 1;
  utterance.rate = options?.rate ?? 0.9;
  utterance.lang = options?.lang ?? 'uk-UA';
  utterance.volume = 0.8;
  
  // Спробувати знайти український голос
  const voices = window.speechSynthesis.getVoices();
  const ukVoice = voices.find(v => v.lang.startsWith('uk'));
  const ruVoice = voices.find(v => v.lang.startsWith('ru'));
  if (ukVoice) utterance.voice = ukVoice;
  else if (ruVoice) utterance.voice = ruVoice;
  
  window.speechSynthesis.speak(utterance);
}

export function playSound(type: 'success' | 'levelup' | 'click' | 'achievement' | 'timer') {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  
  switch (type) {
    case 'success':
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
      break;
    case 'levelup':
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.15);
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.3);
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.45);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
      break;
    case 'click':
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      break;
    case 'achievement':
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.4);
      oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.6);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
      break;
    case 'timer':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(0, audioContext.currentTime + 0.25);
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.5);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
      break;
  }
}
