export interface Sentence {
  id: number;
  text: string;
  cleanText: string;
  isHeading?: boolean;
  isTable?: boolean;
  kind?: 'h2' | 'h3' | 'p' | 'li' | 'tr' | 'def';
  para?: number;
  cells?: string[];
  th?: boolean;
  n?: number;
}

export interface Question {
  id: string;
  subtopicId: string;
  courseId: string;
  questionText: string;
  options: string[];
  correctIndex: number; // 0 for A, 1 for B, 2 for C, 3 for D, 4 for E
  explanation: string;
  difficulty?: 'temel' | 'orta' | 'ileri';
  /** Hazır zorluk: 0 kolay, 1 orta, 2 zor */
  diff?: 0 | 1 | 2;
  /** 'mb' = Mutlaka Bil maddelerinden türetilen soru */
  part?: 'mb' | 'konu';
  /** Bu soruyu çözmek için gereken konu anlatımı cümle kimlikleri (Eksiklerim) */
  k?: number[];
  /** Soru dijital kimliği (TRPA-...) */
  kid?: string;
  /** İmza kısaltması (kopya takibi) */
  sig?: string;
  verified?: boolean;
}

/** Kişiye özel soru işaretleri */
export interface QuestionMark {
  /** 1 = Tekrar çöz (Eksiklerim'e eklenir) */
  r?: 1;
  /** Kişisel zorluk: 0 kolay, 1 orta, 2 zor */
  d?: 0 | 1 | 2;
}

export interface Subtopic {
  id: string;
  courseId: string;
  order: number;
  title: string;
  officialQuestionCount: number;
  lectureContent: string;
  sentences: Sentence[];
  questions: Question[];
  isAvailable: boolean;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  totalOfficialQuestions: number;
  description: string;
  iconName: string;
  isAvailable: boolean;
  subtopics: Subtopic[];
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentCourseId: string | null;
  currentSubtopicId: string | null;
  currentSentenceIndex: number;
  totalSentences: number;
  speed: number; // 0.75, 1, 1.25, 1.5, 2
  mode: 'subtopic' | 'entire_course' | 'eksiklerim' | 'mutlaka_bil';
  queueSubtopicIds?: string[];
  queueIndex?: number;
}

/** Kişiye özel otomatik çalışma planı (hesaba/ilerleme verisine dahildir) */
export interface StudyPlan {
  start: string; // yyyy-mm-dd
  end: string; // yyyy-mm-dd (bitiş / sınav tarihi)
  createdAt: number;
  days: { date: string; subtopicIds: string[] }[];
}

/** Çalışma hatırlatıcısı tercihleri: boş bırakılan vakit kapalıdır */
export interface ReminderPrefs {
  enabled: boolean;
  times: { morning?: string; noon?: string; evening?: string }; // HH:MM
}

export interface UserStats {
  plan?: StudyPlan;
  reminders?: ReminderPrefs;
  solvedQuestions: Record<string, number>; // questionId -> selectedIndex
  correctQuestionIds: string[];
  wrongQuestionIds: string[];
  completedSubtopicIds: string[];
  weakSubtopicIds: string[]; // marked as weak or automatically added on mistakes
  lastStudiedSubtopicId?: string;
  lastStudiedTimestamp?: number;
  /** Soru bazlı kişisel işaretler (tekrar çöz / kişisel zorluk) */
  marks?: Record<string, QuestionMark>;
}
