import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { LessonCard } from './components/LessonCard';
import { LectureViewer } from './components/LectureViewer';
import { TestViewer } from './components/TestViewer';
import { EksiklerimView } from './components/EksiklerimView';
import { MutlakaBilView } from './components/MutlakaBilView';
import { HafizaKartlariView } from './components/HafizaKartlariView';
import { BackgroundAudioModal } from './components/BackgroundAudioModal';
import { ReportModal } from './components/ReportModal';
import { 
  Headphones, 
  BookOpen, 
  HelpCircle, 
  ChevronRight, 
  ArrowLeft, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Search,
  Filter
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { 
    courses, 
    activeView, 
    goToHome, 
    goToCourse,
    goToSubtopic,
    currentCourse, 
    currentSubtopic, 
    activeSubtopicTab, 
    setActiveSubtopicTab,
    playEntireCourseAudio,
    playSubtopicAudio,
    playEksiklerimAudio,
    audioState,
    getCourseStats,
    allWrongQuestions,
    weakSubtopics,
    userStats
  } = useApp();

  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);

  // Filter courses on home
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subtopics.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterActiveOnly ? course.isAvailable : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-28">
      {/* Navbar */}
      <Navbar 
        onOpenBackgroundModal={() => setIsBackgroundModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: HOME (Course Overview & Framed Cards) */}
        {activeView === 'home' && (
          <div className="space-y-6">
            
            {/* Hero Welcome Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />
              
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>TRP 2026 Müfredat Sistemi</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Turist Rehberliği Eğitim ve Sınav Portalı
                </h1>
                <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
                  Cihazın yerleşik motoruyla <strong>Türkçe sesli konu anlatımı</strong>, sarı fosforlu 
                  <strong> senkronize cümle takibi</strong>, her alt konuya özel çoktan seçmeli testler ve 
                  <strong> Eksiklerim</strong> çalışma sistemi tek ekranda.
                </p>

                {/* Quick Action Badges */}
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  {(allWrongQuestions.length > 0 || weakSubtopics.length > 0) && (
                    <button
                      onClick={playEksiklerimAudio}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md cursor-pointer"
                    >
                      <Headphones className="w-4 h-4" />
                      <span>Eksiklerimi Dinle ({allWrongQuestions.length + weakSubtopics.length})</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsBackgroundModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Mobil Kilit Ekranı Bilgisi</span>
                  </button>
                </div>
              </div>

              {/* Quick stats strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-700/60 relative z-10">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Toplam Müfredat</div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-white mt-0.5">11 Ders</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Aktif Konu Anlatımları</div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-amber-400 mt-0.5">11 Ders / 57 Alt Konu</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Çözülen Soru</div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-0.5">
                    {Object.keys(userStats.solvedQuestions).length} Soru
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Eksiklerim</div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-rose-400 mt-0.5">
                    {allWrongQuestions.length} Yanlış
                  </div>
                </div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ders veya alt konu başlığı ara (örn: Arkeoloji, Mevzuat, Dinler Tarihi, İlkyardım, İletişim)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterActiveOnly(prev => !prev)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    filterActiveOnly 
                      ? 'bg-amber-100 border-amber-300 text-amber-900' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>{filterActiveOnly ? 'Tüm Dersleri Göster' : 'Tüm Müfredat Aktif (11 Ders)'}</span>
                </button>
              </div>
            </div>

            {/* Courses List - Boxed / Framed Layout as requested */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Dersler ve Alt Konu Başlıkları
                </h2>
                <span className="text-xs text-slate-500">
                  {filteredCourses.length} ders listeleniyor
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {filteredCourses.map(course => (
                  <LessonCard key={course.id} course={course} />
                ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: COURSE DETAIL ("Ders İçeriğine Girilince") */}
        {activeView === 'course' && currentCourse && (
          <div className="space-y-6">
            
            {/* Breadcrumb & Navigation Back */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <button onClick={goToHome} className="hover:text-amber-800 font-semibold cursor-pointer">
                Dersler
              </button>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-900 font-bold">{currentCourse.title}</span>
            </div>

            {/* Course Header Banner with "Dersin Tümünü Dinle" */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-200 uppercase font-mono">
                    Ders İçeriği
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                    {currentCourse.title}
                  </h1>
                  <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                    {currentCourse.description}
                  </p>

                  {/* Course stats */}
                  {(() => {
                    const stats = getCourseStats(currentCourse.id);
                    return (
                      <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-mono">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-bold">
                          {stats.solvedCount}/{currentCourse.totalOfficialQuestions} Soru Çözüldü
                        </span>
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
                          Başarı: %{stats.successRate} ({stats.correctCount}/{stats.solvedCount})
                        </span>
                        <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg font-bold">
                          Kapsam: %{stats.coverageRate}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Primary CTA: "Dersin Tümünü Dinle" */}
                <div className="shrink-0 flex flex-col gap-2">
                  <button
                    onClick={() => playEntireCourseAudio(currentCourse.id)}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-sm shadow-md shadow-amber-600/20 transition cursor-pointer"
                  >
                    <Headphones className="w-5 h-5" />
                    <span>Dersin Tümünü Dinle</span>
                  </button>
                  <span className="text-[11px] text-center text-slate-500 font-medium">
                    Tüm alt konuları sırayla okur
                  </span>
                </div>
              </div>
            </div>

            {/* Subtopics Detailed Boxed List */}
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 px-1">
                Alt Konu Başlıkları
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {currentCourse.subtopics.map((subtopic) => {
                  const isPlayingThis = audioState.isPlaying && audioState.currentSubtopicId === subtopic.id;
                  const isCompleted = userStats.completedSubtopicIds.includes(subtopic.id);
                  const isWeak = userStats.weakSubtopicIds.includes(subtopic.id);
                  const solvedCount = subtopic.questions.filter(q => userStats.solvedQuestions[q.id] !== undefined).length;

                  return (
                    <div
                      key={subtopic.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isPlayingThis 
                          ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-300 shadow-xs' 
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center font-mono">
                            {subtopic.order}
                          </span>
                          <h4 className="font-extrabold text-base sm:text-lg text-slate-900">
                            {subtopic.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 pl-8">
                          {subtopic.sentences.length} cümle konu anlatımı · <span className="font-semibold text-slate-700">{solvedCount}/{subtopic.questions.length} soru</span> <span className="text-slate-400">(Müfredat Havuzu: {subtopic.officialQuestionCount})</span>
                        </p>
                      </div>

                      {/* Right actions: Individual "Dinle", "Konu Anlatımı", "Test" */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => playSubtopicAudio(currentCourse.id, subtopic.id)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            isPlayingThis
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200'
                          }`}
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>Dinle</span>
                        </button>

                        <button
                          onClick={() => goToSubtopic(currentCourse.id, subtopic.id, 'lecture')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Konu Anlatımı</span>
                        </button>

                        <button
                          onClick={() => goToSubtopic(currentCourse.id, subtopic.id, 'test')}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition cursor-pointer"
                        >
                          <span>Test ({subtopic.questions.length} Soru)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 3: SUBTOPIC DETAIL (Tabs: 1. Konu Anlatımı, 2. Test) */}
        {activeView === 'subtopic' && currentCourse && currentSubtopic && (
          <div className="space-y-6">
            
            {/* Breadcrumb Navigation */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <button onClick={goToHome} className="hover:text-amber-800 font-semibold cursor-pointer">
                Dersler
              </button>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <button onClick={() => goToCourse(currentCourse.id)} className="hover:text-amber-800 font-semibold cursor-pointer">
                {currentCourse.title}
              </button>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-900 font-bold truncate">{currentSubtopic.title}</span>
            </div>

            {/* Subtopic Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                    {currentCourse.title}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    {currentSubtopic.title}
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToCourse(currentCourse.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Dersin Konu Listesi</span>
                  </button>
                </div>
              </div>

              {/* The Two Main Sections Tabs: 1. Konu Anlatımı, 2. Test */}
              <div className="flex items-center gap-2 mt-6 border-b border-slate-200">
                <button
                  onClick={() => setActiveSubtopicTab('lecture')}
                  className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition -mb-[2px] cursor-pointer ${
                    activeSubtopicTab === 'lecture'
                      ? 'border-amber-600 text-amber-900 bg-amber-50/50 rounded-t-lg'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>1. Konu Anlatımı</span>
                  <span className="text-xs font-mono text-slate-400">
                    ({currentSubtopic.sentences.length} Cümle)
                  </span>
                </button>

                <button
                  onClick={() => setActiveSubtopicTab('test')}
                  className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition -mb-[2px] cursor-pointer ${
                    activeSubtopicTab === 'test'
                      ? 'border-amber-600 text-amber-900 bg-amber-50/50 rounded-t-lg'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>2. Test</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {currentSubtopic.questions.length} Soru
                  </span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: LECTURE OR TEST */}
            {activeSubtopicTab === 'lecture' ? (
              <LectureViewer 
                course={currentCourse} 
                subtopic={currentSubtopic} 
                onSwitchToTest={() => setActiveSubtopicTab('test')} 
              />
            ) : (
              <TestViewer 
                course={currentCourse} 
                subtopic={currentSubtopic} 
                onSwitchToLecture={() => setActiveSubtopicTab('lecture')} 
              />
            )}

          </div>
        )}

        {/* VIEW 4: EKSİKLERİM */}
        {activeView === 'eksiklerim' && (
          <EksiklerimView />
        )}

        {activeView === 'mutlakabil' && (
          <MutlakaBilView />
        )}

        {activeView === 'hafiza' && (
          <HafizaKartlariView />
        )}

      </main>

      {/* Persistent Audio Player Floating Bar */}
      <AudioPlayerBar />

      {/* Modals */}
      <BackgroundAudioModal 
        isOpen={isBackgroundModalOpen} 
        onClose={() => setIsBackgroundModalOpen(false)} 
      />

      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
