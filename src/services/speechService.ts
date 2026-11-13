/**
 * Sesli okuma servisi.
 *
 * İki mod:
 *  1) KAYITLI SES (tercih edilen): public/audio/<altBaşlıkId>.mp3 + index.json (cümle zamanları).
 *     Gerçek bir <audio> öğesi çalar; telefonda ekran kilidinde ve arka planda kesilmez,
 *     medya oturumu (kilit ekranı kontrolleri) çalışır, cümle vurgusu ses zamanına göre ilerler.
 *  2) Tarayıcı sesi (yedek): kayıt yoksa/metin değiştiyse SpeechSynthesis ile okunur.
 *
 * Kuyruk (dersin tümü / eksiklerim) ses öğesi bitince servis içinde sürer; arka planda React'e bağlı değildir.
 */

export interface SpeechListener {
  onSentenceChange: (index: number) => void;
  onStateChange: (isPlaying: boolean, isPaused: boolean) => void;
  onFinish?: () => void;
}

export interface PlayMeta {
  title: string;
  subtopicTitle: string;
  courseTitle: string;
}

export interface PlayItem {
  sentences: string[];
  audioId?: string;
  meta?: PlayMeta;
  startIndex?: number;
}

interface AudioIndexEntry {
  h: string;
  n: number;
  dur: number;
  cues: number[];
}

/** audio üretim betiğiyle aynı özet fonksiyonu */
export const textHash = (s: string): string => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
};

const baseUrl = (): string => {
  try {
    return (import.meta as any).env?.BASE_URL || './';
  } catch {
    return './';
  }
};

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private turkishVoice: SpeechSynthesisVoice | null = null;
  private sentences: string[] = [];
  private currentIndex = 0;
  private speed = 1.0;
  private isPlaying = false;
  private isPaused = false;
  private listeners: Set<SpeechListener> = new Set();
  private silentAudio: HTMLAudioElement | null = null;
  private backgroundEnabled = false;

  // kayıtlı ses
  private audio: HTMLAudioElement | null = null;
  private audioIndex: Record<string, AudioIndexEntry> | null = null;
  private audioMode = false;
  private cues: number[] = [];
  private ticker: ReturnType<typeof setInterval> | null = null;
  private nextProvider: (() => PlayItem | null) | null = null;
  private meta: PlayMeta | null = null;

  // tarayıcı sesi
  private runToken = 0;
  private watchdog: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadAudioIndex();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') setTimeout(() => this.ensureSpeaking(), 400);
      });
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadAudioIndex() {
    fetch(`${baseUrl()}audio/index.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j) this.audioIndex = j;
      })
      .catch(() => {
        /* kayıtlı ses yoksa tarayıcı sesi kullanılır */
      });
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    const trVoices = voices.filter((v) => v.lang.startsWith('tr') || v.lang === 'tr_TR' || v.lang === 'tr-TR');
    if (trVoices.length > 0) {
      const preferred =
        trVoices.find((v) => v.name.includes('Yelda') || v.name.includes('Google') || v.name.includes('Natural')) ||
        trVoices[0];
      this.turkishVoice = preferred;
    }
  }

  public getVoiceName(): string {
    return this.audioMode ? 'Kayıtlı Türkçe ses' : this.turkishVoice ? this.turkishVoice.name : 'Varsayılan Türkçe Ses';
  }

  /** Bu alt başlık için kayıtlı ses var ve metinle uyumlu mu? */
  public hasRecordedAudio(audioId: string | undefined, sentences: string[]): boolean {
    if (!audioId || !this.audioIndex) return false;
    const e = this.audioIndex[audioId];
    return !!e && e.n === sentences.length && e.h === textHash(sentences.join('\n'));
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
    for (const listener of this.listeners) listener.onStateChange(this.isPlaying, this.isPaused);
  }

  private notifySentence() {
    for (const listener of this.listeners) listener.onSentenceChange(this.currentIndex);
  }

  private notifyFinish() {
    for (const listener of this.listeners) if (listener.onFinish) listener.onFinish();
  }

  /** Tarayıcı sesi modunda sekmenin/ses oturumunun canlı kalması için sessiz döngü */
  public enableBackgroundAudio(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      if (!this.silentAudio) {
        const rate = 8000,
          n = rate * 2;
        const buf = new Uint8Array(44 + n * 2);
        const dv = new DataView(buf.buffer);
        const str = (o: number, s: string) => {
          for (let i = 0; i < s.length; i++) buf[o + i] = s.charCodeAt(i);
        };
        str(0, 'RIFF');
        dv.setUint32(4, 36 + n * 2, true);
        str(8, 'WAVE');
        str(12, 'fmt ');
        dv.setUint32(16, 16, true);
        dv.setUint16(20, 1, true);
        dv.setUint16(22, 1, true);
        dv.setUint32(24, rate, true);
        dv.setUint32(28, rate * 2, true);
        dv.setUint16(32, 2, true);
        dv.setUint16(34, 16, true);
        str(36, 'data');
        dv.setUint32(40, n * 2, true);
        for (let i = 0; i < n; i++) dv.setInt16(44 + i * 2, i % 2 === 0 ? 1 : -1, true);
        let bin = '';
        for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
        this.silentAudio = new Audio('data:audio/wav;base64,' + btoa(bin));
        this.silentAudio.loop = true;
      }
      this.silentAudio.play().catch(() => {});
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
          artwork: [{ src: `${baseUrl()}icon-512.png`, sizes: '512x512', type: 'image/png' }],
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
   * Cümle listesini verilen cümleden itibaren okumaya başla.
   * audioId verilirse ve kayıtlı ses uyumluysa gerçek ses çalınır.
   * nextProvider, bu öğe bitince sıradaki öğeyi döndürür (kuyruk); null ise okuma biter.
   */
  public play(
    sentences: string[],
    startIndex = 0,
    metadata?: PlayMeta,
    audioId?: string,
    nextProvider?: () => PlayItem | null
  ) {
    this.stopInternal(false);
    this.nextProvider = nextProvider || null;
    this.startItem({ sentences, audioId, meta: metadata, startIndex });
  }

  private startItem(item: PlayItem) {
    this.sentences = item.sentences;
    this.currentIndex = Math.max(0, Math.min(item.startIndex || 0, item.sentences.length - 1));
    this.isPlaying = true;
    this.isPaused = false;
    this.meta = item.meta || null;
    if (item.meta) this.setMediaSession(item.meta.title, item.meta.subtopicTitle, item.meta.courseTitle);

    if (this.hasRecordedAudio(item.audioId, item.sentences)) {
      this.startRecorded(item.audioId!);
    } else {
      this.audioMode = false;
      if (!this.synth) {
        this.isPlaying = false;
        this.notifyState();
        return;
      }
      this.enableBackgroundAudio();
      this.notifyState();
      this.speakCurrent();
    }
  }

  // ───────────── kayıtlı ses ─────────────

  private startRecorded(audioId: string) {
    const entry = this.audioIndex![audioId];
    this.audioMode = true;
    this.cues = entry.cues;
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = 'auto';
      (this.audio as any).preservesPitch = true;
      this.audio.addEventListener('ended', () => this.onRecordedEnded());
      this.audio.addEventListener('error', () => this.onRecordedError());
    }
    const a = this.audio;
    const startAt = this.cues[this.currentIndex] || 0;
    a.src = `${baseUrl()}audio/${audioId}.mp3`;
    a.playbackRate = this.speed;
    const seek = () => {
      try {
        a.currentTime = startAt;
      } catch {
        /* yoksay */
      }
    };
    if (startAt > 0) a.addEventListener('loadedmetadata', seek, { once: true });
    this.notifyState();
    this.notifySentence();
    a.play().catch(() => this.onRecordedError());
    this.startTicker();
  }

  private startTicker() {
    this.stopTicker();
    this.ticker = setInterval(() => {
      if (!this.audioMode || !this.audio || this.isPaused) return;
      const t = this.audio.currentTime + 0.05;
      let lo = 0,
        hi = this.cues.length - 1,
        ans = this.currentIndex;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (this.cues[mid] <= t) {
          ans = mid;
          lo = mid + 1;
        } else hi = mid - 1;
      }
      // aynı zamanı paylaşan (boş) cümlelerde sonuncuyu değil ilk gerçek cümleyi göster
      while (ans > 0 && this.cues[ans - 1] === this.cues[ans]) ans--;
      if (ans !== this.currentIndex) {
        this.currentIndex = ans;
        this.notifySentence();
      }
    }, 200);
  }

  private stopTicker() {
    if (this.ticker) {
      clearInterval(this.ticker);
      this.ticker = null;
    }
  }

  private onRecordedEnded() {
    if (!this.audioMode || !this.isPlaying) return;
    this.advanceQueue();
  }

  /** Kayıt çalınamadıysa (ağ/dosya) aynı yerden tarayıcı sesine geç */
  private onRecordedError() {
    if (!this.audioMode || !this.isPlaying) return;
    this.stopTicker();
    this.audioMode = false;
    try {
      this.audio?.pause();
    } catch {
      /* yoksay */
    }
    if (this.synth && !this.isPaused) {
      this.enableBackgroundAudio();
      this.speakCurrent();
    } else {
      this.stopInternal(true);
    }
  }

  private advanceQueue() {
    const next = this.nextProvider ? this.nextProvider() : null;
    if (next) {
      this.startItem(next);
    } else {
      this.stopInternal(true);
      this.notifyFinish();
    }
  }

  // ───────────── tarayıcı sesi (yedek) ─────────────

  private clearWatchdog() {
    if (this.watchdog) {
      clearTimeout(this.watchdog);
      this.watchdog = null;
    }
  }

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
    if (this.audioMode) return;
    if (!this.synth || !this.isPlaying || this.isPaused) return;

    if (this.currentIndex >= this.sentences.length) {
      this.advanceQueue();
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
    utterance.lang = 'tr-TR';
    if (this.turkishVoice) utterance.voice = this.turkishVoice;
    utterance.rate = this.speed;

    let done = false;
    const next = () => {
      if (done) return;
      done = true;
      this.clearWatchdog();
      this.speakChunk(token, chunks, i + 1);
    };

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
      if (event.error === 'interrupted' || event.error === 'canceled') return;
      console.warn('Speech error:', event.error);
      next();
    };

    this.synth.speak(utterance);
  }

  /** Uygulama arka plandan dönünce tarayıcı sesi durmuşsa kaldığı cümleden yeniden başlat. */
  public ensureSpeaking() {
    if (!this.isPlaying || this.isPaused) return;
    if (this.audioMode) {
      if (this.audio && this.audio.paused && !this.audio.ended) this.audio.play().catch(() => {});
      return;
    }
    if (!this.synth) return;
    if (!this.synth.speaking && !this.synth.pending) this.speakCurrent();
  }

  // ───────────── kontroller ─────────────

  public pause() {
    if (!this.isPlaying || this.isPaused) return;
    this.runToken++;
    this.clearWatchdog();
    this.isPaused = true;
    if (this.audioMode) {
      this.audio?.pause();
    } else {
      this.synth?.cancel();
      this.silentAudio?.pause();
    }
    this.notifyState();
  }

  public resume() {
    if (!this.isPlaying || !this.isPaused) return;
    this.isPaused = false;
    if (this.audioMode) {
      this.audio?.play().catch(() => this.onRecordedError());
      this.notifyState();
    } else {
      if (this.silentAudio && this.backgroundEnabled) this.silentAudio.play().catch(() => {});
      this.notifyState();
      this.speakCurrent();
    }
  }

  private stopInternal(notify: boolean) {
    this.runToken++;
    this.clearWatchdog();
    this.stopTicker();
    this.isPlaying = false;
    this.isPaused = false;
    if (this.synth) this.synth.cancel();
    if (this.silentAudio) this.silentAudio.pause();
    if (this.audio) {
      try {
        this.audio.pause();
      } catch {
        /* yoksay */
      }
    }
    this.audioMode = false;
    if (notify) this.notifyState();
  }

  public stop() {
    this.nextProvider = null;
    this.stopInternal(true);
  }

  public setSpeed(speed: number) {
    this.speed = speed;
    if (this.audioMode && this.audio) {
      this.audio.playbackRate = speed;
    } else if (this.isPlaying && !this.isPaused) {
      this.speakCurrent();
    }
  }

  public getSpeed(): number {
    return this.speed;
  }

  public jumpToSentence(index: number) {
    if (index < 0 || index >= this.sentences.length) return;
    this.currentIndex = index;
    if (this.audioMode && this.audio) {
      try {
        this.audio.currentTime = this.cues[index] || 0;
      } catch {
        /* yoksay */
      }
      this.notifySentence();
      if (this.isPlaying && this.isPaused) {
        this.isPaused = false;
        this.audio.play().catch(() => {});
        this.notifyState();
      }
      return;
    }
    if (this.isPlaying) {
      this.isPaused = false;
      this.speakCurrent();
    } else {
      this.notifySentence();
    }
  }

  public nextSentence() {
    if (this.currentIndex < this.sentences.length - 1) this.jumpToSentence(this.currentIndex + 1);
  }

  public prevSentence() {
    if (this.currentIndex > 0) this.jumpToSentence(this.currentIndex - 1);
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
