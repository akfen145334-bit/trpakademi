import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { Course, Subtopic, Question, UserStats, AudioPlaybackState } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { speechService } from '../services/speechService';

interface AppContextType {
  courses: Course[];
  activeView: 'home' | 'course' | 'subtopic' | 'eksiklerim';
  selectedCourseId: string | null;
  selectedSubtopicId: string | null;
  activeSubtopicTab: 'lecture' | 'test';
  
  // Navigation
  goToHome: () => void;
  goToCourse: (courseId: string) => void;
  goToSubtopic: (courseId: string, subtopicId: string, tab?: 'lecture' | 'test') => void;
  goToEksiklerim: () => void;
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses] = useState<Course[]>(COURSES_DATA);
  const [activeView, setActiveView] = useState<'home' | 'course' | 'subtopic' | 'eksiklerim'>('home');
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
    const solvedCount = Object.keys(userStats.solvedQuestions).length;
    const correctCount = userStats.correctQuestionIds.length;
    const wrongCount = userStats.wrongQuestionIds.length;
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
        selectedCourseId,
        selectedSubtopicId,
        activeSubtopicTab,
        goToHome,
        goToCourse,
        goToSubtopic,
        goToEksiklerim,
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
        enableBackgroundAudio
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
