import React, { useState, useEffect, useMemo } from 'react';
import { Subtopic, Course, Question } from '../types';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TestViewerProps {
  course: Course;
  subtopic: Subtopic;
  onSwitchToLecture: () => void;
}

export const TestViewer: React.FC<TestViewerProps> = ({ course, subtopic, onSwitchToLecture }) => {
  const { userStats, answerQuestion, resetWrongQuestion, goToEksiklerim } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [filterMode, setFilterMode] = useState<'all' | 'unsolved' | 'wrong'>('all');

  const questions = subtopic.questions;

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setFilterMode('all');
  }, [subtopic.id]);

  const filteredIndices = useMemo(() => {
    if (!questions) return [];
    return questions
      .map((q, idx) => ({ q, idx }))
      .filter(({ q }) => {
        if (filterMode === 'unsolved') return userStats.solvedQuestions[q.id] === undefined;
        if (filterMode === 'wrong') return userStats.wrongQuestionIds.includes(q.id);
        return true;
      })
      .map(item => item.idx);
  }, [questions, filterMode, userStats.solvedQuestions, userStats.wrongQuestionIds]);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto">
        <HelpCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">
          Bu Alt Konu İçin Sorular Hazırlanıyor
        </h3>
        <p className="text-sm text-slate-500 mt-2">
          Kullanıcı tarafından sağlanan soru bankası yüklendikçe burada çoktan seçmeli sorular listelenecektir.
        </p>
        <button
          onClick={onSwitchToLecture}
          className="mt-6 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-xl transition cursor-pointer"
        >
          Konu Anlatımına Geri Dön
        </button>
      </div>
    );
  }

  const safeIndex = Math.min(currentQuestionIndex, questions.length - 1);
  const currentQ = questions[safeIndex];
  const userSelectedIndex = userStats.solvedQuestions[currentQ.id];
  const isAnswered = userSelectedIndex !== undefined;
  const isCorrect = isAnswered && userSelectedIndex === currentQ.correctIndex;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return; // already answered
    const correct = idx === currentQ.correctIndex;
    answerQuestion(currentQ.id, idx, correct, subtopic.id);

    if (correct && safeIndex === questions.length - 1) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }
  };

  const handleResetCurrent = () => {
    resetWrongQuestion(currentQ.id);
  };

  const jumpToNextUnsolved = () => {
    const nextAfter = questions.findIndex((q, idx) => idx > safeIndex && userStats.solvedQuestions[q.id] === undefined);
    if (nextAfter !== -1) {
      setCurrentQuestionIndex(nextAfter);
      return;
    }
    const firstUnsolved = questions.findIndex(q => userStats.solvedQuestions[q.id] === undefined);
    if (firstUnsolved !== -1) {
      setCurrentQuestionIndex(firstUnsolved);
    }
  };

  // Subtopic test summary
  const totalQuestions = questions.length;
  const answeredCount = questions.filter(q => userStats.solvedQuestions[q.id] !== undefined).length;
  const correctCount = questions.filter(q => userStats.correctQuestionIds.includes(q.id)).length;
  const wrongCount = questions.filter(q => userStats.wrongQuestionIds.includes(q.id)).length;
  const unsolvedCount = totalQuestions - answeredCount;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Test Header & Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                Çoktan Seçmeli Test
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Soru {safeIndex + 1} / {totalQuestions}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
              {subtopic.title}
            </h3>
          </div>

          {/* Quick Score Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{correctCount} Doğru</span>
            </div>
            <div className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
              <XCircle className="w-3.5 h-3.5" />
              <span>{wrongCount} Yanlış</span>
            </div>
            <button
              onClick={onSwitchToLecture}
              className="flex items-center gap-1 text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg border border-slate-200 transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Konuya Dön</span>
            </button>
          </div>
        </div>

        {/* Filter & Navigation Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                filterMode === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tümü ({totalQuestions})
            </button>
            <button
              onClick={() => setFilterMode('unsolved')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                filterMode === 'unsolved' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Çözülmemiş ({unsolvedCount})
            </button>
            <button
              onClick={() => setFilterMode('wrong')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                filterMode === 'wrong' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Yanlışlarım ({wrongCount})
            </button>
          </div>

          {unsolvedCount > 0 && (
            <button
              onClick={jumpToNextUnsolved}
              className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer"
            >
              Sonraki Çözülmemiş →
            </button>
          )}
        </div>

        {/* Question Selector Dots (Scrollable for large banks) */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 max-h-24 sm:max-h-36 overflow-y-auto p-1">
          {filteredIndices.length === 0 ? (
            <span className="text-xs text-slate-400 italic py-1">Bu filtrede soru bulunmuyor.</span>
          ) : (
            filteredIndices.map((idx) => {
              const q = questions[idx];
              const answered = userStats.solvedQuestions[q.id] !== undefined;
              const correct = userStats.correctQuestionIds.includes(q.id);
              const wrong = userStats.wrongQuestionIds.includes(q.id);
              const isCurrent = idx === safeIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                    isCurrent ? 'ring-2 ring-amber-500 ring-offset-1' : ''
                  } ${
                    correct ? 'bg-emerald-500 text-white' :
                    wrong ? 'bg-rose-500 text-white' :
                    answered ? 'bg-slate-400 text-white' :
                    'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        
        {/* Question Text */}
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">
            {safeIndex + 1}
          </span>
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentQ.questionText}
          </p>
        </div>

        {/* Options List */}
        <div className="mt-6 space-y-3">
          {currentQ.options.map((optText, optIdx) => {
            let optionState = 'idle'; // idle | correct | wrong | neutral_answered
            if (isAnswered) {
              if (optIdx === currentQ.correctIndex) {
                optionState = 'correct';
              } else if (optIdx === userSelectedIndex) {
                optionState = 'wrong';
              } else {
                optionState = 'disabled';
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                  optionState === 'idle'
                    ? 'bg-slate-50/60 border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 text-slate-800'
                    : optionState === 'correct'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400 font-semibold shadow-xs'
                    : optionState === 'wrong'
                    ? 'bg-rose-50 border-rose-400 text-rose-950 ring-1 ring-rose-400 font-semibold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-mono mt-0.5 ${
                  optionState === 'correct'
                    ? 'bg-emerald-600 text-white'
                    : optionState === 'wrong'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-600'
                }`}>
                  {String.fromCharCode(65 + optIdx)}
                </div>

                <div className="flex-1 text-sm sm:text-base">
                  {optText.replace(/^[A-E]\)\s*/, '')}
                </div>

                {optionState === 'correct' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {optionState === 'wrong' && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback & Explanation Box */}
        {isAnswered && (
          <div className={`mt-6 p-5 rounded-xl border transition-all ${
            isCorrect 
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900' 
              : 'bg-rose-50/90 border-rose-300 text-rose-900'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-extrabold text-sm sm:text-base">
                      Tebrikler! Doğru Cevap
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span className="font-extrabold text-sm sm:text-base">
                      Yanlış Cevap (Eksiklerim Bölümüne Eklendi)
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={handleResetCurrent}
                title="Cevabımı temizle ve soruyu tekrar çöz"
                className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 hover:bg-white text-slate-700 border border-slate-200 transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Tekrar Çöz</span>
              </button>
            </div>

            <div className="text-xs sm:text-sm leading-relaxed mt-2 pt-2 border-t border-slate-200/60 font-sans whitespace-pre-line">
              <span className="font-bold underline mr-1">Çözüm Açıklaması:</span>
              {currentQ.explanation}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, safeIndex - 1))}
            disabled={safeIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              safeIndex === 0 
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Önceki Soru</span>
          </button>

          {safeIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, safeIndex + 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition cursor-pointer"
            >
              <span>Sonraki Soru</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={goToEksiklerim}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
            >
              <span>Eksiklerim Bölümünü İncele</span>
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
