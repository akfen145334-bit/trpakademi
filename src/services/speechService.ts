/**
 * SpeechSynthesis & Audio Service with Turkish Voice Support,
 * Sentence-by-Sentence Synchronization, Mobile Background Audio (MediaSession + Silent Audio loop),
 * and Playback Controls (Play, Pause, Resume, Stop, Speed, Seek).
 */

export interface SpeechListener {
  onSentenceChange: (index: number) => void;
  onStateChange: (isPlaying: boolean, isPaused: boolean) => void;
  onFinish?: () => void;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private turkishVoice: SpeechSynthesisVoice | null = null;
  private sentences: string[] = [];
  private currentIndex: number = 0;
  private speed: number = 1.0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private listeners: Set<SpeechListener> = new Set();
  private silentAudio: HTMLAudioElement | null = null;
  private backgroundEnabled: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') setTimeout(() => this.ensureSpeaking(), 400);
      });
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize natural/enhanced Turkish voices if available
    const trVoices = voices.filter(v => v.lang.startsWith('tr') || v.lang === 'tr_TR' || v.lang === 'tr-TR');
    if (trVoices.length > 0) {
      // Pick first or preferred Google/Apple voice
      const preferred = trVoices.find(v => v.name.includes('Yelda') || v.name.includes('Google') || v.name.includes('Natural')) || trVoices[0];
      this.turkishVoice = preferred;
    }
  }

  public getVoiceName(): string {
    return this.turkishVoice ? this.turkishVoice.name : 'Varsayılan Türkçe Ses';
  }

  public subscribe(listener: SpeechListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyState() {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = this.isPlaying && !this.isPaused ? 'playing' : this.isPlaying ? 'paused' : 'none';
      } catch {
        /* yoksay */
      }
    }
    for (const listener of this.listeners) {
      listener.onStateChange(this.isPlaying, this.isPaused);
    }
  }

  private notifySentence() {
    for (const listener of this.listeners) {
      listener.onSentenceChange(this.currentIndex);
    }
  }

  private notifyFinish() {
    for (const listener of this.listeners) {
      if (listener.onFinish) listener.onFinish();
    }
  }

  /**
   * Initializes silent background audio loop to keep mobile devices (iOS/Android)
   * awake and maintain lockscreen MediaSession controls while speaking.
   */
  public enableBackgroundAudio(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      if (!this.silentAudio) {
        // 2 saniyelik geçerli WAV (8 kHz, 16 bit); ±1 genlikli çok hafif gürültü: tarayıcı bunu gerçek medya oynatımı sayıp
        // sekmeyi/medya oturumunu canlı tutar (tamamen sıfır örnekli dosya "çalıyor" sayılmayabiliyor).
        const rate = 8000, n = rate * 2;
        const buf = new Uint8Array(44 + n * 2);
        const dv = new DataView(buf.buffer);
        const str = (o: number, s: string) => { for (let i = 0; i < s.length; i++) buf[o + i] = s.charCodeAt(i); };
        str(0, 'RIFF'); dv.setUint32(4, 36 + n * 2, true); str(8, 'WAVE'); str(12, 'fmt ');
        dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
        dv.setUint32(24, rate, true); dv.setUint32(28, rate * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true);
        str(36, 'data'); dv.setUint32(40, n * 2, true);
        for (let i = 0; i < n; i++) dv.setInt16(44 + i * 2, i % 2 === 0 ? 1 : -1, true);
        let bin = '';
        for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
        this.silentAudio = new Audio('data:audio/wav;base64,' + btoa(bin));
        this.silentAudio.loop = true;
      }
      this.silentAudio.play().catch(() => {
        // Audio auto-play might require user gesture, will be triggered on Play button
      });
      this.backgroundEnabled = true;
      return true;
    } catch {
      return false;
    }
  }

  public setMediaSession(title: string, subtopicTitle: string, courseTitle: string) {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: title || subtopicTitle,
          artist: subtopicTitle,
          album: courseTitle,
          artwork: [
            { src: './icon-512.png', sizes: '512x512', type: 'image/png' }
          ]
        });

        navigator.mediaSession.setActionHandler('play', () => this.resume());
        navigator.mediaSession.setActionHandler('pause', () => this.pause());
        navigator.mediaSession.setActionHandler('previoustrack', () => this.prevSentence());
        navigator.mediaSession.setActionHandler('nexttrack', () => this.nextSentence());
        navigator.mediaSession.setActionHandler('stop', () => this.stop());
      } catch (e) {
        console.warn('MediaSession setup:', e);
      }
    }
  }

  /**
   * Start reading a list of sentences from a given starting index
   */
  public play(sentences: string[], startIndex = 0, metadata?: { title: string; subtopicTitle: string; courseTitle: string }) {
    if (!this.synth) return;
    this.stop();

    this.sentences = sentences;
    this.currentIndex = Math.max(0, Math.min(startIndex, sentences.length - 1));
    this.isPlaying = true;
    this.isPaused = false;

    if (metadata) {
      this.setMediaSession(metadata.title, metadata.subtopicTitle, metadata.courseTitle);
    }

    // Arka planda / ekran kilidinde çalmaya devam edebilmesi için ayrıca bir "Arka Plan Dinleme" adımına gerek yok:
    // oynat'a basılınca (kullanıcı dokunuşu) otomatik etkinleştirilir.
    this.enableBackgroundAudio();

    this.notifyState();
    this.speakCurrent();
  }

  private runToken = 0;
  private watchdog: ReturnType<typeof setTimeout> | null = null;

  private clearWatchdog() {
    if (this.watchdog) {
      clearTimeout(this.watchdog);
      this.watchdog = null;
    }
  }

  /** Uzun cümleyi, mobil TTS motorlarının takılmaması için kısa parçalara böler (~140 karakter). */
  private splitForSpeech(text: string): string[] {
    const MAX = 110;
    const clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length <= MAX) return [clean];
    const parts: string[] = [];
    let rest = clean;
    while (rest.length > MAX) {
      let cut = -1;
      const window = rest.slice(0, MAX + 20);
      for (const re of [/[;:]\s/g, /,\s/g, /\s(?:ve|ile|ancak|fakat|ama|ise|ki)\s/g, /\s/g]) {
        let m: RegExpExecArray | null;
        let last = -1;
        re.lastIndex = 0;
        while ((m = re.exec(window)) !== null) {
          if (m.index > 40) last = m.index + (/^[;:,]/.test(m[0]) ? 1 : 0);
        }
        if (last > 0) {
          cut = last;
          break;
        }
      }
      if (cut <= 0) cut = MAX;
      parts.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut).trim();
    }
    if (rest) parts.push(rest);
    return parts.filter(Boolean);
  }

  private advanceSentence(token: number) {
    if (token !== this.runToken) return;
    if (this.isPlaying && !this.isPaused) {
      this.currentIndex++;
      this.speakCurrent();
    }
  }

  private speakCurrent() {
    if (!this.synth || !this.isPlaying || this.isPaused) return;

    if (this.currentIndex >= this.sentences.length) {
      this.stop();
      this.notifyFinish();
      return;
    }

    const text = this.sentences[this.currentIndex];
    this.notifySentence();

    if (!text || text.trim().length === 0) {
      this.currentIndex++;
      this.speakCurrent();
      return;
    }

    const token = ++this.runToken;
    this.clearWatchdog();
    this.synth.cancel();
    const chunks = this.splitForSpeech(text);
    // cancel() hemen ardından speak() Android Chrome'da bazen sessizce yutuluyor: kısa bekleme
    setTimeout(() => this.speakChunk(token, chunks, 0), 90);
  }

  private speakChunk(token: number, chunks: string[], i: number) {
    if (token !== this.runToken || !this.synth || !this.isPlaying || this.isPaused) return;
    if (i >= chunks.length) {
      this.clearWatchdog();
      this.advanceSentence(token);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[i]);
    this.currentUtterance = utterance;
    utterance.lang = 'tr-TR';
    if (this.turkishVoice) {
      utterance.voice = this.turkishVoice;
    }
    utterance.rate = this.speed;

    let done = false;
    const next = () => {
      if (done) return;
      done = true;
      this.clearWatchdog();
      this.speakChunk(token, chunks, i + 1);
    };

    // Motor onend göndermezse takılmayı önle: tahmini süre + pay sonra bir sonraki parçaya geç
    const expectedMs = Math.max(4000, (chunks[i].length / (11 * Math.max(this.speed, 0.5))) * 1000 + 3500);
    this.clearWatchdog();
    this.watchdog = setTimeout(() => {
      if (token !== this.runToken || done) return;
      try {
        this.synth?.cancel();
      } catch {
        /* yoksay */
      }
      next();
    }, expectedMs);

    utterance.onend = next;
    utterance.onerror = (event) => {
      if (event.error === 'interrupted' || event.error === 'canceled') {
        return;
      }
      console.warn('Speech error:', event.error);
      next();
    };

    this.synth.speak(utterance);
  }

  /** Uygulama arka plandan dönünce konuşma durmuşsa kaldığı cümleden yeniden başlat. */
  public ensureSpeaking() {
    if (!this.synth || !this.isPlaying || this.isPaused) return;
    if (!this.synth.speaking && !this.synth.pending) {
      this.speakCurrent();
    }
  }
  public pause() {
    if (!this.isPlaying || this.isPaused) return;
    this.runToken++;
    this.clearWatchdog();
    this.isPaused = true;
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.silentAudio) {
      this.silentAudio.pause();
    }
    this.notifyState();
  }

  public resume() {
    if (!this.isPlaying || !this.isPaused) return;
    this.isPaused = false;
    if (this.silentAudio && this.backgroundEnabled) {
      this.silentAudio.play().catch(() => {});
    }
    this.notifyState();
    this.speakCurrent();
  }

  public stop() {
    this.runToken++;
    this.clearWatchdog();
    this.isPlaying = false;
    this.isPaused = false;
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.silentAudio) {
      this.silentAudio.pause();
    }
    this.currentUtterance = null;
    this.notifyState();
  }

  public setSpeed(speed: number) {
    this.speed = speed;
    if (this.isPlaying && !this.isPaused) {
      // Re-trigger current sentence with new rate
      this.speakCurrent();
    }
  }

  public getSpeed(): number {
    return this.speed;
  }

  public jumpToSentence(index: number) {
    if (index >= 0 && index < this.sentences.length) {
      this.currentIndex = index;
      if (this.isPlaying) {
        this.isPaused = false;
        this.speakCurrent();
      } else {
        this.notifySentence();
      }
    }
  }

  public nextSentence() {
    if (this.currentIndex < this.sentences.length - 1) {
      this.jumpToSentence(this.currentIndex + 1);
    }
  }

  public prevSentence() {
    if (this.currentIndex > 0) {
      this.jumpToSentence(this.currentIndex - 1);
    }
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }
}

export const speechService = new SpeechService();
