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
        // Minimal valid silent WAV data URL (1 second silent PCM audio)
        const silentWavBase64 = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';
        this.silentAudio = new Audio(silentWavBase64);
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
            { src: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=512', sizes: '512x512', type: 'image/jpeg' }
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

    if (this.backgroundEnabled && this.silentAudio) {
      this.silentAudio.play().catch(() => {});
    }

    this.notifyState();
    this.speakCurrent();
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

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;
    utterance.lang = 'tr-TR';
    if (this.turkishVoice) {
      utterance.voice = this.turkishVoice;
    }
    utterance.rate = this.speed;

    utterance.onend = () => {
      if (this.isPlaying && !this.isPaused) {
        this.currentIndex++;
        this.speakCurrent();
      }
    };

    utterance.onerror = (event) => {
      // If cancelled by another speak or stop call, ignore
      if (event.error === 'interrupted' || event.error === 'canceled') {
        return;
      }
      console.warn('Speech error:', event.error);
      if (this.isPlaying && !this.isPaused) {
        this.currentIndex++;
        this.speakCurrent();
      }
    };

    this.synth.speak(utterance);
  }

  public pause() {
    if (!this.isPlaying || this.isPaused) return;
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
