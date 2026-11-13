import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Gauge, 
  Radio, 
  Smartphone,
  BookOpen
} from 'lucide-react';

export const AudioPlayerBar: React.FC = () => {
  const { 
    audioState, 
    pauseAudio, 
    resumeAudio, 
    stopAudio, 
    setAudioSpeed, 
    prevSentence, 
    nextSentence,
    courses,
    goToSubtopic,
    goToMutlakaBil
  } = useApp();

  if (!audioState.isPlaying && !audioState.isPaused) {
    return null;
  }

  // Find metadata
  const course = courses.find(c => c.id === audioState.currentCourseId);
  const subtopic = course?.subtopics.find(s => s.id === audioState.currentSubtopicId);

  const speedOptions = [0.75, 1.0, 1.25, 1.5, 2.0];
  const progressPercent = audioState.totalSentences > 0 
    ? Math.round(((audioState.currentSentenceIndex + 1) / audioState.totalSentences) * 100) 
    : 0;

  const modeLabels = {
    subtopic: 'Alt Konu Dinleniyor',
    entire_course: 'Dersin Tümü Dinleniyor (Sırayla)',
    eksiklerim: 'Eksiklerim Dinleniyor',
    mutlaka_bil: 'Mutlaka Bil Dinleniyor'
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 text-white shadow-2xl transition-all">
      {/* Top slim progress line */}
      <div className="w-full bg-slate-800 h-1">
        <div 
          className="bg-amber-400 h-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>

      {/* Mobil: tek satırlık kompakt oynatıcı */}
      <div className="md:hidden px-3 py-2">
        <button
          onClick={() => {
            if (audioState.currentCourseId && audioState.currentSubtopicId) {
              (audioState.mode === 'mutlaka_bil' ? goToMutlakaBil : goToSubtopic)(audioState.currentCourseId, audioState.currentSubtopicId);
            }
          }}
          className="w-full flex items-center justify-between gap-2 text-left cursor-pointer"
          title="Metne git"
        >
          <span className="text-[13px] font-bold text-white truncate">{subtopic?.title || 'Konu Başlığı'}</span>
          <span className="text-[11px] text-slate-400 font-mono shrink-0">
            {audioState.currentSentenceIndex + 1}/{audioState.totalSentences}
          </span>
        </button>
        <div className="flex items-center justify-between gap-1 mt-1">
          <button onClick={prevSentence} aria-label="Önceki cümle" className="p-2 text-slate-300 rounded-lg cursor-pointer">
            <SkipBack className="w-5 h-5" />
          </button>
          {audioState.isPaused ? (
            <button onClick={resumeAudio} aria-label="Devam et" className="p-2.5 bg-amber-500 text-slate-950 rounded-full cursor-pointer">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          ) : (
            <button onClick={pauseAudio} aria-label="Duraklat" className="p-2.5 bg-amber-500 text-slate-950 rounded-full cursor-pointer">
              <Pause className="w-5 h-5 fill-current" />
            </button>
          )}
          <button onClick={nextSentence} aria-label="Sonraki cümle" className="p-2 text-slate-300 rounded-lg cursor-pointer">
            <SkipForward className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              const i = speedOptions.indexOf(audioState.speed);
              setAudioSpeed(speedOptions[(i + 1) % speedOptions.length]);
            }}
            aria-label="Okuma hızını değiştir"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 border border-slate-700 text-amber-300 cursor-pointer"
          >
            {audioState.speed}x
          </button>
          <button onClick={stopAudio} aria-label="Durdur ve kapat" className="p-2 text-rose-400 rounded-lg cursor-pointer">
            <Square className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>

      {/* Masaüstü / tablet: tam oynatıcı */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Left: Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              audioState.isPlaying && !audioState.isPaused 
                ? 'bg-amber-500 text-slate-950 animate-pulse' 
                : 'bg-slate-800 text-slate-300'
            }`}>
              <Volume2 className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {modeLabels[audioState.mode] || 'Sesli Anlatım'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Cümle {audioState.currentSentenceIndex + 1} / {audioState.totalSentences} (%{progressPercent})
                </span>
              </div>
              
              <div className="flex items-center gap-2 truncate mt-0.5">
                <button
                  onClick={() => {
                    if (audioState.currentCourseId && audioState.currentSubtopicId) {
                      (audioState.mode === 'mutlaka_bil' ? goToMutlakaBil : goToSubtopic)(audioState.currentCourseId, audioState.currentSubtopicId);
                    }
                  }}
                  className="font-bold text-sm text-white hover:text-amber-400 transition truncate text-left cursor-pointer"
                  title="Metne git"
                >
                  {subtopic?.title || 'Konu Başlığı'}
                </button>
                <span className="text-xs text-slate-400 shrink-0">· {course?.title}</span>
              </div>
            </div>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {/* Prev Sentence */}
            <button
              onClick={prevSentence}
              title="Önceki Cümle"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Play/Pause */}
            {audioState.isPaused ? (
              <button
                onClick={resumeAudio}
                title="Devam Et"
                className="p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-full transition transform hover:scale-105 shadow-md shadow-amber-500/30 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            ) : (
              <button
                onClick={pauseAudio}
                title="Duraklat"
                className="p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-full transition transform hover:scale-105 shadow-md shadow-amber-500/30 cursor-pointer"
              >
                <Pause className="w-5 h-5 fill-current" />
              </button>
            )}

            {/* Next Sentence */}
            <button
              onClick={nextSentence}
              title="Sonraki Cümle"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Stop Button */}
            <button
              onClick={stopAudio}
              title="Durdur ve Kapat"
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition cursor-pointer ml-1"
            >
              <Square className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>
          </div>

          {/* Right: Speed Selector & Quick Links */}
          <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
            {/* Speed Badges */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
              <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1" />
              {speedOptions.map(spd => (
                <button
                  key={spd}
                  onClick={() => setAudioSpeed(spd)}
                  className={`px-2 py-0.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                    audioState.speed === spd
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* View Lecture Button */}
            {audioState.currentCourseId && audioState.currentSubtopicId && (
              <button
                onClick={() => (audioState.mode === 'mutlaka_bil' ? goToMutlakaBil : goToSubtopic)(audioState.currentCourseId!, audioState.currentSubtopicId!)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Metni Gör</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
