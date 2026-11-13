import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertCircle, 
  RotateCcw, 
  Headphones, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  ChevronRight, 
  Volume2, 
  Sparkles,
  BookmarkCheck,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export const EksiklerimView: React.FC = () => {
  const { 
    allWrongQuestions, 
    weakSubtopics, 
    resetWrongQuestion, 
    answerQuestion, 
    goToSubtopic, 
    playEksiklerimAudio,
    playSubtopicAudio,
    userStats,
    audioState,
    goToHome
  } = useApp();

  const [activeTab, setActiveTab] = useState<'wrong_questions' | 'weak_topics'>('wrong_questions');
  const [solvingQuestionId, setSolvingQuestionId] = useState<string | null>(null);

  const totalWrong = allWrongQuestions.length;
  const totalWeakTopics = weakSubtopics.length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Eksiklerim Banner & Header */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 text-xs font-bold border border-rose-400/30">
                Kişiselleştirilmiş Çalışma Alanı
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Eksiklerim & Tekrar Merkezi
            </h1>
            <p className="text-sm text-rose-100/90 mt-2 max-w-2xl leading-relaxed">
              Yanlış cevapladığınız sorular ve henüz pekişmemiş alt konu başlıkları burada toplanır. 
              Eksiklerinizi yeniden çözebilir veya tek tıkla <strong>Eksiklerimi Dinle</strong> özelliğiyle sesli tekrar yapabilirsiniz.
            </p>
          </div>

          {/* "Eksiklerimi Dinle" Primary CTA */}
          <div className="shrink-0 flex flex-col gap-2">
            <button
              onClick={playEksiklerimAudio}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black transition transform hover:scale-102 shadow-lg cursor-pointer ${
                audioState.isPlaying && audioState.mode === 'eksiklerim'
                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300/40'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              <Headphones className="w-5 h-5" />
              <span>Eksiklerimi Dinle</span>
            </button>
            <span className="text-[11px] text-center text-rose-200 font-medium">
              Fosforlu cümle takibiyle sırayla okur
            </span>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-rose-700/50">
          <div className="bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <div className="text-xs text-rose-200 font-medium">Yanlış Sorular</div>
            <div className="text-2xl font-black font-mono text-white mt-0.5">
              {totalWrong}
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <div className="text-xs text-rose-200 font-medium">Tekrar Edilecek Konular</div>
            <div className="text-2xl font-black font-mono text-white mt-0.5">
              {totalWeakTopics}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex flex-col justify-center">
            <div className="text-xs text-rose-200 font-medium">Tamamlanan Konular</div>
            <div className="text-lg font-bold font-mono text-emerald-300 mt-0.5">
              {userStats.completedSubtopicIds.length} Alt Başlık
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs between Wrong Questions & Weak Topics */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('wrong_questions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
            activeTab === 'wrong_questions'
              ? 'bg-rose-50 text-rose-900 border border-rose-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <XCircle className="w-4 h-4 text-rose-600" />
          <span>Yanlış Cevaplanan Sorular</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-rose-200 text-rose-900 font-mono">
            {totalWrong}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('weak_topics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
            activeTab === 'weak_topics'
              ? 'bg-amber-50 text-amber-900 border border-amber-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span>Eksik / Çalışılacak Konular</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-amber-200 text-amber-900 font-mono">
            {totalWeakTopics}
          </span>
        </button>
      </div>

      {/* Tab 1: Wrong Questions List & Retry Mode */}
      {activeTab === 'wrong_questions' && (
        <div className="space-y-4">
          {totalWrong === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-xl font-extrabold text-slate-800">
                Harika! Hiç Yanlışınız Yok
              </h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Çözdüğünüz tüm sorularda tam başarı gösterdiniz veya yanlışlarınızı başarıyla düzelttiniz. 
                Yeni konuları çalışmak için dersler bölümüne göz atabilirsiniz.
              </p>
              <button
                onClick={goToHome}
                className="mt-6 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl transition cursor-pointer"
              >
                Dersleri İncele
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 px-1">
                Aşağıdaki sorularda yanlış yapılmıştır. <strong>Tekrar Çöz</strong> butonuna tıklayarak cevabınızı sıfırlayabilir ve doğru cevabı bulana kadar pratik yapabilirsiniz.
              </div>

              {allWrongQuestions.map(({ question, subtopic, course }, qIdx) => {
                const userSelected = userStats.solvedQuestions[question.id];

                return (
                  <div 
                    key={question.id}
                    className="bg-white rounded-2xl border border-rose-200 p-5 sm:p-6 shadow-xs hover:border-rose-300 transition"
                  >
                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {course.title}
                        </span>
                        <span className="text-slate-400">/</span>
                        <span className="font-medium text-slate-600">
                          {subtopic.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => resetWrongQuestion(question.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-bold text-xs transition cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Yeniden Çöz</span>
                        </button>

                        <button
                          onClick={() => goToSubtopic(course.id, subtopic.id, 'lecture')}
                          className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Konu Anlatımı</span>
                        </button>
                      </div>
                    </div>

                    {/* Question text */}
                    <div className="mt-4 flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {qIdx + 1}
                      </span>
                      <p className="font-bold text-slate-900 text-sm sm:text-base leading-relaxed">
                        {question.questionText}
                      </p>
                    </div>

                    {/* Options list */}
                    <div className="mt-4 grid grid-cols-1 gap-2">
                      {question.options.map((opt, oIdx) => {
                        const isCorrectOption = oIdx === question.correctIndex;
                        const isUserChoice = oIdx === userSelected;

                        return (
                          <div
                            key={oIdx}
                            className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${
                              isCorrectOption
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                                : isUserChoice
                                ? 'bg-rose-50 border-rose-300 text-rose-950 font-medium'
                                : 'bg-slate-50/60 border-slate-200 text-slate-500'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 mt-0.5 ${
                              isCorrectOption ? 'bg-emerald-600 text-white' :
                              isUserChoice ? 'bg-rose-600 text-white' :
                              'bg-slate-200 text-slate-700'
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="flex-1">
                              {opt.replace(/^[A-E]\)\s*/, '')}
                            </span>
                            {isCorrectOption && (
                              <span className="text-[11px] font-bold text-emerald-700 px-2 py-0.5 bg-emerald-100 rounded">
                                Doğru Cevap
                              </span>
                            )}
                            {isUserChoice && !isCorrectOption && (
                              <span className="text-[11px] font-bold text-rose-700 px-2 py-0.5 bg-rose-100 rounded">
                                Sizin Cevabınız
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                      <strong className="text-slate-900">Açıklama:</strong> {question.explanation}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Weak / Incomplete Topics */}
      {activeTab === 'weak_topics' && (
        <div className="space-y-4">
          {totalWeakTopics === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-xl font-extrabold text-slate-800">
                Tüm Konular Başarıyla Tamamlandı!
              </h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Eksik veya zayıf olarak işaretlenen bir alt konu bulunmuyor. Dilediğiniz konuyu pekiştirmek için dersler listesinden sesli dinleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {weakSubtopics.map(({ subtopic, course }) => {
                const isPlayingThis = audioState.isPlaying && audioState.currentSubtopicId === subtopic.id;

                return (
                  <div
                    key={subtopic.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-300 transition shadow-xs"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {course.title}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1">
                        {subtopic.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {subtopic.sentences.length} cümle konu anlatımı · {subtopic.questions.length} test sorusu
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => playSubtopicAudio(course.id, subtopic.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isPlayingThis
                            ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Dinle</span>
                      </button>

                      <button
                        onClick={() => goToSubtopic(course.id, subtopic.id, 'lecture')}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Metni Aç</span>
                      </button>

                      <button
                        onClick={() => goToSubtopic(course.id, subtopic.id, 'test')}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                      >
                        <span>Testi Çöz</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
