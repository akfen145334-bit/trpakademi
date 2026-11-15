import React, { useState } from 'react';
import { useApp, EksikCourse, EksikSubtopic } from '../context/AppContext';
import { useLimits } from '../hooks/useLimits';
import { exportEksiklerimTeaserPdf, eksiklerimPageEstimate } from '../services/pdfExport';
import { EKSIKLERIM_BOOK_PRICE_TEXT } from '../config/plans';
import {
  Headphones,
  Copy,
  Check,
  FileDown,
  Lock,
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Loader2,
  Trash2,
  Square
} from 'lucide-react';

const subtopicText = (s: EksikSubtopic) =>
  `${s.subtopic.title}\n` + s.items.map((it, i) => `${i + 1}. ${it.text}`).join('\n');
const courseText = (c: EksikCourse) =>
  `${c.course.title}\n\n` + c.subtopics.map(subtopicText).join('\n\n');

export const EksiklerimView: React.FC = () => {
  const {
    eksiklerim,
    questionsLoading,
    userStats,
    audioState,
    playEksiklerimCourse,
    stopAudio,
    goToSubtopic,
    goToHome,
    toggleRepeat,
    resetWrongQuestion,
    courses
  } = useApp();
  const { limits } = useLimits();

  const [tab, setTab] = useState<'bilgi' | 'sorular'>('bilgi');
  const [openCourse, setOpenCourse] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const totalInfo = eksiklerim.reduce((n, c) => n + c.itemCount, 0);
  const totalQ = eksiklerim.reduce((n, c) => n + c.questionCount, 0);
  const pages = eksiklerimPageEstimate(totalInfo);

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(c => (c === key ? null : c)), 1800);
    } catch {
      setMsg('Kopyalanamadı; metni elle seçip kopyalayabilirsin.');
    }
  };

  const listen = (courseId: string, subtopicId?: string) => {
    if (!limits.eksiklerimAudio) {
      setMsg('Bu özellik Premium üyelere açıktır.');
      return;
    }
    setMsg('');
    playEksiklerimCourse(courseId, subtopicId);
  };

  const playing = audioState.isPlaying && audioState.mode === 'eksiklerim';

  const teaser = () => {
    const ok = exportEksiklerimTeaserPdf(
      eksiklerim.map(c => ({
        course: c.course.title,
        subtopics: c.subtopics.map(s => ({ title: s.subtopic.title, infoCount: s.items.length }))
      })),
      EKSIKLERIM_BOOK_PRICE_TEXT
    );
    setMsg(ok ? '' : 'Açılır pencere engellendi; bu siteye izin verip tekrar dene.');
  };

  // Sorularım sekmesi: yanlış veya "tekrar çöz" işaretli sorular
  const marked = new Set(Object.keys(userStats.marks || {}).filter(id => userStats.marks![id].r));
  const wrong = new Set(userStats.wrongQuestionIds);
  const qList = courses.flatMap(c =>
    c.subtopics.flatMap(s =>
      s.questions.filter(q => wrong.has(q.id) || marked.has(q.id)).map(q => ({ q, s, c }))
    )
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Eksiklerim</h1>
        <p className="text-sm text-rose-100/90 mt-2 max-w-2xl leading-relaxed">
          Yanlış yaptığın ve “Tekrar çöz” dediğin soruları çözmek için gereken bilgiler, konu anlatımındaki sıraya göre ve
          tekrarsız burada toplanır. Ders ders okuyabilir, dinleyebilir, kopyalayıp Word’e yapıştırabilirsin.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-black/20 p-3 rounded-xl border border-white/10">
            <div className="text-xs text-rose-200">Eksik bilgi</div>
            <div className="text-2xl font-black font-mono">{totalInfo}</div>
          </div>
          <div className="bg-black/20 p-3 rounded-xl border border-white/10">
            <div className="text-xs text-rose-200">Tekrar edilecek soru</div>
            <div className="text-2xl font-black font-mono">{totalQ}</div>
          </div>
        </div>
        {playing && (
          <button onClick={stopAudio} className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 cursor-pointer">
            <Square className="w-3.5 h-3.5" /> Dinlemeyi durdur
          </button>
        )}
        {msg && <p className="text-xs text-amber-200 font-bold mt-3">{msg}</p>}
      </div>

      {/* Ücretli kitap */}
      <div className="bg-white rounded-2xl border border-amber-300 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileDown className="w-5 h-5 text-amber-600" /> Tüm eksiklerimden PDF kitap
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1"><Lock className="w-3 h-3" /> Ücretli</span>
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {totalInfo === 0 ? 'Henüz eksik bilgin yok.' : <>Kitap yaklaşık <b>{pages} sayfa</b>, <b>{totalInfo} bilgi</b> içerir.</>}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              İlk sayfayı (konular ve eksik bilgi sayıları) ücretsiz görebilirsin. Tamamını PDF indirmek için{' '}
              <b>{EKSIKLERIM_BOOK_PRICE_TEXT}</b> ücreti yatırınız.
            </p>
          </div>
          <button
            onClick={teaser}
            disabled={totalInfo === 0}
            className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white cursor-pointer"
          >
            1. sayfayı gör
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button onClick={() => setTab('bilgi')} className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${tab === 'bilgi' ? 'bg-rose-50 text-rose-900 border border-rose-200' : 'text-slate-600 hover:bg-slate-100'}`}>
          Eksik bilgilerim ({totalInfo})
        </button>
        <button onClick={() => setTab('sorular')} className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${tab === 'sorular' ? 'bg-rose-50 text-rose-900 border border-rose-200' : 'text-slate-600 hover:bg-slate-100'}`}>
          Sorularım ({qList.length})
        </button>
      </div>

      {tab === 'bilgi' &&
        (eksiklerim.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            {questionsLoading ? (
              <Loader2 className="w-10 h-10 text-amber-500 mx-auto animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-extrabold text-slate-800">Eksik bilgin yok</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                  Testlerde yanlış yaptığın ya da “Tekrar çöz” dediğin sorular olunca, gereken bilgiler burada ders ders birikir.
                </p>
                <button onClick={goToHome} className="mt-5 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl cursor-pointer">Dersleri incele</button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {eksiklerim.map(ec => {
              const open = openCourse === ec.course.id;
              return (
                <div key={ec.course.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <button onClick={() => setOpenCourse(open ? null : ec.course.id)} className="flex items-center gap-2 text-left cursor-pointer">
                      {open ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      <span>
                        <span className="block font-extrabold text-slate-900">{ec.course.title}</span>
                        <span className="block text-xs text-slate-500">{ec.subtopics.length} alt başlık · {ec.itemCount} bilgi · {ec.questionCount} soru</span>
                      </span>
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => listen(ec.course.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer">
                        <Headphones className="w-4 h-4" /> Dersin eksiklerini dinle
                        {!limits.eksiklerimAudio && <Lock className="w-3 h-3" />}
                      </button>
                      <button onClick={() => copy('c' + ec.course.id, courseText(ec))} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
                        {copied === 'c' + ec.course.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />} Kopyala
                      </button>
                    </div>
                  </div>
                  {open && (
                    <div className="border-t border-slate-100 divide-y divide-slate-100">
                      {ec.subtopics.map(es => (
                        <div key={es.subtopic.id} className="p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="font-bold text-slate-800 text-sm">
                              {es.subtopic.title} <span className="text-xs text-slate-500 font-normal">· {es.items.length} bilgi</span>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => listen(ec.course.id, es.subtopic.id)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer">
                                <Headphones className="w-3.5 h-3.5" /> Dinle
                              </button>
                              <button onClick={() => copy('s' + es.subtopic.id, subtopicText(es))} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
                                {copied === 's' + es.subtopic.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />} Kopyala
                              </button>
                              <button onClick={() => goToSubtopic(ec.course.id, es.subtopic.id, 'lecture')} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer">
                                <BookOpen className="w-3.5 h-3.5" /> Konu
                              </button>
                            </div>
                          </div>
                          <ol className="mt-3 space-y-2 list-decimal pl-5 text-sm text-slate-800 leading-relaxed">
                            {es.items.map(it => (
                              <li key={it.key}>
                                {it.text}
                                {it.questionIds.length > 1 && <span className="ml-1 text-[10px] text-rose-600 font-bold">({it.questionIds.length} soru)</span>}
                              </li>
                            ))}
                          </ol>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <button
              onClick={() => copy('all', eksiklerim.map(courseText).join('\n\n\n'))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              {copied === 'all' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />} Tüm eksiklerimi kopyala
            </button>
          </div>
        ))}

      {tab === 'sorular' && (
        <div className="space-y-3">
          {qList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">Tekrar çözülecek soru yok.</div>
          ) : (
            qList.map(({ q, s, c }, i) => (
              <div key={q.id} className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-2 border-b border-slate-100">
                  <span className="text-slate-600"><b>{c.title}</b> / {s.title}</span>
                  <div className="flex gap-2">
                    <button onClick={() => goToSubtopic(c.id, s.id, 'test')} className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold hover:bg-amber-200 cursor-pointer">Testte çöz</button>
                    <button
                      onClick={() => {
                        if (marked.has(q.id)) toggleRepeat(q.id);
                        if (wrong.has(q.id)) resetWrongQuestion(q.id);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                      title="Bu soruyu Eksiklerim’den çıkar"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Çıkar
                    </button>
                  </div>
                </div>
                <p className="mt-3 font-bold text-slate-900 text-sm leading-relaxed">{i + 1}. {q.questionText}</p>
                <p className="mt-2 text-sm text-emerald-800 font-semibold">Doğru: {q.options[q.correctIndex]}</p>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{q.explanation}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
