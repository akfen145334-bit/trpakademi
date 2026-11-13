import React, { useEffect, useRef } from 'react';
import { Subtopic, Course, Sentence } from '../types';
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

type Block = { type: 'h' | 'p' | 'ul' | 'ol' | 'table' | 'def'; items: Sentence[]; idx: number[] };

const renderInline = (t: string) =>
  t.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
      <strong key={i} className="font-extrabold text-black">{part.slice(2, -2)}</strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );

const buildBlocks = (sentences: Sentence[]): Block[] => {
  const blocks: Block[] = [];
  sentences.forEach((s, idx) => {
    const kind = s.kind || (s.isHeading ? 'h3' : s.isTable ? 'tr' : 'p');
    const last = blocks[blocks.length - 1];
    if (kind === 'h2' || kind === 'h3') blocks.push({ type: 'h', items: [s], idx: [idx] });
    else if (kind === 'def') blocks.push({ type: 'def', items: [s], idx: [idx] });
    else if (kind === 'li') {
      const t = s.n ? 'ol' : 'ul';
      if (last && last.type === t) { last.items.push(s); last.idx.push(idx); }
      else blocks.push({ type: t, items: [s], idx: [idx] });
    } else if (kind === 'tr') {
      if (last && last.type === 'table') { last.items.push(s); last.idx.push(idx); }
      else blocks.push({ type: 'table', items: [s], idx: [idx] });
    } else {
      if (last && last.type === 'p' && last.items[0].para === s.para) { last.items.push(s); last.idx.push(idx); }
      else blocks.push({ type: 'p', items: [s], idx: [idx] });
    }
  });
  return blocks;
};
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

  const blocks = React.useMemo(() => buildBlocks(subtopic.sentences), [subtopic.sentences]);

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
      <div className="sm:sticky sm:top-20 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200/90 p-4 shadow-sm">
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
      <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs text-slate-800 text-base sm:text-lg leading-8 select-text">
        <div className="max-w-none space-y-5">
          {blocks.map((blk, bi) => {
            const sp = (s: Sentence, idx: number, extra = '') => {
              const hl = idx === activeSentenceIndex;
              return (
                <span
                  key={s.id}
                  ref={hl ? activeSentenceRef : null}
                  onClick={() => jumpToSentence(idx)}
                  title="Bu cümleden itibaren dinle"
                  className={`cursor-pointer transition-colors duration-150 rounded px-0.5 ${extra} ${
                    hl ? 'bg-amber-200 text-slate-950 ring-2 ring-amber-300' : 'hover:bg-amber-50'
                  }`}
                >
                  {renderInline(s.text)}{' '}
                </span>
              );
            };
            if (blk.type === 'h') {
              const s = blk.items[0];
              const hl = blk.idx[0] === activeSentenceIndex;
              return s.kind === 'h2' ? (
                <h2 key={bi} ref={hl ? activeSentenceRef : null} onClick={() => jumpToSentence(blk.idx[0])}
                  className={`mt-10 mb-2 pb-2 border-b-2 border-amber-300 text-2xl sm:text-3xl font-black tracking-tight text-slate-950 cursor-pointer ${hl ? 'bg-amber-200 px-2 rounded' : ''}`}>
                  {s.text}
                </h2>
              ) : (
                <h3 key={bi} ref={hl ? activeSentenceRef : null} onClick={() => jumpToSentence(blk.idx[0])}
                  className={`mt-8 mb-1 text-xl sm:text-2xl font-extrabold text-amber-800 cursor-pointer ${hl ? 'bg-amber-200 px-2 rounded' : ''}`}>
                  {s.text}
                </h3>
              );
            }
            if (blk.type === 'p') {
              return (
                <p key={bi} className="text-justify hyphens-auto">
                  {blk.items.map((s, k) => sp(s, blk.idx[k]))}
                </p>
              );
            }
            if (blk.type === 'ul') {
              return (
                <ul key={bi} className="space-y-2.5 pl-1">
                  {blk.items.map((s, k) => (
                    <li key={s.id} className="flex gap-3">
                      <span className="mt-2.5 w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span>{sp(s, blk.idx[k])}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            if (blk.type === 'ol') {
              return (
                <ol key={bi} className="space-y-2.5">
                  {blk.items.map((s, k) => (
                    <li key={s.id} className="flex gap-3">
                      <span className="font-black text-amber-700 shrink-0 w-6 text-right">{s.n}.</span>
                      <span>{sp(s, blk.idx[k])}</span>
                    </li>
                  ))}
                </ol>
              );
            }
            if (blk.type === 'table') {
              return (
                <div key={bi} className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm sm:text-base border-collapse">
                    <tbody>
                      {blk.items.map((s, k) => (
                        <tr key={s.id} onClick={() => jumpToSentence(blk.idx[k])}
                          ref={blk.idx[k] === activeSentenceIndex ? activeSentenceRef : null}
                          className={`cursor-pointer ${s.th ? 'bg-slate-100 font-bold' : blk.idx[k] === activeSentenceIndex ? 'bg-amber-100' : 'odd:bg-white even:bg-slate-50/60 hover:bg-amber-50/60'}`}>
                          {(s.cells || []).map((cell, ci) => (
                            <td key={ci} className="border border-slate-200 px-3 py-2 align-top">{renderInline(cell)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            // definition callout
            const s = blk.items[0];
            return (
              <div key={bi} className="rounded-xl border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-base">
                <span className="text-xs font-black uppercase tracking-wide text-amber-800 mr-2">📌 Kavram</span>
                {sp(s, blk.idx[0])}
              </div>
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
