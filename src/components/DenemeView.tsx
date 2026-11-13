import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLimits } from '../hooks/useLimits';
import { Question } from '../types';
import { Timer, ClipboardList, ChevronLeft, ChevronRight, Flag, CheckCircle2, XCircle, RotateCcw, Play } from 'lucide-react';

/**
 * Süreli deneme sınavı: tüm derslerden (veya seçilen dersten) rastgele soru seçer,
 * süre tutar, bitince ders bazında sonuç ve yanlışların açıklamasını gösterir.
 * Yanlış/doğru sonuçlar mevcut "Eksiklerim" sistemine işlenir.
 */

const HISTORY_KEY = 'trp_deneme_history_v1';
const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const COUNTS = [20, 50, 100];

interface ExamQ extends Question {
  courseTitle: string;
}
interface HistoryItem {
  ts: number;
  scope: string;
  total: number;
  correct: number;
  wrong: number;
  blank: number;
  seconds: number;
}

const shuffle = <T,>(arr: T[]): T[] => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

const loadHistory = (): HistoryItem[] => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
};

export const DenemeView: React.FC = () => {
  const { courses, answerQuestion } = useApp();
  const [phase, setPhase] = useState<'setup' | 'exam' | 'result'>('setup');
  const [scope, setScope] = useState<string>('all');
  const [count, setCount] = useState<number>(50);
  const [qs, setQs] = useState<ExamQ[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [idx, setIdx] = useState(0);
  const [endAt, setEndAt] = useState(0);
  const [startAt, setStartAt] = useState(0);
  const [left, setLeft] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory);
  const [reviewFilter, setReviewFilter] = useState<'wrong' | 'all'>('wrong');
  const finished = useRef(false);

  const pool = useMemo<ExamQ[]>(() => {
    const out: ExamQ[] = [];
    for (const c of courses) {
      if (scope !== 'all' && c.id !== scope) continue;
      for (const s of c.subtopics) for (const q of s.questions) out.push({ ...q, courseTitle: c.title });
    }
    return out;
  }, [courses, scope]);

  const { limits } = useLimits();
  const nowD = new Date();
  const examsThisMonth = history.filter(h => {
    const d = new Date(h.ts);
    return d.getMonth() === nowD.getMonth() && d.getFullYear() === nowD.getFullYear();
  }).length;
  const examBlocked = examsThisMonth >= limits.monthlyExams;
  const effCount = Math.min(count, limits.examMaxQuestions);
  const minutes = Math.round(Math.min(effCount, pool.length) * 1.2);

  const start = () => {
    if (examBlocked) return;
    const picked = shuffle(pool).slice(0, Math.min(effCount, pool.length));
    const now = Date.now();
    finished.current = false;
    setQs(picked);
    setAnswers({});
    setMarked({});
    setIdx(0);
    setStartAt(now);
    setEndAt(now + Math.round(picked.length * 1.2) * 60000);
    setLeft(Math.round(picked.length * 1.2) * 60);
    setPhase('exam');
    window.scrollTo({ top: 0 });
  };

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    const secs = Math.min(Math.round((Date.now() - startAt) / 1000), Math.round(qs.length * 1.2) * 60);
    setElapsed(secs);
    let correct = 0;
    let wrong = 0;
    for (const q of qs) {
      const a = answers[q.id];
      if (a === undefined) continue;
      const ok = a === q.correctIndex;
      if (ok) correct++;
      else wrong++;
      answerQuestion(q.id, a, ok, q.subtopicId);
    }
    const item: HistoryItem = {
      ts: Date.now(),
      scope: scope === 'all' ? 'Tüm dersler' : courses.find(c => c.id === scope)?.title || scope,
      total: qs.length,
      correct,
      wrong,
      blank: qs.length - correct - wrong,
      seconds: secs
    };
    const next = [item, ...history].slice(0, 20);
    setHistory(next);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      /* depolama kapalı olabilir */
    }
    setPhase('result');
    window.scrollTo({ top: 0 });
  };

  // Geri sayım
  useEffect(() => {
    if (phase !== 'exam') return;
    const t = setInterval(() => {
      const l = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      setLeft(l);
      if (l <= 0) finish();
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, endAt, answers, qs]);

  // ───────── Kurulum ─────────
  if (phase === 'setup') {
    return (
      <div className="space-y-6 pb-24 md:pb-6">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-slate-800 text-white p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-indigo-200">
            <ClipboardList className="w-4 h-4" /> Sınav Simülasyonu
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight">Deneme Sınavı</h1>
          <p className="mt-2 text-sm sm:text-base text-indigo-100 leading-relaxed max-w-2xl">
            Süreli, rastgele seçilmiş sorularla kendini sına. Bitince ders bazında sonucunu ve yanlışlarının açıklamasını
            göreceksin; yanlışların “Eksiklerim” bölümüne de eklenir.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
          <div>
            <div className="text-sm font-bold text-slate-800 mb-2">Kapsam</div>
            <select
              value={scope}
              onChange={e => setScope(e.target.value)}
              className="w-full sm:w-auto rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="all">Tüm dersler (karma)</option>
              {courses
                .filter(c => c.subtopics.some(s => s.questions.length))
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800 mb-2">Soru sayısı</div>
            <div className="flex flex-wrap gap-2">
              {COUNTS.map(n => (
                <button
                  key={n}
                  onClick={() => n <= limits.examMaxQuestions && setCount(n)}
                  title={n > limits.examMaxQuestions ? 'Premium üyelere açık' : undefined}
                  className={`px-4 py-2 rounded-lg text-sm font-bold border cursor-pointer ${
                    n > limits.examMaxQuestions ? 'opacity-40' : ''
                  } ${
                    effCount === n
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Süre: {minutes} dakika (soru başına ortalama 1,2 dk). Bu gerçek sınav süresi değil, çalışma simülasyonudur.
              Seçilen kapsamda {pool.length} soru var.
            </p>
          </div>
          <button
            onClick={start}
            disabled={pool.length === 0 || examBlocked}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" /> Sınavı Başlat
          </button>
          {examBlocked && (
            <p className="text-sm text-amber-700">
              Bu ay için deneme hakkın doldu. Sınırsız deneme Premium üyelere açıktır.
            </p>
          )}
        </div>

        {history.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm font-bold text-slate-800 mb-3">Son denemelerin</div>
            <ul className="divide-y divide-slate-100">
              {history.slice(0, 8).map(h => (
                <li key={h.ts} className="py-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-slate-700">
                    {new Date(h.ts).toLocaleDateString('tr-TR')} · {h.scope} · {h.total} soru
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {h.correct} D / {h.wrong} Y / {h.blank} B · %{Math.round((h.correct / h.total) * 100)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // ───────── Sınav ─────────
  if (phase === 'exam') {
    const q = qs[idx];
    const answeredCount = Object.keys(answers).length;
    const low = left <= 300;
    return (
      <div className="space-y-4 pb-24 md:pb-6">
        <div className="sticky top-16 z-30 -mx-4 px-4 py-2.5 bg-white/95 backdrop-blur border-b border-slate-200 flex items-center justify-between gap-2">
          <div className="text-sm font-bold text-slate-800">
            Soru {idx + 1}/{qs.length}
            <span className="ml-2 text-xs font-medium text-slate-500">({answeredCount} işaretlendi)</span>
          </div>
          <div
            className={`flex items-center gap-1.5 font-mono font-black text-lg ${low ? 'text-rose-600' : 'text-slate-900'}`}
          >
            <Timer className="w-4 h-4" /> {fmt(left)}
          </div>
          <button
            onClick={() => {
              const blank = qs.length - answeredCount;
              if (blank === 0 || confirm(`${blank} soru boş. Sınavı bitirmek istiyor musun?`)) finish();
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-bold cursor-pointer"
          >
            Bitir
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{q.courseTitle}</div>
          <p className="mt-2 text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">{q.questionText}</p>
          <div className="mt-4 space-y-2">
            {q.options.map((opt, i) => {
              const sel = answers[q.id] === i;
              return (
                <button
                  key={i}
                  onClick={() => setAnswers(a => (a[q.id] === i ? (({ [q.id]: _, ...rest }) => rest)(a) : { ...a, [q.id]: i }))}
                  className={`w-full text-left flex gap-3 rounded-xl border p-3 transition cursor-pointer ${
                    sel ? 'bg-indigo-50 border-indigo-400 ring-1 ring-indigo-300' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black ${
                      sel ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {LETTERS[i]}
                  </span>
                  <span className="text-sm sm:text-base text-slate-800 leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-slate-400">Seçili şıkka tekrar dokunursan işaret kalkar (boş bırakırsın).</p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              onClick={() => setIdx(i => Math.max(0, i - 1))}
              disabled={idx === 0}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold cursor-pointer disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Önceki
            </button>
            <button
              onClick={() => setMarked(m => ({ ...m, [q.id]: !m[q.id] }))}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-semibold cursor-pointer ${
                marked[q.id] ? 'bg-amber-100 border-amber-400 text-amber-900' : 'border-slate-300 text-slate-600'
              }`}
            >
              <Flag className="w-4 h-4" /> {marked[q.id] ? 'İşaretli' : 'Sonra bak'}
            </button>
            <button
              onClick={() => setIdx(i => Math.min(qs.length - 1, i + 1))}
              disabled={idx === qs.length - 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold cursor-pointer disabled:opacity-40"
            >
              Sonraki <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
            {qs.map((x, i) => (
              <button
                key={x.id}
                onClick={() => setIdx(i)}
                className={`h-8 rounded text-xs font-bold cursor-pointer border ${
                  i === idx
                    ? 'bg-slate-900 text-white border-slate-900'
                    : marked[x.id]
                    ? 'bg-amber-100 border-amber-400 text-amber-900'
                    : answers[x.id] !== undefined
                    ? 'bg-indigo-100 border-indigo-300 text-indigo-900'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ───────── Sonuç ─────────
  const correct = qs.filter(q => answers[q.id] === q.correctIndex).length;
  const wrongList = qs.filter(q => answers[q.id] !== undefined && answers[q.id] !== q.correctIndex);
  const blankList = qs.filter(q => answers[q.id] === undefined);
  const pct = Math.round((correct / qs.length) * 100);
  const byCourse: Record<string, { t: number; c: number }> = {};
  for (const q of qs) {
    byCourse[q.courseTitle] ||= { t: 0, c: 0 };
    byCourse[q.courseTitle].t++;
    if (answers[q.id] === q.correctIndex) byCourse[q.courseTitle].c++;
  }
  const reviewList = reviewFilter === 'wrong' ? [...wrongList, ...blankList] : qs;

  return (
    <div className="space-y-5 pb-24 md:pb-6">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-slate-800 text-white p-6 sm:p-8">
        <div className="text-xs font-black uppercase tracking-wide text-indigo-200">Sonuç</div>
        <div className="mt-1 text-5xl font-black">%{pct}</div>
        <p className="mt-2 text-sm text-indigo-100">
          {correct} doğru · {wrongList.length} yanlış · {blankList.length} boş · süre {fmt(elapsed)}
        </p>
        <button
          onClick={() => setPhase('setup')}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-800 font-bold text-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Yeni deneme
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="text-sm font-bold text-slate-800 mb-3">Ders bazında</div>
        <ul className="space-y-2">
          {Object.entries(byCourse).map(([name, v]) => {
            const p = Math.round((v.c / v.t) * 100);
            return (
              <li key={name}>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">{name}</span>
                  <span className="font-mono font-bold">
                    {v.c}/{v.t} · %{p}
                  </span>
                </div>
                <div className="h-2 rounded bg-slate-100 overflow-hidden">
                  <div
                    className={`h-2 ${p >= 70 ? 'bg-emerald-500' : p >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${p}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex gap-2">
        {(['wrong', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => setReviewFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border cursor-pointer ${
              reviewFilter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            {f === 'wrong' ? `Yanlış ve boşlar (${wrongList.length + blankList.length})` : `Tüm sorular (${qs.length})`}
          </button>
        ))}
      </div>

      <ol className="space-y-3">
        {reviewList.map(q => {
          const a = answers[q.id];
          const ok = a === q.correctIndex;
          return (
            <li key={q.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-2">
                {ok ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase text-slate-400">{q.courseTitle}</div>
                  <p className="text-sm sm:text-base font-semibold text-slate-900">{q.questionText}</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {q.options.map((o, i) => (
                      <li
                        key={i}
                        className={
                          i === q.correctIndex
                            ? 'text-emerald-800 font-semibold'
                            : i === a
                            ? 'text-rose-700 line-through'
                            : 'text-slate-600'
                        }
                      >
                        {LETTERS[i]}) {o}
                      </li>
                    ))}
                  </ul>
                  {a === undefined && <p className="mt-1 text-xs text-slate-500">Boş bıraktın.</p>}
                  {q.explanation && <p className="mt-2 text-sm text-slate-700 bg-slate-50 rounded-lg p-2">{q.explanation}</p>}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
