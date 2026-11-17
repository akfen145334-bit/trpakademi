import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Settings, X, Download, Upload, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DRIVE_AUDIO_URL } from '../config/links';
import { PackManager } from './PackManager';
import { useImageMode, setImageMode } from '../services/imageService';
import { getFontPercent, applyFontPercent, FONT_MIN, FONT_MAX, FONT_STEP } from '../services/fontScale';

export const SettingsButton: React.FC = () => {
  const { audioSource, setAudioSource, exportProgress, importProgress, keepBackgroundAudio, setKeepBackgroundAudio, enableBackgroundAudio } = useApp();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'merge' | 'overwrite'>('merge');
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const imgMode = useImageMode();

  const [font, setFont] = useState(getFontPercent());
  useEffect(() => {
    applyFontPercent(getFontPercent());
  }, []);
  const changeFont = (delta: number) => setFont(applyFontPercent(font + delta));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const testTts = () => {
    try {
      if (!('speechSynthesis' in window)) {
        setMsg('Bu cihazda sesli okuyucu (TTS) bulunamadı.');
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance('Merhaba, bu telefonun sesli okuyucusu.');
      u.lang = 'tr-TR';
      window.speechSynthesis.speak(u);
      setMsg('');
    } catch {
      setMsg('Ses denenemedi.');
    }
  };

  const download = () => {
    const data = exportProgress();
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `trp-akademi-ilerleme-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    setMsg('İlerleme dosyası indirildi. Kendine mail atmak için aşağıdaki “Mail hazırla” düğmesini kullan, dosyayı maile ekle.');
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      const r = importProgress(data, mode);
      setMsg(r.message);
    } catch {
      setMsg('Dosya okunamadı.');
    }
  };

  const mailto =
    'mailto:?subject=' +
    encodeURIComponent('TRP Akademi ilerleme verilerim') +
    '&body=' +
    encodeURIComponent(
      'TRP Akademi ilerleme dosyam ekte. (Önce uygulamadan “İlerlemeyi indir” ile dosyayı indirip bu maile ekle.) Başka cihazda bu dosyayı Ayarlar > Dosyadan yükle ile açabilirsin.'
    );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Ayarlar"
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden xl:inline">Ayarlar</span>
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900">Ayarlar</h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-slate-100 cursor-pointer" aria-label="Kapat">
                <X className="w-5 h-5" />
              </button>
            </div>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-800">Yazı boyutu</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => changeFont(-FONT_STEP)} disabled={font <= FONT_MIN} className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-40 cursor-pointer">Azalt (A−)</button>
                <span className="text-sm font-mono w-14 text-center">%{font}</span>
                <button onClick={() => changeFont(FONT_STEP)} disabled={font >= FONT_MAX} className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-40 cursor-pointer">Arttır (A+)</button>
                <button onClick={() => setFont(applyFontPercent(100))} className="px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Sıfırla</button>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-slate-800">Konu görselleri (temsili resimler)</h3>
              {([
                ['tap', 'Dokunarak yükle', 'en az veri: resim yalnızca “görseli göster”e basınca iner (~60 KB)'],
                ['auto', 'Otomatik göster', 'Wi-Fi’deyken önerilir'],
                ['off', 'Kapalı', 'hiç görsel indirilmez']
              ] as const).map(([v, t, d]) => (
                <label key={v} className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="imode2" checked={imgMode === v} onChange={() => setImageMode(v)} className="mt-1 accent-amber-600" />
                  <span><b>{t}</b> — {d}</span>
                </label>
              ))}
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-800">Ses</h3>
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <input type="radio" name="asrc" checked={audioSource === 'program'} onChange={() => setAudioSource('program')} className="mt-1 accent-amber-600" />
                <span><b>Uygulama sesini kullan</b> — bizim kaydettiğimiz Türkçe ses (varsa), yoksa sistem sesi.</span>
              </label>
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <input type="radio" name="asrc" checked={audioSource === 'device'} onChange={() => setAudioSource('device')} className="mt-1 accent-amber-600" />
                <span><b>Sistem sesini kullan</b> — cihazının kendi sesli okuyucusu (TTS). Telefonunda iyi bir okuyucu varsa bizim sese ihtiyacın olmayabilir.</span>
              </label>
              <button onClick={testTts} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">Sistem sesini dene</button>
              <p className="text-xs text-slate-600 bg-amber-50 border border-amber-200 rounded-lg p-3 leading-relaxed">
                Kayıtlı sesi ve resimleri bir kereye mahsus indirmek için aşağıdaki <b>Ders paketleri</b> bölümünü kullan.
                {DRIVE_AUDIO_URL ? (
                  <> Yardım: <a href={DRIVE_AUDIO_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-amber-800 underline">Drive</a></>
                ) : null}
              </p>
            </section>

            <PackManager />

            <section className="space-y-3">
              <h3 className="font-bold text-slate-800">Arka planda dinleme</h3>
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepBackgroundAudio}
                  onChange={e => {
                    setKeepBackgroundAudio(e.target.checked);
                    if (e.target.checked) enableBackgroundAudio();
                  }}
                  className="mt-1 w-4 h-4 accent-amber-600"
                />
                <span>
                  <b>Ekran kapanınca / başka uygulamaya geçince de okumaya devam et.</b> Bir kez seçersen her açılışta bu ayar geçerli kalır.
                </span>
              </label>
              {keepBackgroundAudio && (
                <div className="text-xs text-slate-700 bg-sky-50 border border-sky-200 rounded-lg p-3 leading-relaxed space-y-2">
                  <p className="font-bold">Android’de sesin kesilmemesi için (bir kere yap):</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Tarayıcının sağ üst ⋮ menüsünden <b>“Ana ekrana ekle / Uygulamayı yükle”</b> ile uygulamayı yükle ve oradan aç.</li>
                    <li>
                      Telefon <b>Ayarlar → Uygulamalar → Chrome (veya TRP Akademi) → Pil</b> bölümünde <b>“Kısıtlama yok / Sınırsız”</b> seç.
                      <a
                        href="intent://#Intent;action=android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS;end"
                        className="ml-2 inline-block px-2 py-0.5 rounded bg-sky-700 text-white font-bold"
                      >
                        Pil ayarını açmayı dene
                      </a>
                    </li>
                    <li><b>Ayarlar → Uygulamalar → Chrome → Bildirimler</b> açık olsun (kilit ekranı oynatma kontrolü için).</li>
                    <li>Okuma başladıktan sonra ekranı kilitle; bildirim çubuğunda oynatma kontrolü görünmeli.</li>
                  </ol>
                  <p className="text-slate-500">Bazı telefon markalarında (Xiaomi, Huawei, Samsung) “otomatik başlatma / uyku modu” ayrıca kapatılmalıdır.</p>
                </div>
              )}
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-800">Verilerimi taşı (telefon ↔ tablet)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Çözümlerin, Tekrar çöz / Kolay-Orta-Zor işaretlerin ve Eksiklerin bu cihazda saklanır. Başka cihaza geçmek için
                bir <b>Gmail</b> hesabın olsun: ilerleme dosyasını indir, kendine mail at, diğer cihazda mailden indirip yükle.
              </p>
              <div className="flex flex-wrap gap-2">
                <button onClick={download} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer">
                  <Download className="w-4 h-4" /> İlerlemeyi indir
                </button>
                <a href={mailto} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200">
                  <Mail className="w-4 h-4" /> Mail hazırla
                </a>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-700">Dosyadan yükle</div>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="imode" checked={mode === 'merge'} onChange={() => setMode('merge')} className="mt-1 accent-amber-600" />
                  <span><b>Birleştir</b> — bu cihazdaki ve dosyadaki veriyi ortak işle (tablet + telefon).</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="imode" checked={mode === 'overwrite'} onChange={() => setMode('overwrite')} className="mt-1 accent-amber-600" />
                  <span><b>Sadece dosyadaki veriyi kabul et</b> — bu cihazdakinin üzerine yaz.</span>
                </label>
                <input ref={fileRef} type="file" accept=".json,application/json" onChange={onFile} className="hidden" />
                <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-500 cursor-pointer">
                  <Upload className="w-4 h-4" /> Dosya seç
                </button>
              </div>
            </section>

            {msg && <p className="text-xs font-semibold text-emerald-700">{msg}</p>}

            <button onClick={() => setOpen(false)} className="w-full py-2.5 rounded-xl text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer">
              Çıkış (Kapat)
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
