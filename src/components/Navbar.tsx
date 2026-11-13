import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  AlertCircle, 
  BarChart2, 
  Headphones, 
  Volume2, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  onOpenBackgroundModal: () => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBackgroundModal, onOpenReportModal }) => {
  const { 
    activeView, 
    goToHome, 
    goToEksiklerim, 
    allWrongQuestions, 
    weakSubtopics,
    audioState,
    getOverallStats 
  } = useApp();

  const totalEksikCount = allWrongQuestions.length + weakSubtopics.length;
  const stats = getOverallStats();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <button 
            onClick={goToHome}
            className="flex items-center gap-3 text-left group transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-amber-700 transition">
                  TRP Akademi
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  TRP 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Turist Rehberliği Sesli Konu & Sınav Portalı
              </p>
            </div>
          </button>

          {/* Center Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={goToHome}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeView === 'home' || activeView === 'course' || activeView === 'subtopic'
                  ? 'bg-amber-50 text-amber-900 border border-amber-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Dersler</span>
            </button>

            <button
              onClick={goToEksiklerim}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition relative cursor-pointer ${
                activeView === 'eksiklerim'
                  ? 'bg-rose-50 text-rose-900 border border-rose-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Eksiklerim</span>
              {totalEksikCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full bg-rose-600 text-white animate-pulse">
                  {totalEksikCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenReportModal}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <span>Genel Rapor</span>
              <span className="text-xs text-slate-400">
                %{stats.successRate}
              </span>
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Audio Indicator */}
            {audioState.isPlaying && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-medium animate-pulse">
                <Volume2 className="w-3.5 h-3.5 text-amber-700 animate-bounce" />
                <span>Sesli Dinleniyor</span>
              </div>
            )}

            {/* Mobile / Tablet Background Audio Info */}
            <button
              onClick={onOpenBackgroundModal}
              title="Mobil ve Tablet Arka Planda Dinleme Bilgisi"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Arka Plan Dinleme</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
