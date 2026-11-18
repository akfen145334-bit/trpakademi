/**
 * İçerik koruması: okuma sırasında kopyalama/kesme/sürükleme/sağ tık/yazdırma/ekrandaki metni seçme engellenir.
 * Not: Tarayıcıda çalışan hiçbir yöntem kararlı bir kopyalayıcıyı (ekran görüntüsü, geliştirici araçları) durduramaz;
 * bu katman rastgele kopyalamayı ve toplu çekmeyi zorlaştırır. Gerçek kanıt için dijital imza ve filigran kullanılır.
 */
const NOTICE = 'TRP Akademi içeriği telif hakkıyla korunmaktadır; kopyalanamaz, çoğaltılamaz.';

const isEditable = (t: EventTarget | null): boolean => {
  const el = t as HTMLElement | null;
  if (!el || !el.tagName) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable || !!el.closest?.('[data-allow-copy]');
};

export const installContentGuard = () => {
  if (typeof document === 'undefined') return;
  const stop = (e: Event) => {
    if (isEditable(e.target)) return;
    e.preventDefault();
  };
  document.addEventListener('copy', (e) => {
    if (isEditable(e.target)) return;
    e.preventDefault();
    try {
      (e as ClipboardEvent).clipboardData?.setData('text/plain', NOTICE);
    } catch {
      /* yoksay */
    }
  });
  document.addEventListener('cut', stop);
  document.addEventListener('dragstart', stop);
  document.addEventListener('contextmenu', stop);
  document.addEventListener('selectstart', stop);
  document.addEventListener('keydown', (e) => {
    if (isEditable(e.target)) return;
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && ['c', 'x', 'a', 's', 'p', 'u'].includes(k)) e.preventDefault();
    if (e.key === 'PrintScreen') {
      try {
        navigator.clipboard?.writeText(NOTICE);
      } catch {
        /* yoksay */
      }
    }
  });
  const hide = () => document.documentElement.classList.add('trp-print');
  const show = () => document.documentElement.classList.remove('trp-print');
  window.addEventListener('beforeprint', hide);
  window.addEventListener('afterprint', show);
};
