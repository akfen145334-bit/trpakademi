import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart2, 
  X, 
  CheckCircle2, 
  TrendingUp, 
  HelpCircle, 
  Award,
  BookOpen
} from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  const { courses, getCourseStats, getOverallStats } = useApp();

  if (!isOpen) return null;

  const overall = getOverallStats();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              TRP Genel Başarı & Kapsam Raporu
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tüm derslerin soru çözüm ve konu tamamlama performansı
            </p>
          </div>
        </div>

        {/* Overall Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 shrink-0">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <div className="text-[11px] text-slate-500 font-medium">Toplam Soru Havuzu</div>
            <div className="text-xl font-black font-mono text-slate-900 mt-0.5">
              {overall.totalOfficial}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <div className="text-[11px] text-slate-500 font-medium">Çözülen Soru</div>
            <div className="text-xl font-black font-mono text-indigo-600 mt-0.5">
              {overall.solvedCount}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <div className="text-[11px] text-slate-500 font-medium">Genel Başarı</div>
            <div className="text-xl font-black font-mono text-emerald-600 mt-0.5">
              %{overall.successRate}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <div className="text-[11px] text-slate-500 font-medium">Müfredat Kapsamı</div>
            <div className="text-xl font-black font-mono text-blue-600 mt-0.5">
              %{overall.coverageRate}
            </div>
          </div>
        </div>

        {/* Course-by-course breakdown list */}
        <div className="overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100 flex-1">
          {courses.map(course => {
            const stats = getCourseStats(course.id);

            return (
              <div key={course.id} className="pt-3 first:pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {course.title}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500">
                      {stats.solvedCount}/{course.totalOfficialQuestions} soru
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      Başarı: <strong>%{stats.successRate}</strong> ({stats.correctCount}/{stats.solvedCount})
                    </span>
                    <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                      Kapsam: <strong>%{stats.coverageRate}</strong>
                    </span>
                  </div>
                </div>

                {/* Micro progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, stats.coverageRate)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
