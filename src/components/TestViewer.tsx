import React, { useState, useEffect, useMemo } from 'react';
import { Subtopic, Course, Question } from '../types';
import { useApp } from '../context/AppContext';
import { ReportQuestionButton } from './ReportQuestionButton';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Play,
  AlertCircle,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TestViewerProps {
  course: Course;
  subtopic: Subtopic;
  onSwitchToLecture: () => void;
}

type PartFilter = 'all' | 'mb' | 'konu';
type DiffFilter = 'all' | 0 | 1 | 2;
const DIFF_LABEL = ['Kolay', 'Orta', 'Zor'];

export const TestViewer: React.FC<TestViewerProps> = ({ course, subtopic, onSwitchToLecture }) => {
  const {
    userStats,
    answerQuestion,
    goToEksiklerim,
    questionsLoading,
    loadedCourseIds,
    ensureCourseQuestions,
    toggleRepeat,
    setQuestionDifficulty,
    effectiveDifficulty,
    testPreset,
    setTestPreset
  } = useApp();

  const questions = subtopic.questions;
  const courseLoaded = loadedCourseIds.includes(course.id);

  // kurulum
  const [started, setStarted] = useState(false);
  const [part, setPart] = useState<PartFilter>('all');
  const [diff, setDiff] = useState<DiffFilter>('all');
  const [showSolved, setShowSolved] = useState(false);
  // oturum
  const [sessionIds, setSessionIds] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [sessAnswers, setSessAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    ensureCourseQuestions(course.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id]);

  useEffect(() => {
    setStarted(false);
    setSessionIds([]);
    setSessAnswers({});
    setIdx(0);
    setDiff('all');
    setShowSolved(false);
    if (testPreset?.part) {
      setPart(testPreset.part);
      setTestPreset(null);
    } else {
      setPart('all');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtopic.id]);

  const byId = useMemo(() => new Map(questions.map(q => [q.id, q])), [questions]);

  /** Bu soru, "çözülenleri gösterme" kapalıyken karşıma çıkar mı? */
  const isDue = (q: Question) => {
    const solved = userStats.solvedQuestions[q.id] !== undefined;
    if (!solved) return true;
    if (userStats.wrongQuestionIds.includes(q.id)) return true;
    return !!userStats.marks?.[q.id]?.r;
  };

  const pool = useMemo(
    () =>
      questions.filter(q => {
        if (part !== 'all' && q.part !== part) return false;
        if (diff !== 'all' && effectiveDifficulty(q) !== diff) return false;
        return showSolved || isDue(q);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, part, diff, showSolved, userStats.solvedQuestions, userStats.wrongQuestionIds, userStats.marks]
  );

  const mbCount = questions.filter(q => q.part === 'mb').length;

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto">
        {questionsLoading && !courseLoaded ? (
          <>
            <Loader2 className="w-10 h-10 text-amber-500 mx-auto mb-3 animate-spin" />
            <h3 className="text-lg font-bold text-slate-800">Sorular yükleniyor…</h3>
          </>
        ) : (
          <>
            <HelpCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">Bu alt konu için sorular hazırlanıyor</h3>
            <p className="text-sm text-slate-500 mt-2">Yeni soru havuzu bu konuya eklendikçe burada listelenecek.</p>
          </>
        )}
        <button
          onClick={onSwitchToLecture}
          className="mt-6 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-xl transition cursor-pointer"
        >
          Konu Anlatımına Geri Dön
        </button>
      </div>
    );
  }

  const startTest = () => {
    // karışık sıra yerine konu içindeki sıra korunur; çözülmeyenler önce
    const ids = pool.map(q => q.id);
    setSessionIds(ids);
    setSessAnswers({});
    setIdx(0);
    setStarted(true);
  };

  // ───────── Kurulum ekranı ─────────
  if (!started) {
    const totalSolved = questions.filter(q => userStats.solvedQuestions[q.id] !== undefined).length;
    const chip = (active: boolean) =>
      `px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
        active ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`;
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl mx-auto space-y-5">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">{subtopic.title} — Test</h3>
          <p className="text-xs text-slate-500 mt-1">
            Bu konuda {questions.length} soru var, {totalSolved} tanesini çözdün. Doğru bildiklerin, “Tekrar çöz”
            demedikçe karşına çıkmaz.
          </p>
        </div>

        {mbCount > 0 && (
          <div>
            <div className="text-xs font-bold text-slate-600 mb-2">Soru türü</div>
            <div className="flex flex-wrap gap-2">
              <button className={chip(part === 'all')} onClick={() => setPart('all')}>Hepsi ({questions.length})</button>
              <button className={chip(part === 'mb')} onClick={() => setPart('mb')}>Mutlaka Bil soruları ({mbCount})</button>
              <button className={chip(part === 'konu')} onClick={() => setPart('konu')}>Konu soruları ({questions.length - mbCount})</button>
            </div>
          </div>
        )}

        <div>
          <div className="text-xs font-bold text-slate-600 mb-2">Zorluk (senin işaretlerine göre)</div>
          <div className="flex flex-wrap gap-2">
            <button className={chip(diff === 'all')} onClick={() => setDiff('all')}>Hepsi</button>
            {[0, 1, 2].map(d => (
              <button key={d} className={chip(diff === d)} onClick={() => setDiff(d as 0 | 1 | 2)}>
                {DIFF_LABEL[d]}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
          <input type="checkbox" checked={showSolved} onChange={e => setShowSolved(e.target.checked)} className="w-4 h-4 accent-amber-600" />
          Çözdüklerimi de göster
        </label>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <span className="text-sm font-semibold text-slate-700">
            Bu ayarla <span className="text-amber-700">{pool.length}</span> soru çıkacak
          </span>
          <div className="flex gap-2">
            <button onClick={onSwitchToLecture} className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <BookOpen className="w-3.5 h-3.5" /> Konuya Dön
            </button>
            <button
              onClick={startTest}
              disabled={pool.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white cursor-pointer"
            >
              <Play className="w-4 h-4" /> Teste başla
            </button>
          </div>
        </div>
        {pool.length === 0 && (
          <p className="text-xs text-slate-500">
            Bu ayara uyan, çözülmemiş soru kalmadı. “Çözdüklerimi de göster”i işaretleyebilir veya başka bir zorluk seçebilirsin.
          </p>
        )}
      </div>
    );
  }

  // ───────── Test ekranı ─────────
  const list = sessionIds.map(id => byId.get(id)).filter((q): q is Question => !!q);
  const finished = idx >= list.length;
  const answeredN = Object.keys(sessAnswers).length;
  const correctN = list.filter(q => sessAnswers[q.id] === q.correctIndex).length;

  if (finished) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900">Test bitti</h3>
        <p className="text-sm text-slate-600">
          {answeredN} soruyu cevapladın, {correctN} doğru. Yanlışların ve “Tekrar çöz” dediklerin Eksiklerim’e eklendi.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <button onClick={() => setStarted(false)} className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white cursor-pointer">Yeni test</button>
          <button onClick={goToEksiklerim} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer">Eksiklerim</button>
          <button onClick={onSwitchToLecture} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">Konuya Dön</button>
        </div>
      </div>
    );
  }

  const currentQ = list[idx];
  const sel = sessAnswers[currentQ.id];
  const isAnswered = sel !== undefined;
  const isCorrect = isAnswered && sel === currentQ.correctIndex;
  const mark = userStats.marks?.[currentQ.id];
  const curDiff = effectiveDifficulty(currentQ);

  const handleSelect = (o: number) => {
    if (isAnswered) return;
    const correct = o === currentQ.correctIndex;
    setSessAnswers(p => ({ ...p, [currentQ.id]: o }));
    answerQuestion(currentQ.id, o, correct, subtopic.id);
    if (correct && idx === list.length - 1) {
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      } catch {
        /* yoksay */
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">Test</span>
              <span className="text-xs text-slate-500 font-mono">Soru {idx + 1} / {list.length}</span>
              {currentQ.part === 'mb' && (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">Mutlaka Bil</span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">{subtopic.title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> {correctN} Doğru
            </span>
            <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
              <XCircle className="w-3.5 h-3.5" /> {answeredN - correctN} Yanlış
            </span>
            <button onClick={() => setStarted(false)} className="text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg border border-slate-200 cursor-pointer">Ayarlar</button>
            <button onClick={onSwitchToLecture} className="flex items-center gap-1 text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg border border-slate-200 cursor-pointer">
              <BookOpen className="w-3.5 h-3.5" /> Konuya Dön
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mt-3 max-h-24 sm:max-h-36 overflow-y-auto p-1">
          {list.map((q, i) => {
            const s = sessAnswers[q.id];
            return (
              <button
                key={q.id}
                onClick={() => setIdx(i)}
                className={`w-8 h-8 rounded-lg font-mono text-xs font-bold flex items-center justify-center cursor-pointer ${
                  i === idx ? 'ring-2 ring-amber-500 ring-offset-1' : ''
                } ${s === undefined ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : s === q.correctIndex ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed select-none">{currentQ.questionText}</p>
        </div>

        <div className="mt-6 space-y-3">
          {currentQ.options.map((optText, o) => {
            let st = 'idle';
            if (isAnswered) st = o === currentQ.correctIndex ? 'correct' : o === sel ? 'wrong' : 'disabled';
            return (
              <button
                key={o}
                onClick={() => handleSelect(o)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                  st === 'idle'
                    ? 'bg-slate-50/60 border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 text-slate-800'
                    : st === 'correct'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400 font-semibold'
                    : st === 'wrong'
                    ? 'bg-rose-50 border-rose-400 text-rose-950 ring-1 ring-rose-400 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-mono mt-0.5 ${
                  st === 'correct' ? 'bg-emerald-600 text-white' : st === 'wrong' ? 'bg-rose-600 text-white' : 'bg-white border border-slate-300 text-slate-600'
                }`}>
                  {String.fromCharCode(65 + o)}
                </div>
                <div className="flex-1 text-sm sm:text-base select-none">{optText.replace(/^[A-E]\)\s*/, '')}</div>
                {st === 'correct' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
                {st === 'wrong' && <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`mt-6 p-5 rounded-xl border ${isCorrect ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900' : 'bg-rose-50/90 border-rose-300 text-rose-900'}`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-extrabold text-sm sm:text-base">Doğru cevap</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span className="font-extrabold text-sm sm:text-base">Yanlış cevap (Eksiklerim’e eklendi)</span>
                </>
              )}
            </div>
            <div className="text-xs sm:text-sm leading-relaxed mt-2 pt-2 border-t border-slate-200/60 whitespace-pre-line">
              <span className="font-bold underline mr-1">Çözüm Açıklaması:</span>
              {currentQ.explanation}
            </div>
            <ReportQuestionButton question={currentQ} />
          </div>
        )}

        {/* Soru işaretleri: Tekrar çöz / Kolay / Orta / Zor */}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => toggleRepeat(currentQ.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold border transition cursor-pointer ${
              mark?.r ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            title="İşaretlersen bu soru Eksiklerim’e eklenir ve tekrar karşına çıkar"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Tekrar çöz
          </button>
          <span className="text-slate-400 mx-1">|</span>
          {DIFF_LABEL.map((lab, d) => {
            const active = mark?.d === d;
            return (
              <button
                key={d}
                onClick={() => setQuestionDifficulty(currentQ.id, d as 0 | 1 | 2)}
                className={`px-3 py-1.5 rounded-lg font-bold border transition cursor-pointer ${
                  active ? 'bg-slate-900 text-white border-slate-900' : !mark?.d && mark?.d !== 0 && curDiff === d ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {lab}
              </button>
            );
          })}
          <span className="text-[10px] text-slate-400">(zorluk senin işaretin; gri = hazır sınıflandırma)</span>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={() => setIdx(Math.max(0, idx - 1))}
            disabled={idx === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold ${idx === 0 ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'}`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Önceki
          </button>
          <button
            onClick={() => setIdx(idx + 1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white cursor-pointer"
          >
            {idx < list.length - 1 ? (
              <>
                Sonraki <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Bitir <AlertCircle className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
