import React, { useEffect, useRef } from 'react';
import { Subtopic, Course } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  Gauge, 
  Bookmark, 
  CheckCircle, 
  HelpCircle, 
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface LectureViewerProps {
  course: Course;
  subtopic: Subtopic;
  onSwitchToTest: () => void;
}

export const LectureViewer: React.FC<LectureViewerProps> = ({ course, subtopic, onSwitchToTest }) => {
  const { 
    audioState, 
    playSubtopicAudio, 
    pauseAudio, 
    resumeAudio, 
    stopAudio, 
    setAudioSpeed, 
    jumpToSentence,
    userStats,
    toggleSubtopicWeak,
    markSubtopicCompleted
  } = useApp();

  const isCurrentPlayingThis = audioState.isPlaying && audioState.currentSubtopicId === subtopic.id;
  const isCurrentPausedThis = audioState.isPaused && audioState.currentSubtopicId === subtopic.id;
  const activeSentenceIndex = isCurrentPlayingThis || isCurrentPausedThis 
    ? audioState.currentSentenceIndex 
    : -1;

  const isWeak = userStats.weakSubtopicIds.includes(subtopic.id);
  const isCompleted = userStats.completedSubtopicIds.includes(subtopic.id);

  // Auto-scroll active sentence smoothly into visible center
  const activeSentenceRef = useRef<any>(null);

  useEffect(() => {
    if (activeSentenceIndex >= 0 && activeSentenceRef.current) {
      activeSentenceRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeSentenceIndex]);

  const handlePlayToggle = () => {
    if (isCurrentPlayingThis) {
      pauseAudio();
    } else if (isCurrentPausedThis) {
      resumeAudio();
    } else {
      playSubtopicAudio(course.id, subtopic.id, 0);
    }
  };

  const speedOptions = [0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="space-y-6">
      
      {/* Top Audio Control Bar for the Subtopic */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200/90 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Main Play / Pause Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayToggle}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm cursor-pointer ${
                isCurrentPlayingThis
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {isCurrentPlayingThis ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Duraklat</span>
                </>
              ) : isCurrentPausedThis ? (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Devam Et</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Sesli Dinle</span>
                </>
              )}
            </button>

            {(isCurrentPlayingThis || isCurrentPausedThis) && (
              <button
                onClick={stopAudio}
                title="Seslendirmeyi Durdur"
                className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl transition cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            )}

            {/* Sentence counter */}
            {(isCurrentPlayingThis || isCurrentPausedThis) && (
              <span className="text-xs font-mono text-slate-600 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg">
                Cümle {audioState.currentSentenceIndex + 1} / {subtopic.sentences.length}
              </span>
            )}
          </div>

          {/* Right Tools: Speed, Mark Weak, Go to Test */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <Gauge className="w-3.5 h-3.5 text-slate-500 ml-1" />
              {speedOptions.map(spd => (
                <button
                  key={spd}
                  onClick={() => setAudioSpeed(spd)}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    audioState.speed === spd
                      ? 'bg-amber-600 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Mark as Weak / Needs review */}
            <button
              onClick={() => toggleSubtopicWeak(subtopic.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                isWeak
                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isWeak ? 'fill-current text-rose-600' : 'text-slate-400'}`} />
              <span>{isWeak ? 'Eksiklerimde Kayıtlı' : 'Eksiklerime Ekle'}</span>
            </button>

            {/* Mark completed */}
            <button
              onClick={() => markSubtopicCompleted(subtopic.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300'
              }`}
            >
              <CheckCircle className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isCompleted ? 'Tamamlandı' : 'Tamamlandı Olarak İşaretle'}</span>
            </button>

            {/* Switch to Test button */}
            <button
              onClick={onSwitchToTest}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition cursor-pointer"
            >
              <span>Testi Çöz ({subtopic.questions.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Live Reader Hint */}
        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
          <span>
            💡 İpucu: Metindeki <strong>herhangi bir cümleye tıklayarak</strong> seslendirmeyi doğrudan oradan başlatabilirsiniz.
          </span>
          {isCurrentPlayingThis && (
            <span className="text-amber-800 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Sarı fosforlu cümle canlı okunuyor
            </span>
          )}
        </div>
      </div>

      {/* Synchronized Reading Content Container */}
      <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs text-slate-800 text-base sm:text-lg leading-relaxed select-text">
        <div className="prose max-w-none">
          {subtopic.sentences.map((sentence, idx) => {
            const isHighlighted = idx === activeSentenceIndex;

            if (sentence.isHeading) {
              return (
                <h3
                  key={sentence.id}
                  ref={isHighlighted ? activeSentenceRef : null}
                  onClick={() => jumpToSentence(idx)}
                  className={`mt-8 mb-4 text-xl sm:text-2xl font-black tracking-tight cursor-pointer transition-all duration-200 ${
                    isHighlighted
                      ? 'bg-amber-200 text-slate-950 px-2 py-1 rounded-md shadow-xs ring-2 ring-amber-300'
                      : 'text-slate-900 hover:text-amber-700'
                  }`}
                >
                  {sentence.text}
                </h3>
              );
            }

            if (sentence.isTable) {
              return (
                <div
                  key={sentence.id}
                  ref={isHighlighted ? activeSentenceRef : null}
                  onClick={() => jumpToSentence(idx)}
                  className={`my-2 p-3 rounded-lg border text-sm font-mono cursor-pointer transition-all duration-200 ${
                    isHighlighted
                      ? 'bg-amber-100 border-amber-300 text-slate-950 font-bold ring-2 ring-amber-300 shadow-xs'
                      : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-amber-50/50'
                  }`}
                >
                  {sentence.text}
                </div>
              );
            }

            return (
              <span
                key={sentence.id}
                ref={isHighlighted ? activeSentenceRef : null}
                onClick={() => jumpToSentence(idx)}
                title="Bu cümleden itibaren dinle"
                className={`inline cursor-pointer transition-colors duration-150 rounded px-0.5 py-0.5 mr-1 ${
                  isHighlighted
                    ? 'bg-amber-200 text-slate-950 font-semibold ring-2 ring-amber-300 shadow-xs'
                    : 'hover:bg-amber-50 hover:text-slate-950'
                }`}
              >
                {sentence.text}{' '}
              </span>
            );
          })}
        </div>
      </article>

      {/* Bottom Switch to Test prompt */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-slate-900 text-base">
            Konu Anlatımını Tamamladınız mı?
          </h4>
          <p className="text-xs text-slate-600 mt-1">
            Bu alt konuya ait çoktan seçmeli test sorularını çözerek bilgilerinizi pekiştirin ve eksiklerinizi tespit edin.
          </p>
        </div>

        <button
          onClick={onSwitchToTest}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition shrink-0 cursor-pointer"
        >
          <span>Test Bölümüne Geç ({subtopic.questions.length} Soru)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
