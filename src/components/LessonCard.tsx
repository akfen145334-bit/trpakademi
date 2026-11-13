import React from 'react';
import { Course } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Volume2, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Headphones
} from 'lucide-react';

interface LessonCardProps {
  course: Course;
}

export const LessonCard: React.FC<LessonCardProps> = ({ course }) => {
  const { 
    goToSubtopic, 
    goToCourse,
    playSubtopicAudio, 
    playEntireCourseAudio,
    getCourseStats,
    audioState,
    userStats
  } = useApp();

  const stats = getCourseStats(course.id);
  const isCurrentlyPlayingCourse = audioState.isPlaying && audioState.currentCourseId === course.id;

  return (
    <div className={`rounded-xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
      course.isAvailable 
        ? 'bg-white border-slate-300/80' 
        : 'bg-slate-50/70 border-dashed border-slate-300 opacity-90'
    }`}>
      {/* Course Header Bar - Framed Header like the reference report */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Title & Official Questions Badge */}
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              course.isAvailable ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-500'
            }`}>
              <BookOpenIcon name={course.iconName} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => course.isAvailable && goToCourse(course.id)}
                  disabled={!course.isAvailable}
                  className={`font-bold text-base sm:text-lg tracking-tight text-left transition cursor-pointer ${
                    course.isAvailable ? 'text-slate-900 hover:text-amber-700' : 'text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {course.title}
                </button>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  {stats.solvedCount}/{course.subtopics.reduce((acc, s) => acc + s.questions.length, 0)} aktif soru (Havuz: {course.totalOfficialQuestions})
                </span>
                {!course.isAvailable && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                    Kullanıcı Konu Anlatımı Bekleniyor
                  </span>
                )}
              </div>

              {/* Success & Coverage Metrics matching user report */}
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-slate-500">Başarı:</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold font-mono ${
                    stats.successRate >= 70 ? 'bg-emerald-100 text-emerald-800' :
                    stats.successRate >= 40 ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    %{stats.successRate}
                  </span>
                  <span className="text-slate-400">({stats.correctCount}/{stats.solvedCount} doğru)</span>
                </div>

                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-slate-500">Kapsam:</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-bold font-mono">
                    %{stats.coverageRate}
                  </span>
                  <span className="text-slate-400">({stats.solvedCount}/{course.totalOfficialQuestions} çözüldü)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action: "Dersin Tümünü Dinle" Button */}
          {course.isAvailable && (
            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <button
                onClick={() => playEntireCourseAudio(course.id)}
                title="Bu dersin tüm alt konularını sırayla dinle"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer ${
                  isCurrentlyPlayingCourse && audioState.mode === 'entire_course'
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Dersin Tümünü Dinle</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Subtopics Listing (Exact Report Format: Boxed / Framed items) */}
      <div className="p-3 sm:p-4 divide-y divide-slate-100">
        <div className="grid grid-cols-1 gap-2">
          {course.subtopics.map((subtopic) => {
            const isPlayingThisSubtopic = audioState.isPlaying && audioState.currentSubtopicId === subtopic.id;
            const isCompleted = userStats.completedSubtopicIds.includes(subtopic.id);
            const isWeak = userStats.weakSubtopicIds.includes(subtopic.id);
            const solvedInSubtopic = subtopic.questions.filter(q => userStats.solvedQuestions[q.id] !== undefined).length;

            return (
              <div 
                key={subtopic.id}
                className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-lg border transition-all ${
                  isPlayingThisSubtopic 
                    ? 'bg-amber-50/90 border-amber-300 shadow-xs ring-1 ring-amber-300' 
                    : isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50/70'
                    : isWeak
                    ? 'bg-rose-50/40 border-rose-200/80 hover:bg-rose-50/70'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                {/* Left: Clickable Title & Question Count */}
                <button
                  onClick={() => subtopic.isAvailable && goToSubtopic(course.id, subtopic.id)}
                  disabled={!subtopic.isAvailable}
                  className="flex items-start sm:items-center gap-2.5 min-w-0 text-left cursor-pointer flex-1 mr-2"
                >
                  <div className={`w-2 h-2 mt-1.5 sm:mt-0 rounded-full shrink-0 ${
                    isPlayingThisSubtopic ? 'bg-amber-500 animate-ping' :
                    isCompleted ? 'bg-emerald-500' :
                    isWeak ? 'bg-rose-500' : 'bg-slate-300'
                  }`} />

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 min-w-0 flex-1">
                    <span className={`text-sm font-semibold leading-snug break-words sm:truncate transition ${
                      subtopic.isAvailable
                        ? 'text-slate-800 group-hover:text-amber-800'
                        : 'text-slate-400 cursor-not-allowed'
                    }`}>
                      {subtopic.title}
                    </span>

                    <span className="self-start text-[11px] font-mono text-slate-600 font-bold px-2 py-0.5 rounded bg-amber-50/80 border border-amber-200 shrink-0">
                      {solvedInSubtopic}/{subtopic.questions.length} soru<span className="hidden sm:inline"> (Havuz: {subtopic.officialQuestionCount})</span>
                    </span>
                  </div>
                </button>

                {/* Right: Individual "Dinle" Button next to subtopic */}
                {subtopic.isAvailable ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => playSubtopicAudio(course.id, subtopic.id)}
                      title={`Sadece ${subtopic.title} konusunu sesli dinle`}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                        isPlayingThisSubtopic 
                          ? 'bg-amber-500 text-slate-950 font-black' 
                          : 'bg-amber-100/80 hover:bg-amber-200 text-amber-900 border border-amber-200'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dinle</span>
                    </button>

                    <button
                      onClick={() => goToSubtopic(course.id, subtopic.id, 'test')}
                      title="Testi Aç"
                      className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition cursor-pointer"
                    >
                      <span>Test ({subtopic.questions.length} Soru)</span>
                    </button>

                    <button
                      onClick={() => goToSubtopic(course.id, subtopic.id, 'lecture')}
                      className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">
                    Bekleniyor
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function BookOpenIcon({ name }: { name: string }) {
  return <Headphones className="w-4 h-4 text-amber-700" />;
}
