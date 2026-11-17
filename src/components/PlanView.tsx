import React, { useMemo, useState } from 'react';
import { CalendarDays, Bell, BellOff, Download, CheckCircle2, Trash2, Wand2, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { buildPlan, buildReminderIcs, daysBetween, defaultTimes, slotLabel, toISO, fromISO } from '../services/studyPlan';
import { ReminderPrefs } from '../types';

const fmt = (iso: string) =>
  fromISO(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' });

export const PlanView: React.FC = () => {
  const { courses, userStats, savePlan, setReminders, goToSubtopic } = useApp();
  const auth = useAuth();
  const plan = userStats.plan;
  const rem: ReminderPrefs = userStats.reminders || { enabled: false, times: {} };

  const today = toISO(new Date());
  const [start, setStart] = useState(plan?.start && plan.start >= today ? plan.start : today);
  const [end, setEnd] = useState(plan?.end || '');
  const [err, setErr] = useState('');
  const [notifMsg, setNotifMsg] = useState('');

  // Hesap sistemi açıksa plan üyelere özeldir (Supabase kapalıysa yerelde çalışır)
  const needsLogin = auth.enabled && !auth.user;

  const info = useMemo(() => {
    const m = new Map<string, { title: string; course: string; courseId: string; q: number }>();
    courses.forEach(c => c.subtopics.forEach(s => m.set(s.id, { title: s.title, course: c.title, courseId: c.id, q: s.officialQuestionCount })));
    return m;
  }, [courses]);

  if (needsLogin) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
        <Lock className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-xl font-extrabold text-slate-900">Çalışma planı üyelere özeldir</h2>
        <p className="text-sm text-slate-600">
          Planın hesabına kaydedilir; telefonda ve tablette aynı plan görünür. Üst menüdeki hesap düğmesinden giriş yapıp tekrar gel.
        </p>
      </div>
    );
  }

  const create = () => {
    setErr('');
    if (!end) {
      setErr('Bitiş (sınav) tarihini seç.');
      return;
    }
    const r = buildPlan(courses, start, end);
    if ('error' in r) {
      setErr(r.error);
      return;
    }
    savePlan(r);
  };

  const askNotif = async () => {
    if (!('Notification' in window)) {
      setNotifMsg('Bu tarayıcı bildirimleri desteklemiyor. Aşağıdaki takvim dosyasını kullan.');
      return false;
    }
    const p = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
    setNotifMsg(p === 'granted' ? 'Bildirim izni verildi.' : 'Bildirim izni verilmedi. Tarayıcı/Android ayarlarından bu siteye bildirim iznini aç.');
    return p === 'granted';
  };

  const toggleRem = async (on: boolean) => {
    if (on) {
      await askNotif();
      const times = Object.keys(rem.times).length ? rem.times : { ...defaultTimes };
      setReminders({ enabled: true, times });
    } else setReminders({ ...rem, enabled: false });
  };
  const setSlot = (slot: 'morning' | 'noon' | 'evening', val: string) => {
    const times = { ...rem.times };
    if (val) times[slot] = val;
    else delete times[slot];
    setReminders({ ...rem, times });
  };

  const downloadIcs = () => {
    if (!plan) return;
    const ics = buildReminderIcs(plan, rem, location.origin + location.pathname);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    a.download = 'trp-akademi-calisma-hatirlaticilari.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const done = new Set(userStats.completedSubtopicIds);
  const todayPlan = plan?.days.find(d => d.date === today);
  const doneDays = plan ? plan.days.filter(d => d.subtopicIds.every(id => done.has(id))).length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-indigo-900 to-sky-800 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2"><CalendarDays className="w-7 h-7" /> Çalışma Planım</h1>
        <p className="text-sm text-sky-100 mt-2 max-w-2xl leading-relaxed">
          Tarih aralığını seç; konular sınavda <b>en çok soru çıkandan en aza</b> doğru sıralanır ve kalan günlere otomatik dağıtılır.
          Planın hesabına kaydedilir.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <h3 className="font-extrabold text-slate-900">Plan oluştur</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-sm font-semibold text-slate-700">
            Başlangıç tarihi
            <input type="date" value={start} min={today} onChange={e => setStart(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Bitiş / sınav tarihi
            <input type="date" value={end} min={start} onChange={e => setEnd(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
          </label>
        </div>
        {end && start <= end && <p className="text-xs text-slate-500">{daysBetween(start, end)} gün için planlanacak.</p>}
        {err && <p className="text-sm font-bold text-rose-600">{err}</p>}
        <div className="flex gap-2 flex-wrap">
          <button onClick={create} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-700 hover:bg-indigo-600 text-white cursor-pointer">
            <Wand2 className="w-4 h-4" /> {plan ? 'Planı yeniden oluştur' : 'Planı oluştur'}
          </button>
          {plan && (
            <button onClick={() => savePlan(null)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <Trash2 className="w-4 h-4" /> Planı sil
            </button>
          )}
        </div>
      </div>

      {plan && (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
              {rem.enabled ? <Bell className="w-5 h-5 text-amber-600" /> : <BellOff className="w-5 h-5 text-slate-400" />} Günlük hatırlatıcı
            </h3>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={rem.enabled} onChange={e => toggleRem(e.target.checked)} className="w-4 h-4 accent-amber-600" />
              Beni çalışma planım için hatırlat (isteğe bağlı)
            </label>
            {rem.enabled && (
              <div className="grid sm:grid-cols-3 gap-3">
                {(['morning', 'noon', 'evening'] as const).map(slot => (
                  <label key={slot} className="text-sm font-semibold text-slate-700">
                    {slotLabel[slot]}
                    <input type="time" value={rem.times[slot] || ''} onChange={e => setSlot(slot, e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
                    <span className="text-[10px] font-normal text-slate-400">boş bırakırsan kapalı</span>
                  </label>
                ))}
              </div>
            )}
            {notifMsg && <p className="text-xs font-semibold text-emerald-700">{notifMsg}</p>}
            {rem.enabled && (
              <div className="text-xs text-slate-600 bg-amber-50 border border-amber-200 rounded-lg p-3 leading-relaxed space-y-2">
                <p>
                  <b>Önemli:</b> Uygulama içi bildirim, site/uygulama açıkken (arka planda sekme canlıyken) gelir. Telefon kilitliyken ya da
                  uygulama tamamen kapalıyken de uyarı istiyorsan aşağıdaki dosyayı telefonunun takvimine ekle.
                </p>
                <button onClick={downloadIcs} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white cursor-pointer">
                  <Download className="w-4 h-4" /> Takvime ekle (.ics)
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-indigo-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-extrabold text-slate-900">Bugün ({fmt(today)})</h3>
              <span className="text-xs text-slate-500">{doneDays}/{plan.days.length} gün tamam</span>
            </div>
            {todayPlan ? (
              <ul className="mt-3 space-y-2">
                {todayPlan.subtopicIds.map(id => {
                  const i = info.get(id);
                  if (!i) return null;
                  return (
                    <li key={id} className="flex items-center justify-between gap-3 bg-indigo-50 rounded-xl p-3">
                      <span className="text-sm font-bold text-slate-900">{i.title} <span className="text-xs font-normal text-slate-500">· {i.course}</span></span>
                      <button onClick={() => goToSubtopic(i.courseId, id, 'lecture')} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-700 text-white hover:bg-indigo-600 cursor-pointer">Çalış</button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 mt-2">{today < plan.start ? `Plan ${fmt(plan.start)} tarihinde başlıyor.` : 'Bugün için planlı konu yok (plan bitti).'}</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-extrabold text-slate-900 mb-3">Tüm plan ({fmt(plan.start)} – {fmt(plan.end)})</h3>
            <ol className="space-y-1.5">
              {plan.days.map((d, idx) => {
                const prev = plan.days[idx - 1];
                return (
                  <li key={d.date} className={`flex flex-wrap items-start gap-2 text-sm rounded-lg px-3 py-2 ${d.date === today ? 'bg-indigo-50 ring-1 ring-indigo-300' : 'bg-slate-50'}`}>
                    <span className="w-36 shrink-0 font-semibold text-slate-700">{fmt(d.date)}</span>
                    <span className="flex-1 min-w-0">
                      {d.subtopicIds.map(id => {
                        const i = info.get(id);
                        const rep = prev?.subtopicIds.includes(id);
                        return (
                          <span key={id} className="inline-flex items-center gap-1 mr-3">
                            {done.has(id) && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                            <span className="text-slate-800">{i?.title}</span>
                            <span className="text-[10px] text-slate-400">({i?.q} soru{rep ? ', tekrar' : ''})</span>
                          </span>
                        );
                      })}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </>
      )}
    </div>
  );
};
