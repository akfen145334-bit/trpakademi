import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { toISO, slotLabel } from '../services/studyPlan';

/**
 * Uygulama/sekme açıkken seçilen saatlerde çalışma hatırlatması bildirimi gönderir.
 * (Kapalıyken uyarı için kullanıcı takvim dosyasını (.ics) ekler; sunucu bildirimi yoktur.)
 */
export const ReminderRunner: React.FC = () => {
  const { userStats, courses } = useApp();
  const plan = userStats.plan;
  const rem = userStats.reminders;

  useEffect(() => {
    if (!plan || !rem?.enabled || typeof Notification === 'undefined') return;
    const titles = new Map<string, string>();
    courses.forEach(c => c.subtopics.forEach(s => titles.set(s.id, s.title)));

    const notify = async (title: string, body: string) => {
      if (Notification.permission !== 'granted') return;
      try {
        const reg = await navigator.serviceWorker?.getRegistration();
        if (reg) await reg.showNotification(title, { body, icon: 'icon-192.png', tag: 'trp-plan' });
        else new Notification(title, { body });
      } catch {
        /* yoksay */
      }
    };

    const tick = () => {
      const now = new Date();
      const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const date = toISO(now);
      const day = plan.days.find(d => d.date === date);
      if (!day) return;
      (['morning', 'noon', 'evening'] as const).forEach(slot => {
        if (rem.times[slot] !== hm) return;
        const key = `trp_rem_${date}_${slot}`;
        try {
          if (localStorage.getItem(key)) return;
          localStorage.setItem(key, '1');
        } catch {
          /* yoksay */
        }
        const names = day.subtopicIds.map(id => titles.get(id)).filter(Boolean).join(', ');
        notify(`TRP Akademi · ${slotLabel[slot]} çalışma zamanı`, `Bugünkü plan: ${names}`);
      });
    };
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, [plan, rem, courses]);

  return null;
};
