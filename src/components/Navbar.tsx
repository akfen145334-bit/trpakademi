import React from 'react';
import { useApp } from '../context/AppContext';
import { AccountButton } from './AccountButton';
import {
  BookOpen, 
  AlertCircle, 
  BarChart2, 
  Headphones, 
  Volume2, 
  Smartphone,
  Download,
  Zap,
  Brain,
  ClipboardList,
  CheckCircle2
} from 'lucide-react';

const isStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches || (navigator as any).standalone === true);

const InstallButton: React.FC = () => {
  const [promptEvent, setPromptEvent] = React.useState<any>(null);
  const [installed, setInstalled] = React.useState(isStandalone());
  const [showHelp, setShowHelp] = React.useState(false);

  React.useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return null;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  const onClick = async () => {
    if (promptEvent) {
      promptEvent.prompt();
      try {
        const choice = await promptEvent.userChoice;
        if (choice?.outcome === 'accepted') setInstalled(true);
      } catch {
        /* kullanıcı kapattı */
      }
      setPromptEvent(null);
    } else {
      setShowHelp(true);
    }
  };

  return (
    <>
      <button
        onClick={onClick}
        title="Uygulamayı telefona yükle (ana ekrana kısayol ekle)"
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-sm transition cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span className="hidden min-[430px]:inline">Yükle</span>
      </button>

      {showHelp && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl space-y-3 text-sm text-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-extrabold text-base text-slate-900">Telefona Yükle</h3>
            {isIOS ? (
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>Safari'de alttaki <b>Paylaş</b> düğmesine dokunun.</li>
                <li><b>Ana Ekrana Ekle</b>'yi seçin.</li>
                <li><b>Ekle</b>'ye dokunun; TRP Akademi ana ekranınıza gelir.</li>
              </ol>
            ) : (
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>Tarayıcının sağ üstündeki <b>⋮ menüsünü</b> açın.</li>
                <li><b>Uygulamayı yükle</b> veya <b>Ana ekrana ekle</b>'yi seçin.</li>
                <li>Onaylayın; TRP Akademi ana ekranınıza gelir.</li>
              </ol>
            )}
            <p className="text-xs text-slate-500">
              Bu düğme yükleme penceresini otomatik açamadıysa (tarayıcı izin vermediğinde) yukarıdaki adımlar geçerlidir.
            </p>
            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2 rounded-lg bg-slate-900 text-white font-bold cursor-pointer"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </>
  );
};

interface NavbarProps {
  onOpenBackgroundModal: () => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBackgroundModal, onOpenReportModal }) => {
  const { 
    activeView, 
    goToHome, 
    goToEksiklerim, 
    goToMutlakaBil,
    goToHafiza,
    goToDeneme,
    allWrongQuestions,
    weakSubtopics,
    audioState,
    getOverallStats 
  } = useApp();

  const totalEksikCount = allWrongQuestions.length + weakSubtopics.length;
  const stats = getOverallStats();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-1 sm:gap-2">
          
          {/* Logo & Platform Name */}
          <button 
            onClick={goToHome}
            className="flex items-center gap-2 sm:gap-3 text-left group transition cursor-pointer min-w-0 shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="hidden min-[480px]:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight whitespace-nowrap text-slate-900 group-hover:text-amber-700 transition">
                  TRP Akademi
                </span>
                <span className="hidden sm:inline text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  TRP 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Turist Rehberliği Sesli Konu & Sınav Portalı
              </p>
            </div>
          </button>

          {/* Center Navigation Links */}
          <nav className="flex items-center gap-0 sm:gap-2">
            <button
              onClick={goToHome}
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeView === 'home' || activeView === 'course' || activeView === 'subtopic'
                  ? 'bg-amber-50 text-amber-900 border border-amber-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Dersler</span>
            </button>

            <button
              onClick={() => goToMutlakaBil()}
              title="Mutlaka Bil: hızlı tekrar"
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeView === 'mutlakabil'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Mutlaka Bil</span>
            </button>
            <button
              onClick={() => goToHafiza()}
              title="Hafıza Kartları: hafıza teknikleriyle öğren"
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeView === 'hafiza'
                  ? 'bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Brain className="w-4 h-4 text-fuchsia-600" />
              <span className="hidden sm:inline">Hafıza Kartları</span>
            </button>
            <button
              onClick={goToDeneme}
              title="Süreli deneme sınavı"
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeView === 'deneme'
                  ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ClipboardList className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Deneme</span>
            </button>
            <button
              onClick={goToEksiklerim}
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-lg text-sm font-semibold transition relative cursor-pointer ${
                activeView === 'eksiklerim'
                  ? 'bg-rose-50 text-rose-900 border border-rose-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">Eksiklerim</span>
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
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Audio Indicator */}
            {audioState.isPlaying && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-medium animate-pulse">
                <Volume2 className="w-3.5 h-3.5 text-amber-700 animate-bounce" />
                <span>Sesli Dinleniyor</span>
              </div>
            )}

            <AccountButton />
            <InstallButton />

            {/* Mobile / Tablet Background Audio Info */}
            <button
              onClick={onOpenBackgroundModal}
              title="Mobil ve Tablet Arka Planda Dinleme Bilgisi"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
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
