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

export interface UserStats {
  solvedQuestions: Record<string, number>; // questionId -> selectedIndex
  correctQuestionIds: string[];
  wrongQuestionIds: string[];
  completedSubtopicIds: string[];
  weakSubtopicIds: string[]; // marked as weak or automatically added on mistakes
  lastStudiedSubtopicId?: string;
  lastStudiedTimestamp?: number;
}
