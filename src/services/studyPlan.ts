import { Course, ReminderPrefs, StudyPlan } from '../types';

export const toISO = (d: Date): string => {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
export const fromISO = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
};
export const daysBetween = (a: string, b: string): number =>
  Math.round((fromISO(b).getTime() - fromISO(a).getTime()) / 86400000) + 1;

/**
 * Konuları SINAVDA EN ÇOK SORU ÇIKANDAN EN AZ ÇIKANA doğru sıralar ve kalan günlere otomatik dağıtır.
 *  - gün sayısı >= konu sayısı: her konuya en az 1 gün; artan günler iş yüküne (cümle sayısı) göre tekrar günü olarak verilir.
 *  - gün sayısı < konu sayısı: komşu konular iş yükü dengelenerek aynı güne gruplanır.
 */
export function buildPlan(courses: Course[], start: string, end: string): StudyPlan | { error: string } {
  const n = daysBetween(start, end);
  if (!(n >= 1)) return { error: 'Bitiş tarihi başlangıçtan önce olamaz.' };
  if (n > 400) return { error: 'Plan en fazla 400 gün olabilir.' };

  const subs = courses
    .flatMap((c, ci) => c.subtopics.filter(s => s.isAvailable).map((s, si) => ({ s, ci, si })))
    .sort((a, b) => b.s.officialQuestionCount - a.s.officialQuestionCount || a.ci - b.ci || a.si - b.si)
    .map(x => ({ id: x.s.id, w: Math.max(1, x.s.sentences.length) }));
  if (subs.length === 0) return { error: 'Planlanacak konu bulunamadı.' };

  const dayDates: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = fromISO(start);
    d.setDate(d.getDate() + i);
    dayDates.push(toISO(d));
  }

  const days: { date: string; subtopicIds: string[] }[] = dayDates.map(date => ({ date, subtopicIds: [] }));

  if (n >= subs.length) {
    const extra = n - subs.length;
    const total = subs.reduce((t, x) => t + x.w, 0);
    const alloc = subs.map(x => 1 + Math.floor((extra * x.w) / total));
    let left = n - alloc.reduce((t, v) => t + v, 0);
    // kalan günler: sıralamada önde olan (daha çok soru çıkan) konulara
    for (let i = 0; left > 0; i = (i + 1) % subs.length, left--) alloc[i]++;
    let d = 0;
    subs.forEach((x, i) => {
      for (let k = 0; k < alloc[i] && d < n; k++) days[d++].subtopicIds.push(x.id);
    });
  } else {
    const total = subs.reduce((t, x) => t + x.w, 0);
    let d = 0;
    let acc = 0;
    subs.forEach((x, i) => {
      const remainingSubs = subs.length - i; // bu konu dahil
      const remainingDays = n - d; // bu gün dahil
      days[d].subtopicIds.push(x.id);
      acc += x.w;
      const target = total / n;
      const lastDay = d === n - 1;
      // sonraki konular kalan günleri dolduracak kadar kalmışsa günü kapat
      if (!lastDay && (acc >= target || remainingSubs - 1 <= remainingDays - 1)) {
        d++;
        acc = 0;
      }
    });
  }
  return { start, end, createdAt: Date.now(), days };
}

export const slotLabel: Record<'morning' | 'noon' | 'evening', string> = {
  morning: 'Sabah',
  noon: 'Öğle',
  evening: 'Akşam'
};
export const defaultTimes = { morning: '08:00', noon: '13:00', evening: '19:00' };

const icsEsc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/**
 * Telefonun takvimine eklenebilen günlük tekrarlı hatırlatıcılar (.ics).
 * Site kapalıyken de çalışan tek yöntem budur; uygulama içi bildirim yalnızca site/uygulama açıkken gelir.
 */
export function buildReminderIcs(plan: StudyPlan, prefs: ReminderPrefs, siteUrl: string): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const untilD = fromISO(plan.end);
  const until = `${untilD.getFullYear()}${String(untilD.getMonth() + 1).padStart(2, '0')}${String(untilD.getDate()).padStart(2, '0')}T235959`;
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//TRP Akademi//Calisma Plani//TR', 'CALSCALE:GREGORIAN'];
  (['morning', 'noon', 'evening'] as const).forEach(slot => {
    const t = prefs.times[slot];
    if (!t) return;
    const [h, m] = t.split(':').map(Number);
    const s = fromISO(plan.start);
    const dt = `${s.getFullYear()}${String(s.getMonth() + 1).padStart(2, '0')}${String(s.getDate()).padStart(2, '0')}T${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
    const end = new Date(s.getFullYear(), s.getMonth(), s.getDate(), h, m + 30);
    const dte = `${end.getFullYear()}${String(end.getMonth() + 1).padStart(2, '0')}${String(end.getDate()).padStart(2, '0')}T${String(end.getHours()).padStart(2, '0')}${String(end.getMinutes()).padStart(2, '0')}00`;
    lines.push(
      'BEGIN:VEVENT',
      `UID:trp-${slot}-${plan.createdAt}@trpakademi`,
      `DTSTAMP:${stamp}Z`,
      `DTSTART:${dt}`,
      `DTEND:${dte}`,
      `RRULE:FREQ=DAILY;UNTIL=${until}`,
      `SUMMARY:${icsEsc('TRP Akademi: ' + slotLabel[slot] + ' çalışma zamanı')}`,
      `DESCRIPTION:${icsEsc('Bugünkü çalışma planına bak: ' + siteUrl)}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'DESCRIPTION:TRP Akademi çalışma zamanı',
      'TRIGGER:PT0M',
      'END:VALARM',
      'END:VEVENT'
    );
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
