import React from 'react';
import { useApp } from '../context/AppContext';
import { MUTLAKA_BIL } from '../data/mutlakaBil';
import { Zap, Volume2, Pause, ChevronRight, ArrowLeft, BookOpen, HelpCircle, Headphones } from 'lucide-react';

/**
 * "Mutlaka Bil" (hızlı tekrar): sınavlarda çıkan veya çıkması muhtemel, en çok sorulan noktaların kısa özeti.
 * Tüm konuları kapsamaz. Ders -> alt başlık -> madde listesi; her alt başlık ve ders sesli dinlenebilir.
 */
export const MutlakaBilView: React.FC = () => {
  const {
    courses,
    mbSelection,
    goToMutlakaBil,
    goToSubtopic,
    audioState,
    playMustKnow,
    pauseAudio,
    resumeAudio,
    jumpToSentence
  } = useApp();

  const isMbPlaying = (subtopicId?: string) =>
    audioState.mode === 'mutlaka_bil' &&
    (audioState.isPlaying || audioState.isPaused) &&
    (!subtopicId || audioState.currentSubtopicId === subtopicId);

  // ───────── Alt başlık ayrıntı sayfası ─────────
  if (mbSelection) {
    const course = courses.find(c => c.id === mbSelection.courseId);
    const sub = course?.subtopics.find(s => s.id === mbSelection.subtopicId);
    const items = sub ? MUTLAKA_BIL[sub.id] || [] : [];
    if (course && sub) {
      const siblings = course.subtopics.filter(s => MUTLAKA_BIL[s.id]?.length);
      const pos = siblings.findIndex(s => s.id === sub.id);
      const prev = pos > 0 ? siblings[pos - 1] : null;
      const next = pos >= 0 && pos < siblings.length - 1 ? siblings[pos + 1] : null;
      const playingThis = isMbPlaying(sub.id);
      const activeIdx = playingThis ? audioState.currentSentenceIndex : -1;

      return (
        <div className="space-y-5 pb-24 md:pb-6">
          <button
            onClick={() => goToMutlakaBil()}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Mutlaka Bil listesi
          </button>

          <div className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-800">
              <Zap className="w-4 h-4" /> Mutlaka Bil · Hızlı Tekrar
            </div>
            <p className="mt-1 text-xs text-slate-500">{course.title}</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{sub.title}</h2>
            <p className="mt-2 text-xs text-slate-500">
              Bu alt başlıkta sınavda çıkan veya çıkması muhtemel {items.length} temel nokta var (tüm konuyu kapsamaz).
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {playingThis && !audioState.isPaused ? (
                <button
                  onClick={pauseAudio}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-current" /> Duraklat
                </button>
              ) : playingThis && audioState.isPaused ? (
                <button
                  onClick={resumeAudio}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-sm cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" /> Devam Et
                </button>
              ) : (
                <button
                  onClick={() => playMustKnow(course.id, sub.id, 0, false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" /> Sesli Dinle
                </button>
              )}
              <button
                onClick={() => playMustKnow(course.id, sub.id, 0, true)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-semibold text-sm cursor-pointer"
                title="Bu dersin tüm Mutlaka Bil maddelerini bu alt başlıktan itibaren sırayla dinle"
              >
                <Headphones className="w-4 h-4" /> Dersin devamını dinle
              </button>
              <button
                onClick={() => goToSubtopic(course.id, sub.id, 'lecture')}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-sm cursor-pointer"
              >
                <BookOpen className="w-4 h-4" /> Konu anlatımı
              </button>
              <button
                onClick={() => goToSubtopic(course.id, sub.id, 'test')}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" /> Teste geç
              </button>
            </div>
          </div>

          <ol className="space-y-3">
            {items.map((text, i) => {
              const active = i === activeIdx;
              return (
                <li key={i}>
                  <button
                    onClick={() => (playingThis ? jumpToSentence(i) : playMustKnow(course.id, sub.id, i, false))}
                    title="Bu maddeden itibaren dinle"
                    className={`w-full text-left flex gap-3 rounded-xl border p-4 transition cursor-pointer ${
                      active
                        ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300'
                        : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/40'
                    }`}
                  >
                    <span
                      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black ${
                        active ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-white'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="text-base sm:text-lg leading-relaxed text-slate-800">{text}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="flex items-center justify-between gap-3 pt-2">
            {prev ? (
              <button
                onClick={() => goToMutlakaBil(course.id, prev.id)}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 cursor-pointer text-left"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" /> {prev.title}
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button
                onClick={() => goToMutlakaBil(course.id, next.id)}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 cursor-pointer text-right"
              >
                {next.title} <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            ) : (
              <span />
            )}
          </div>
        </div>
      );
    }
  }

  // ───────── Ders ve alt başlık listesi ─────────
  const total = courses.reduce((n, c) => n + c.subtopics.reduce((m, s) => m + (MUTLAKA_BIL[s.id]?.length || 0), 0), 0);

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-100">
          <Zap className="w-4 h-4" /> Hızlı Tekrar
        </div>
        <h1 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight">Mutlaka Bil</h1>
        <p className="mt-2 text-sm sm:text-base text-amber-50 leading-relaxed max-w-2xl">
          Sınavlarda çıkan veya çıkması muhtemel, en çok sorulan {total} temel nokta; ders ve alt başlıklara göre kısa
          özetler halinde. Tüm konuları kapsamaz, hızlı tekrar içindir. Her alt başlığı ve dersin tamamını sesli
          dinleyebilirsin.
        </p>
      </div>

      {courses.map(course => {
        const subs = course.subtopics.filter(s => MUTLAKA_BIL[s.id]?.length);
        if (subs.length === 0) return null;
        const count = subs.reduce((n, s) => n + MUTLAKA_BIL[s.id].length, 0);
        const courseTitleHere = isMbPlaying() && audioState.currentCourseId === course.id;
        return (
          <section key={course.id} className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">{course.title}</h3>
                <p className="text-xs text-slate-500">
                  {subs.length} alt başlık · {count} madde
                </p>
              </div>
              <button
                onClick={() => playMustKnow(course.id, subs[0].id, 0, true)}
                className={`self-start flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${
                  courseTitleHere ? 'bg-amber-500 text-slate-950' : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                <Headphones className="w-4 h-4" /> Dersin Tümünü Dinle
              </button>
            </div>
            <div className="p-3 sm:p-4 grid grid-cols-1 gap-2">
              {subs.map(s => {
                const playing = isMbPlaying(s.id);
                return (
                  <div
                    key={s.id}
                    className={`flex items-center justify-between gap-2 rounded-lg border p-2.5 sm:p-3 ${
                      playing ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300' : 'bg-white border-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => goToMutlakaBil(course.id, s.id)}
                      className="flex-1 min-w-0 text-left cursor-pointer"
                    >
                      <span className="block text-sm font-semibold text-slate-800 leading-snug break-words">{s.title}</span>
                      <span className="mt-1 inline-block text-[11px] font-mono font-bold text-slate-600 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                        {MUTLAKA_BIL[s.id].length} madde
                      </span>
                    </button>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => (playing && !audioState.isPaused ? pauseAudio() : playing ? resumeAudio() : playMustKnow(course.id, s.id, 0, false))}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200 cursor-pointer"
                      >
                        {playing && !audioState.isPaused ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{playing && !audioState.isPaused ? 'Duraklat' : 'Dinle'}</span>
                      </button>
                      <button
                        onClick={() => goToMutlakaBil(course.id, s.id)}
                        aria-label="Maddeleri aç"
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};
