import React, { createContext, useContext, useEffect, useRef, useState, useMemo, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../services/supabase';
import { Course, Subtopic, Question, UserStats, AudioPlaybackState, QuestionMark, StudyPlan, ReminderPrefs } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { speechService } from '../services/speechService';
import { MUTLAKA_BIL } from '../data/mutlakaBil';
import { fetchCourseQuestions } from '../services/questionService';

/** Eksiklerim: bir alt başlıktaki, çözülemeyen sorular için gereken (tekrarsız) bilgi kalemleri */
export interface EksikItem {
  key: string;
  text: string;
  heading?: string;
  /** konu anlatımındaki cümle sırası */
  order: number;
  questionIds: string[];
}
export interface EksikSubtopic {
  course: Course;
  subtopic: Subtopic;
  items: EksikItem[];
  questionCount: number;
}
export interface EksikCourse {
  course: Course;
  subtopics: EksikSubtopic[];
  itemCount: number;
  questionCount: number;
}
export type AudioSource = 'program' | 'device';
export interface ProgressExport {
  format: 'trp-akademi-ilerleme';
  version: 1;
  exportedAt: string;
  stats: UserStats;
  prefs: { audioSource: AudioSource };
}

interface AppContextType {
  courses: Course[];
  activeView: 'home' | 'course' | 'subtopic' | 'eksiklerim' | 'mutlakabil' | 'hafiza' | 'deneme' | 'plan';
  goToPlan: () => void;
  savePlan: (plan: StudyPlan | null) => void;
  setReminders: (r: ReminderPrefs) => void;
  /** Arka planda seslendirme tercihi (bir kez seçilince her açılışta geçerli) */
  keepBackgroundAudio: boolean;
  setKeepBackgroundAudio: (v: boolean) => void;
  mbSelection: { courseId: string; subtopicId: string } | null;
  hkSelection: string | null;
  selectedCourseId: string | null;
  selectedSubtopicId: string | null;
  activeSubtopicTab: 'lecture' | 'test';
  
  // Navigation
  goToHome: () => void;
  goToCourse: (courseId: string) => void;
  goToSubtopic: (courseId: string, subtopicId: string, tab?: 'lecture' | 'test') => void;
  goToEksiklerim: () => void;
  goToMutlakaBil: (courseId?: string, subtopicId?: string) => void;
  goToHafiza: (cardId?: string) => void;
  goToDeneme: () => void;
  playMustKnow: (courseId: string, subtopicId: string, startSentenceIndex?: number, wholeCourse?: boolean) => void;
  setActiveSubtopicTab: (tab: 'lecture' | 'test') => void;
  
  // Audio Playback
  audioState: AudioPlaybackState;
  playSubtopicAudio: (courseId: string, subtopicId: string, startSentenceIndex?: number) => void;
  playEntireCourseAudio: (courseId: string) => void;
  playEksiklerimAudio: () => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
  setAudioSpeed: (speed: number) => void;
  jumpToSentence: (sentenceIndex: number) => void;
  nextSentence: () => void;
  prevSentence: () => void;
  
  // Stats & Progress
  userStats: UserStats;
  answerQuestion: (questionId: string, selectedIndex: number, isCorrect: boolean, subtopicId: string) => void;
  resetWrongQuestion: (questionId: string) => void;
  toggleSubtopicWeak: (subtopicId: string) => void;
  markSubtopicCompleted: (subtopicId: string) => void;
  getCourseStats: (courseId: string) => { totalQuestions: number; solvedCount: number; correctCount: number; successRate: number; coverageRate: number };
  getOverallStats: () => { totalOfficial: number; solvedCount: number; correctCount: number; wrongCount: number; successRate: number; coverageRate: number };

  // Yeni soru havuzu (ders bazlı yüklenir)
  questionsLoading: boolean;
  loadedCourseIds: string[];
  ensureCourseQuestions: (courseId: string) => void;
  // Kişisel işaretler
  toggleRepeat: (questionId: string) => void;
  setQuestionDifficulty: (questionId: string, d: 0 | 1 | 2 | null) => void;
  /** Kişisel zorluk yoksa hazır zorluk */
  effectiveDifficulty: (q: Question) => 0 | 1 | 2;
  // Mutlaka Bil'den teste yönlendirme
  testPreset: { part?: 'mb' | 'konu' } | null;
  setTestPreset: (p: { part?: 'mb' | 'konu' } | null) => void;
  // Eksiklerim (bilgi tabanlı)
  eksiklerim: EksikCourse[];
  playEksiklerimCourse: (courseId: string, subtopicId?: string) => void;
  // Veri taşıma
  exportProgress: () => ProgressExport;
  importProgress: (data: unknown, mode: 'overwrite' | 'merge') => { ok: boolean; message: string };
  // Ses ayarı
  audioSource: AudioSource;
  setAudioSource: (s: AudioSource) => void;

  // Helpers
  currentCourse: Course | null;
  currentSubtopic: Subtopic | null;
  allWrongQuestions: { question: Question; subtopic: Subtopic; course: Course }[];
  weakSubtopics: { subtopic: Subtopic; course: Course }[];
  enableBackgroundAudio: () => boolean;
}

const STORAGE_KEY = 'trp_akademi_user_stats_v1';

const initialStats: UserStats = {
  solvedQuestions: {},
  correctQuestionIds: [],
  wrongQuestionIds: [],
  completedSubtopicIds: [],
  weakSubtopicIds: []
};

/** Yerel ve sunucudaki ilerlemeyi birleştirir (hiçbir şey silinmez; aynı soruda yerel cevap öncelikli). */
const mergeStats = (local: UserStats, remote: UserStats | null): UserStats => {
  if (!remote) return local;
  const solved = { ...(remote.solvedQuestions || {}), ...local.solvedQuestions };
  const correct = Object.keys(solved).filter(id => {
    const inLocal = id in local.solvedQuestions;
    return inLocal ? local.correctQuestionIds.includes(id) : (remote.correctQuestionIds || []).includes(id);
  });
  const wrong = Object.keys(solved).filter(id => {
    const inLocal = id in local.solvedQuestions;
    return inLocal ? local.wrongQuestionIds.includes(id) : (remote.wrongQuestionIds || []).includes(id);
  });
  const union = (a: string[] = [], b: string[] = []) => Array.from(new Set([...a, ...b]));
  return {
    ...remote,
    ...local,
    solvedQuestions: solved,
    correctQuestionIds: correct,
    wrongQuestionIds: wrong,
    completedSubtopicIds: union(local.completedSubtopicIds, remote.completedSubtopicIds),
    weakSubtopicIds: union(local.weakSubtopicIds, remote.weakSubtopicIds).filter(
      id => !union(local.completedSubtopicIds, remote.completedSubtopicIds).includes(id)
    ),
    marks: { ...(remote.marks || {}), ...(local.marks || {}) },
    lastStudiedTimestamp: Math.max(local.lastStudiedTimestamp || 0, remote.lastStudiedTimestamp || 0) || undefined
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(COURSES_DATA);
  const [loadedCourseIds, setLoadedCourseIds] = useState<string[]>([]);
  const inFlight = useRef<Set<string>>(new Set());

  const ensureCourseQuestions = (courseId: string) => {
    if (inFlight.current.has(courseId)) return;
    inFlight.current.add(courseId);
    fetchCourseQuestions(courseId)
      .then(bySub => {
        setCourses(prev =>
          prev.map(c =>
            c.id !== courseId
              ? c
              : { ...c, subtopics: c.subtopics.map(s => ({ ...s, questions: bySub[s.id] || [] })) }
          )
        );
        setLoadedCourseIds(prev => (prev.includes(courseId) ? prev : [...prev, courseId]));
      })
      .catch(() => {
        inFlight.current.delete(courseId); // sonra yeniden denenebilsin
      })
      .finally(() => {});
  };
  const questionsLoading = loadedCourseIds.length < COURSES_DATA.length;

  // Tüm dersleri arka planda sırayla yükle (ilk açılışı yavaşlatmasın diye gecikmeli)
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      for (const c of COURSES_DATA) {
        if (cancelled) return;
        ensureCourseQuestions(c.id);
        await new Promise(r => setTimeout(r, 400));
      }
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [testPreset, setTestPreset] = useState<{ part?: 'mb' | 'konu' } | null>(null);

  const [audioSource, setAudioSourceState] = useState<AudioSource>(() => {
    try {
      return localStorage.getItem('trp_audio_source') === 'device' ? 'device' : 'program';
    } catch {
      return 'program';
    }
  });
  useEffect(() => {
    speechService.setPreferDevice(audioSource === 'device');
  }, [audioSource]);
  const setAudioSource = (s: AudioSource) => {
    setAudioSourceState(s);
    try {
      localStorage.setItem('trp_audio_source', s);
    } catch {
      /* yoksay */
    }
  };
  const [activeView, setActiveView] = useState<'home' | 'course' | 'subtopic' | 'eksiklerim' | 'mutlakabil' | 'hafiza' | 'deneme' | 'plan'>('home');
  const goToPlan = () => {
    setActiveView('plan');
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  };
  const savePlan = (plan: StudyPlan | null) => {
    setUserStats(prev => {
      const next = { ...prev };
      if (plan) next.plan = plan;
      else delete next.plan;
      return next;
    });
  };
  const setReminders = (r: ReminderPrefs) => setUserStats(prev => ({ ...prev, reminders: r }));

  const [keepBackgroundAudio, setKeepBgState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('trp_bg_audio') === '1';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    speechService.setKeepBackground(keepBackgroundAudio);
  }, [keepBackgroundAudio]);
  const setKeepBackgroundAudio = (v: boolean) => {
    setKeepBgState(v);
    try {
      localStorage.setItem('trp_bg_audio', v ? '1' : '0');
    } catch {
      /* yoksay */
    }
  };
  const [mbSelection, setMbSelection] = useState<{ courseId: string; subtopicId: string } | null>(null);
  const [hkSelection, setHkSelection] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string | null>(null);
  const [activeSubtopicTab, setActiveSubtopicTab] = useState<'lecture' | 'test'>('lecture');

  // Load user progress from localStorage
  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse localStorage stats:', e);
    }
    return initialStats;
  });

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userStats));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [userStats]);

  // Bulut senkronu (yalnızca Supabase ayarlı ve kullanıcı giriş yapmışsa)
  const auth = useAuth();
  const syncedFor = useRef<string | null>(null);
  useEffect(() => {
    const uid = auth.user?.id;
    if (!supabase || !uid) {
      syncedFor.current = null;
      return;
    }
    let alive = true;
    supabase
      .from('progress')
      .select('data')
      .eq('user_id', uid)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive || error) return;
        setUserStats(local => mergeStats(local, (data?.data as UserStats) || null));
        syncedFor.current = uid;
      });
    return () => {
      alive = false;
    };
  }, [auth.user?.id]);

  useEffect(() => {
    const uid = auth.user?.id;
    if (!supabase || !uid || syncedFor.current !== uid) return;
    const t = setTimeout(() => {
      supabase!.from('progress').upsert({ user_id: uid, data: userStats, updated_at: new Date().toISOString() }).then(() => {});
    }, 1500);
    return () => clearTimeout(t);
  }, [userStats, auth.user?.id]);

  // Audio state
  const [audioState, setAudioState] = useState<AudioPlaybackState>({
    isPlaying: false,
    isPaused: false,
    currentCourseId: null,
    currentSubtopicId: null,
    currentSentenceIndex: 0,
    totalSentences: 0,
    speed: 1.0,
    mode: 'subtopic'
  });

  // Audio queue for entire_course or eksiklerim
  const [audioQueue, setAudioQueue] = useState<{ courseId: string; subtopicId: string }[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(0);

  // Subscribe to speech service events
  useEffect(() => {
    const unsubscribe = speechService.subscribe({
      onSentenceChange: (index) => {
        setAudioState(prev => ({
          ...prev,
          currentSentenceIndex: index
        }));
      },
      onStateChange: (isPlaying, isPaused) => {
        setAudioState(prev => ({
          ...prev,
          isPlaying,
          isPaused
        }));
      },
      onFinish: () => {
        // Kuyruk ilerlemesi ses servisinde yapılır (arka planda da sürsün diye); buraya yalnızca tüm okuma bitince gelinir.
        setAudioState(prev => {
          if (prev.currentCourseId && prev.currentSubtopicId) {
            setActiveSubtopicTab('test');
          }
          return {
            ...prev,
            isPlaying: false,
            isPaused: false
          };
        });
        setAudioQueue([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [audioQueue, queueIndex]);

  // Current selected objects
  const currentCourse = useMemo(() => {
    if (!selectedCourseId) return null;
    return courses.find(c => c.id === selectedCourseId) || null;
  }, [courses, selectedCourseId]);

  const currentSubtopic = useMemo(() => {
    if (!currentCourse || !selectedSubtopicId) return null;
    return currentCourse.subtopics.find(s => s.id === selectedSubtopicId) || null;
  }, [currentCourse, selectedSubtopicId]);

  // Navigation handlers
  const goToHome = () => {
    setActiveView('home');
    setSelectedCourseId(null);
    setSelectedSubtopicId(null);
  };

  const goToCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedSubtopicId(null);
    setActiveView('course');
  };

  const goToSubtopic = (courseId: string, subtopicId: string, tab: 'lecture' | 'test' = 'lecture') => {
    setSelectedCourseId(courseId);
    setSelectedSubtopicId(subtopicId);
    setActiveSubtopicTab(tab);
    setActiveView('subtopic');
  };

  const goToEksiklerim = () => {
    setActiveView('eksiklerim');
  };

  const goToDeneme = () => {
    setActiveView('deneme');
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  };

  const goToHafiza = (cardId?: string) => {
    setHkSelection(cardId || null);
    setActiveView('hafiza');
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  };

  const goToMutlakaBil = (courseId?: string, subtopicId?: string) => {
    setMbSelection(courseId && subtopicId ? { courseId, subtopicId } : null);
    setActiveView('mutlakabil');
  };

  // Internal helper to start reading a subtopic
  const startPlayingSubtopic = (
    courseId: string,
    subtopicId: string,
    startSentenceIndex = 0,
    queue: { courseId: string; subtopicId: string }[] = [],
    queuePos = 0
  ) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    const subtopic = course.subtopics.find(s => s.id === subtopicId);
    if (!subtopic || subtopic.sentences.length === 0) return;

    const sentenceTexts = subtopic.sentences.map(s => s.cleanText);

    setAudioState(prev => ({
      ...prev,
      currentCourseId: courseId,
      currentSubtopicId: subtopicId,
      currentSentenceIndex: startSentenceIndex,
      totalSentences: subtopic.sentences.length,
      isPlaying: true,
      isPaused: false
    }));

    // Kuyruktaki sıradaki alt başlığı ses servisi kendisi başlatır (arka planda React'e bağlı kalmadan).
    let pos = queuePos;
    const nextProvider = () => {
      while (pos < queue.length - 1) {
        pos++;
        const item = queue[pos];
        const c = courses.find(x => x.id === item.courseId);
        const s = c?.subtopics.find(x => x.id === item.subtopicId);
        if (!c || !s || s.sentences.length === 0) continue;
        setQueueIndex(pos);
        setAudioState(prev => ({
          ...prev,
          currentCourseId: c.id,
          currentSubtopicId: s.id,
          currentSentenceIndex: 0,
          totalSentences: s.sentences.length,
          isPlaying: true,
          isPaused: false
        }));
        return {
          sentences: s.sentences.map(x => x.cleanText),
          audioId: s.id,
          meta: { title: s.title, subtopicTitle: s.title, courseTitle: c.title },
          startIndex: 0
        };
      }
      return null;
    };

    speechService.play(
      sentenceTexts,
      startSentenceIndex,
      {
        title: subtopic.title,
        subtopicTitle: subtopic.title,
        courseTitle: course.title
      },
      subtopic.id,
      queue.length > 1 ? nextProvider : undefined
    );
  };

  // 1. Play specific subtopic
  const playSubtopicAudio = (courseId: string, subtopicId: string, startSentenceIndex = 0) => {
    setAudioQueue([]);
    setQueueIndex(0);
    setAudioState(prev => ({ ...prev, mode: 'subtopic' }));
    startPlayingSubtopic(courseId, subtopicId, startSentenceIndex);
  };

  // 2. Play entire course ("Dersin Tümünü Dinle")
  const playEntireCourseAudio = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    const availableSubtopics = course.subtopics.filter(s => s.isAvailable && s.sentences.length > 0);
    if (availableSubtopics.length === 0) return;

    const queue = availableSubtopics.map(s => ({ courseId, subtopicId: s.id }));
    setAudioQueue(queue);
    setQueueIndex(0);
    setAudioState(prev => ({ ...prev, mode: 'entire_course' }));
    startPlayingSubtopic(courseId, queue[0].subtopicId, 0, queue, 0);
  };

  // 3. Play Eksiklerim ("Eksiklerimi Dinle")
  const playEksiklerimAudio = () => {
    // Get all weak or incomplete subtopics
    const list: { courseId: string; subtopicId: string }[] = [];
    courses.forEach(c => {
      c.subtopics.forEach(s => {
        if (s.isAvailable && (userStats.weakSubtopicIds.includes(s.id) || !userStats.completedSubtopicIds.includes(s.id))) {
          list.push({ courseId: c.id, subtopicId: s.id });
        }
      });
    });

    if (list.length === 0) {
      // Fallback: take all available subtopics
      courses.forEach(c => {
        c.subtopics.forEach(s => {
          if (s.isAvailable) list.push({ courseId: c.id, subtopicId: s.id });
        });
      });
    }

    if (list.length === 0) return;

    setAudioQueue(list);
    setQueueIndex(0);
    setAudioState(prev => ({ ...prev, mode: 'eksiklerim' }));
    startPlayingSubtopic(list[0].courseId, list[0].subtopicId, 0, list, 0);
  };

  // Mutlaka Bil (hızlı tekrar) sesli okuma: tek alt başlık ya da dersin tüm alt başlıkları sırayla
  const playMustKnow = (courseId: string, subtopicId: string, startSentenceIndex = 0, wholeCourse = false) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    const ids = wholeCourse
      ? course.subtopics.filter(s => MUTLAKA_BIL[s.id]?.length).map(s => s.id)
      : [subtopicId];
    const startPos = Math.max(0, ids.indexOf(subtopicId));
    const sub = course.subtopics.find(s => s.id === ids[startPos]);
    const first = sub ? MUTLAKA_BIL[sub.id] : null;
    if (!sub || !first || first.length === 0) return;

    setAudioQueue([]);
    setAudioState(prev => ({
      ...prev,
      mode: 'mutlaka_bil',
      currentCourseId: courseId,
      currentSubtopicId: sub.id,
      currentSentenceIndex: startSentenceIndex,
      totalSentences: first.length,
      isPlaying: true,
      isPaused: false
    }));

    let pos = startPos;
    const nextProvider = () => {
      while (pos < ids.length - 1) {
        pos++;
        const s = course.subtopics.find(x => x.id === ids[pos]);
        const list = s ? MUTLAKA_BIL[s.id] : null;
        if (!s || !list || list.length === 0) continue;
        setAudioState(prev => ({
          ...prev,
          currentSubtopicId: s.id,
          currentSentenceIndex: 0,
          totalSentences: list.length,
          isPlaying: true,
          isPaused: false
        }));
        return {
          sentences: list,
          audioId: 'mb_' + s.id,
          meta: { title: 'Mutlaka Bil: ' + s.title, subtopicTitle: s.title, courseTitle: course.title },
          startIndex: 0
        };
      }
      return null;
    };

    speechService.play(
      first,
      startSentenceIndex,
      { title: 'Mutlaka Bil: ' + sub.title, subtopicTitle: sub.title, courseTitle: course.title },
      'mb_' + sub.id,
      ids.length > 1 ? nextProvider : undefined
    );
  };
  const pauseAudio = () => speechService.pause();
  const resumeAudio = () => speechService.resume();
  const stopAudio = () => {
    speechService.stop();
    setAudioQueue([]);
  };

  const setAudioSpeed = (speed: number) => {
    speechService.setSpeed(speed);
    setAudioState(prev => ({ ...prev, speed }));
  };

  const jumpToSentence = (index: number) => {
    speechService.jumpToSentence(index);
  };

  const nextSentence = () => speechService.nextSentence();
  const prevSentence = () => speechService.prevSentence();

  const enableBackgroundAudio = () => {
    return speechService.enableBackgroundAudio();
  };

  // Stats and answering questions
  const answerQuestion = (questionId: string, selectedIndex: number, isCorrect: boolean, subtopicId: string) => {
    setUserStats(prev => {
      const nextSolved = { ...prev.solvedQuestions, [questionId]: selectedIndex };
      const nextCorrect = isCorrect
        ? Array.from(new Set([...prev.correctQuestionIds, questionId]))
        : prev.correctQuestionIds.filter(id => id !== questionId);
      
      const nextWrong = !isCorrect
        ? Array.from(new Set([...prev.wrongQuestionIds, questionId]))
        : prev.wrongQuestionIds.filter(id => id !== questionId);

      // Auto-tag subtopic as weak if question is wrong
      let nextWeak = prev.weakSubtopicIds;
      if (!isCorrect && !nextWeak.includes(subtopicId)) {
        nextWeak = [...nextWeak, subtopicId];
      }

      return {
        ...prev,
        solvedQuestions: nextSolved,
        correctQuestionIds: nextCorrect,
        wrongQuestionIds: nextWrong,
        weakSubtopicIds: nextWeak,
        lastStudiedSubtopicId: subtopicId,
        lastStudiedTimestamp: Date.now()
      };
    });
  };

  const resetWrongQuestion = (questionId: string) => {
    setUserStats(prev => {
      const nextSolved = { ...prev.solvedQuestions };
      delete nextSolved[questionId];
      return {
        ...prev,
        solvedQuestions: nextSolved,
        wrongQuestionIds: prev.wrongQuestionIds.filter(id => id !== questionId),
        correctQuestionIds: prev.correctQuestionIds.filter(id => id !== questionId)
      };
    });
  };

  const toggleSubtopicWeak = (subtopicId: string) => {
    setUserStats(prev => {
      const exists = prev.weakSubtopicIds.includes(subtopicId);
      return {
        ...prev,
        weakSubtopicIds: exists
          ? prev.weakSubtopicIds.filter(id => id !== subtopicId)
          : [...prev.weakSubtopicIds, subtopicId]
      };
    });
  };

  const markSubtopicCompleted = (subtopicId: string) => {
    setUserStats(prev => ({
      ...prev,
      completedSubtopicIds: Array.from(new Set([...prev.completedSubtopicIds, subtopicId])),
      weakSubtopicIds: prev.weakSubtopicIds.filter(id => id !== subtopicId)
    }));
  };

  // ───────── Kişisel işaretler ─────────
  const toggleRepeat = (questionId: string) => {
    setUserStats(prev => {
      const marks = { ...(prev.marks || {}) };
      const cur = marks[questionId] || {};
      const next: QuestionMark = { ...cur };
      if (next.r) delete next.r;
      else next.r = 1;
      if (next.r === undefined && next.d === undefined) delete marks[questionId];
      else marks[questionId] = next;
      return { ...prev, marks };
    });
  };

  const setQuestionDifficulty = (questionId: string, d: 0 | 1 | 2 | null) => {
    setUserStats(prev => {
      const marks = { ...(prev.marks || {}) };
      const next: QuestionMark = { ...(marks[questionId] || {}) };
      if (d === null || next.d === d) delete next.d;
      else next.d = d;
      if (next.r === undefined && next.d === undefined) delete marks[questionId];
      else marks[questionId] = next;
      return { ...prev, marks };
    });
  };

  const effectiveDifficulty = (q: Question): 0 | 1 | 2 => {
    const m = userStats.marks?.[q.id];
    if (m && m.d !== undefined) return m.d;
    return q.diff ?? 1;
  };

  // ───────── Eksiklerim: çözülemeyen / "tekrar çöz" işaretli sorular için gereken bilgiler ─────────
  const eksiklerim = useMemo<EksikCourse[]>(() => {
    const marks = userStats.marks || {};
    const wrong = new Set(userStats.wrongQuestionIds);
    const out: EksikCourse[] = [];
    for (const course of courses) {
      const subs: EksikSubtopic[] = [];
      for (const subtopic of course.subtopics) {
        const qs = subtopic.questions.filter(q => wrong.has(q.id) || marks[q.id]?.r);
        if (qs.length === 0) continue;
        const sentById = new Map<number, { text: string; order: number; heading?: string }>();
        let heading: string | undefined;
        subtopic.sentences.forEach((s, i) => {
          if (s.isHeading) heading = s.cleanText || s.text;
          else sentById.set(s.id, { text: s.cleanText || s.text, order: i, heading });
        });
        const items = new Map<string, EksikItem>();
        qs.forEach((q, qi) => {
          const ks = (q.k || []).filter(id => sentById.has(id));
          if (ks.length === 0) {
            // konu anlatımında bağ kurulamadıysa açıklamayı bilgi olarak kullan
            const key = 'q:' + q.id;
            items.set(key, { key, text: q.explanation, order: 100000 + qi, questionIds: [q.id] });
            return;
          }
          for (const id of ks) {
            const key = 's:' + id;
            const ex = items.get(key);
            if (ex) ex.questionIds.push(q.id);
            else {
              const s = sentById.get(id)!;
              items.set(key, { key, text: s.text, heading: s.heading, order: s.order, questionIds: [q.id] });
            }
          }
        });
        subs.push({
          course,
          subtopic,
          items: Array.from(items.values()).sort((a, b) => a.order - b.order),
          questionCount: qs.length
        });
      }
      if (subs.length) {
        out.push({
          course,
          subtopics: subs,
          itemCount: subs.reduce((n, s) => n + s.items.length, 0),
          questionCount: subs.reduce((n, s) => n + s.questionCount, 0)
        });
      }
    }
    return out;
  }, [courses, userStats.wrongQuestionIds, userStats.marks]);

  /** Bir dersin (veya tek alt başlığın) eksik bilgilerini sırayla sesli okur */
  const playEksiklerimCourse = (courseId: string, subtopicId?: string) => {
    const ec = eksiklerim.find(e => e.course.id === courseId);
    if (!ec) return;
    const subs = ec.subtopics.filter(s => !subtopicId || s.subtopic.id === subtopicId);
    if (subs.length === 0) return;
    const mk = (s: EksikSubtopic) => ({
      sentences: s.items.map(i => i.text),
      audioId: undefined as string | undefined,
      meta: { title: 'Eksiklerim: ' + s.subtopic.title, subtopicTitle: s.subtopic.title, courseTitle: ec.course.title },
      startIndex: 0
    });
    const first = subs[0];
    setAudioQueue([]);
    setAudioState(prev => ({
      ...prev,
      mode: 'eksiklerim',
      currentCourseId: courseId,
      currentSubtopicId: first.subtopic.id,
      currentSentenceIndex: 0,
      totalSentences: first.items.length,
      isPlaying: true,
      isPaused: false
    }));
    let pos = 0;
    const nextProvider = () => {
      if (pos >= subs.length - 1) return null;
      pos++;
      const s = subs[pos];
      setAudioState(prev => ({
        ...prev,
        currentSubtopicId: s.subtopic.id,
        currentSentenceIndex: 0,
        totalSentences: s.items.length,
        isPlaying: true,
        isPaused: false
      }));
      return mk(s);
    };
    const m = mk(first);
    speechService.play(m.sentences, 0, m.meta, undefined, subs.length > 1 ? nextProvider : undefined);
  };

  // ───────── Veri taşıma ─────────
  const exportProgress = (): ProgressExport => ({
    format: 'trp-akademi-ilerleme',
    version: 1,
    exportedAt: new Date().toISOString(),
    stats: userStats,
    prefs: { audioSource }
  });

  const importProgress = (data: unknown, mode: 'overwrite' | 'merge') => {
    const d = data as Partial<ProgressExport> | null;
    if (!d || d.format !== 'trp-akademi-ilerleme' || !d.stats || typeof d.stats !== 'object' || !d.stats.solvedQuestions) {
      return { ok: false, message: 'Bu dosya TRP Akademi ilerleme dosyası değil.' };
    }
    const inc: UserStats = {
      ...initialStats,
      ...d.stats,
      solvedQuestions: d.stats.solvedQuestions || {},
      correctQuestionIds: d.stats.correctQuestionIds || [],
      wrongQuestionIds: d.stats.wrongQuestionIds || [],
      completedSubtopicIds: d.stats.completedSubtopicIds || [],
      weakSubtopicIds: d.stats.weakSubtopicIds || [],
      marks: d.stats.marks || {}
    };
    if (mode === 'overwrite') {
      setUserStats(inc);
      return { ok: true, message: 'Bu cihazdaki ilerleme, dosyadaki veriyle değiştirildi.' };
    }
    // birleştir: dosyadaki veri "yerel" öncelikli sayılır değil; en yeni çözüm kazanır → basit kural: bu cihaz öncelikli, eksikler dosyadan tamamlanır
    setUserStats(local => mergeStats(local, inc));
    return { ok: true, message: 'İki cihazdaki ilerleme birleştirildi.' };
  };

  // Calculate course stats matching report format
  const getCourseStats = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      return { totalQuestions: 0, solvedCount: 0, correctCount: 0, successRate: 0, coverageRate: 0 };
    }

    const totalQuestions = course.totalOfficialQuestions;
    const subtopicIds = course.subtopics.map(s => s.id);
    
    // Find all questions belonging to this course
    const courseQuestions: Question[] = [];
    course.subtopics.forEach(s => courseQuestions.push(...s.questions));

    const solvedForCourse = courseQuestions.filter(q => userStats.solvedQuestions[q.id] !== undefined);
    const correctForCourse = solvedForCourse.filter(q => userStats.correctQuestionIds.includes(q.id));

    const solvedCount = solvedForCourse.length;
    const correctCount = correctForCourse.length;
    const successRate = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : 0;
    const coverageRate = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;

    return {
      totalQuestions,
      solvedCount,
      correctCount,
      successRate,
      coverageRate
    };
  };

  // Overall statistics across all 11 courses
  const getOverallStats = () => {
    let totalOfficial = 0;
    courses.forEach(c => totalOfficial += c.totalOfficialQuestions);
    const isNew = (id: string) => id.startsWith('TRPA-'); // eski havuzdan kalan kayıtlar sayılmaz
    const solvedCount = Object.keys(userStats.solvedQuestions).filter(isNew).length;
    const correctCount = userStats.correctQuestionIds.filter(isNew).length;
    const wrongCount = userStats.wrongQuestionIds.filter(isNew).length;
    const successRate = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : 0;
    const coverageRate = totalOfficial > 0 ? Math.round((solvedCount / totalOfficial) * 100) : 0;

    return {
      totalOfficial,
      solvedCount,
      correctCount,
      wrongCount,
      successRate,
      coverageRate
    };
  };

  // Find all wrong questions with metadata
  const allWrongQuestions = useMemo(() => {
    const list: { question: Question; subtopic: Subtopic; course: Course }[] = [];
    courses.forEach(c => {
      c.subtopics.forEach(s => {
        s.questions.forEach(q => {
          if (userStats.wrongQuestionIds.includes(q.id)) {
            list.push({ question: q, subtopic: s, course: c });
          }
        });
      });
    });
    return list;
  }, [courses, userStats.wrongQuestionIds]);

  // Find weak/incomplete subtopics
  const weakSubtopics = useMemo(() => {
    const list: { subtopic: Subtopic; course: Course }[] = [];
    courses.forEach(c => {
      c.subtopics.forEach(s => {
        if (s.isAvailable && (userStats.weakSubtopicIds.includes(s.id) || !userStats.completedSubtopicIds.includes(s.id))) {
          list.push({ subtopic: s, course: c });
        }
      });
    });
    return list;
  }, [courses, userStats.weakSubtopicIds, userStats.completedSubtopicIds]);

  return (
    <AppContext.Provider
      value={{
        courses,
        activeView,
        mbSelection,
        hkSelection,
        goToHafiza,
        goToDeneme,
        selectedCourseId,
        selectedSubtopicId,
        activeSubtopicTab,
        goToHome,
        goToCourse,
        goToSubtopic,
        goToEksiklerim,
        goToMutlakaBil,
        playMustKnow,
        setActiveSubtopicTab,
        audioState,
        playSubtopicAudio,
        playEntireCourseAudio,
        playEksiklerimAudio,
        pauseAudio,
        resumeAudio,
        stopAudio,
        setAudioSpeed,
        jumpToSentence,
        nextSentence,
        prevSentence,
        userStats,
        answerQuestion,
        resetWrongQuestion,
        toggleSubtopicWeak,
        markSubtopicCompleted,
        getCourseStats,
        getOverallStats,
        currentCourse,
        currentSubtopic,
        allWrongQuestions,
        weakSubtopics,
        enableBackgroundAudio,
        questionsLoading,
        loadedCourseIds,
        ensureCourseQuestions,
        toggleRepeat,
        setQuestionDifficulty,
        effectiveDifficulty,
        testPreset,
        setTestPreset,
        eksiklerim,
        playEksiklerimCourse,
        exportProgress,
        importProgress,
        audioSource,
        setAudioSource,
        goToPlan,
        savePlan,
        setReminders,
        keepBackgroundAudio,
        setKeepBackgroundAudio
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
