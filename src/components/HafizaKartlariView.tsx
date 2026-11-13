import React from 'react';
import { useApp } from '../context/AppContext';
import { HAFIZA_KARTLARI, HafizaKart } from '../data/hafizaKartlari';
import { Brain, ArrowLeft, ChevronRight, Search, Eye, EyeOff, Lightbulb, Clapperboard } from 'lucide-react';

const ANA_STIL: Record<string, { emoji: string; grad: string }> = {
  'Sanat Tarihi': { emoji: '🏛️', grad: 'from-sky-600 to-indigo-700' },
  'Anadolu Medeniyetleri': { emoji: '🏺', grad: 'from-amber-600 to-orange-700' },
  Arkeoloji: { emoji: '⛏️', grad: 'from-stone-600 to-amber-800' },
  'Genel Türk Tarihi ve Kültürü': { emoji: '🐎', grad: 'from-rose-600 to-red-800' },
  'Mitoloji & Dinler Tarihi': { emoji: '⚡', grad: 'from-violet-600 to-purple-800' },
  "Türkiye'nin Turizm Coğrafyası": { emoji: '🗺️', grad: 'from-emerald-600 to-teal-800' },
  'Turist Rehberliği Mevzuatı ve Etiği': { emoji: '⚖️', grad: 'from-slate-600 to-slate-800' },
  'Genel Sağlık Bilgisi ve İlk Yardım': { emoji: '⛑️', grad: 'from-red-600 to-rose-800' },
  'İletişim ve Rehberlik Becerileri': { emoji: '💬', grad: 'from-cyan-600 to-blue-800' },
  'Güncel Turizm ve Miras': { emoji: '🌍', grad: 'from-lime-600 to-green-800' }
};
const stilOf = (ana: string) => ANA_STIL[ana] || { emoji: '🧠', grad: 'from-amber-600 to-orange-700' };

const baseUrl = (): string => {
  try {
    return (import.meta as any).env?.BASE_URL || './';
  } catch {
    return './';
  }
};

/** Önce görsel: public/hafiza/<ID>.webp|jpg|png varsa onu, yoksa sahne canlandırmasını gösterir. */
const KartGorseli: React.FC<{ kart: HafizaKart }> = ({ kart }) => {
  const exts = ['webp', 'jpg', 'png'];
  const [k, setK] = React.useState(0);
  const stil = stilOf(kart.ana);
  React.useEffect(() => setK(0), [kart.id]);

  return (
    <div className="space-y-3">
      {k < exts.length && (
        <img
          src={`${baseUrl()}hafiza/${kart.id}.${exts[k]}`}
          alt={kart.ad}
          onError={() => setK(k + 1)}
          className="w-full rounded-2xl border border-slate-200 object-cover"
        />
      )}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stil.grad} text-white p-5 sm:p-6 shadow-md`}>
        <div className="absolute -right-4 -top-6 text-[110px] sm:text-[140px] opacity-20 select-none leading-none" aria-hidden>
          {stil.emoji}
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-white/80">
            <Clapperboard className="w-4 h-4" /> Görsel Sahne · gözünün önüne getir
          </div>
          <p className="mt-2 text-base sm:text-lg leading-relaxed font-medium">{sahneVurgula(kart.sahne)}</p>
        </div>
      </div>
    </div>
  );
};

/** Büyük harfle yazılmış ipuçlarını (ör. "ANda") kalın göster */
const sahneVurgula = (t: string): React.ReactNode =>
  t.split(/(\b[A-ZÇĞİÖŞÜ]{3,}[a-zçğıöşü]*\b)/g).map((p, i) =>
    /^[A-ZÇĞİÖŞÜ]{3,}/.test(p) ? (
      <strong key={i} className="font-black underline decoration-white/60 underline-offset-2">
        {p}
      </strong>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    )
  );

const etiket = (e: string) => {
  const s = e.replace(/_/g, ' ').trim();
  return s.charAt(0).toLocaleUpperCase('tr') + s.slice(1);
};

const FilmSorusu: React.FC<{ s: string; c: string; n: number }> = ({ s, c, n }) => {
  const [acik, setAcik] = React.useState(false);
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex gap-3">
        <span className="shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">{n}</span>
        <div className="flex-1">
          <p className="font-semibold text-slate-900 leading-snug">{s}</p>
          {acik ? (
            <p className="mt-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-emerald-900 font-medium">{c}</p>
          ) : null}
          <button
            onClick={() => setAcik(!acik)}
            className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            {acik ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {acik ? 'Cevabı gizle' : 'Cevabı göster'}
          </button>
        </div>
      </div>
    </li>
  );
};

export const HafizaKartlariView: React.FC = () => {
  const { hkSelection, goToHafiza } = useApp();
  const [ara, setAra] = React.useState('');

  // ───────── Kart sayfası ─────────
  const kart = hkSelection ? HAFIZA_KARTLARI.find(k => k.id === hkSelection) : null;
  if (kart) {
    const idx = HAFIZA_KARTLARI.findIndex(k => k.id === kart.id);
    const prev = idx > 0 ? HAFIZA_KARTLARI[idx - 1] : null;
    const next = idx < HAFIZA_KARTLARI.length - 1 ? HAFIZA_KARTLARI[idx + 1] : null;
    return (
      <div className="space-y-5 pb-24 md:pb-6">
        <button
          onClick={() => goToHafiza()}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Hafıza kartları listesi
        </button>

        <div>
          <p className="text-xs font-bold text-slate-500">
            {kart.ana} › {kart.alt}
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{kart.ad}</h2>
        </div>

        {/* 1) Görsel */}
        <KartGorseli kart={kart} />

        {/* 2) Açıklama: hafıza kodlaması */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <h3 className="flex items-center gap-2 font-extrabold text-slate-900">
            <Brain className="w-5 h-5 text-amber-600" /> Hafıza kodlaması
          </h3>
          <ul className="mt-3 space-y-2.5">
            {kart.kod.map((x, i) => (
              <li key={i} className="rounded-xl bg-amber-50/70 border border-amber-200 p-3">
                <span className="block text-[11px] font-black uppercase tracking-wide text-amber-800">{etiket(x.e)}</span>
                <span className="block mt-0.5 text-slate-800 leading-relaxed">{x.m}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 3) Sınav çapası */}
        <section className="rounded-2xl border-l-4 border-rose-500 bg-rose-50 p-4 sm:p-5">
          <h3 className="flex items-center gap-2 font-extrabold text-rose-900">
            <Lightbulb className="w-5 h-5" /> Sınav çapası
          </h3>
          <p className="mt-2 text-slate-800 leading-relaxed font-medium">{kart.capa}</p>
        </section>

        {/* 4) Kendini dene */}
        <section>
          <h3 className="font-extrabold text-slate-900 mb-3">🎬 Filmi geri sar · kendini dene</h3>
          <ol className="space-y-3">
            {kart.film.map((f, i) => (
              <FilmSorusu key={kart.id + i} s={f.s} c={f.c} n={i + 1} />
            ))}
          </ol>
        </section>

        <div className="flex items-center justify-between gap-3 pt-2">
          {prev ? (
            <button
              onClick={() => goToHafiza(prev.id)}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 cursor-pointer text-left"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" /> {prev.ad}
            </button>
          ) : (
            <span />
          )}
          {next ? (
            <button
              onClick={() => goToHafiza(next.id)}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 cursor-pointer text-right"
            >
              {next.ad} <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    );
  }

  // ───────── Ana ve alt başlıklara göre liste ─────────
  const q = ara.trim().toLocaleLowerCase('tr');
  const eslesen = HAFIZA_KARTLARI.filter(
    k => !q || (k.ad + ' ' + k.alt + ' ' + k.ana + ' ' + k.kod.map(x => x.m).join(' ')).toLocaleLowerCase('tr').includes(q)
  );
  const anaListesi = [...new Set(eslesen.map(k => k.ana))];

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <div className="rounded-2xl bg-gradient-to-br from-fuchsia-600 to-indigo-700 text-white p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-fuchsia-100">
          <Brain className="w-4 h-4" /> Hafıza Teknikleriyle Öğren
        </div>
        <h1 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight">Hafıza Kartları</h1>
        <p className="mt-2 text-sm sm:text-base text-fuchsia-50 leading-relaxed max-w-2xl">
          {HAFIZA_KARTLARI.length} kart: önce gözünün önüne getireceğin bir sahne, sonra hafıza kodlaması ve sınav çapası,
          en sonda "filmi geri sar" ile kendini dene. Ana ve alt başlıklara göre ilgili karta ulaş.
        </p>
      </div>

      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          value={ara}
          onChange={e => setAra(e.target.value)}
          placeholder="Kart veya konu ara (örn: Hitit, Doxey, CPR)"
          className="flex-1 min-w-0 bg-transparent outline-none text-sm"
        />
      </label>

      {anaListesi.length === 0 && <p className="text-sm text-slate-500 italic">Aramana uyan kart bulunamadı.</p>}

      {anaListesi.map(ana => {
        const stil = stilOf(ana);
        const kartlar = eslesen.filter(k => k.ana === ana);
        const altlar = [...new Set(kartlar.map(k => k.alt))];
        return (
          <section key={ana} className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className={`bg-gradient-to-r ${stil.grad} text-white px-4 sm:px-5 py-3 flex items-center gap-3`}>
              <span className="text-2xl" aria-hidden>
                {stil.emoji}
              </span>
              <div>
                <h3 className="font-extrabold text-lg leading-tight">{ana}</h3>
                <p className="text-xs text-white/80">
                  {altlar.length} alt başlık · {kartlar.length} kart
                </p>
              </div>
            </div>
            <div className="p-3 sm:p-4 space-y-4">
              {altlar.map(alt => (
                <div key={alt}>
                  <h4 className="text-sm font-extrabold text-slate-700 mb-2">{alt}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {kartlar
                      .filter(k => k.alt === alt)
                      .map(k => (
                        <button
                          key={k.id}
                          onClick={() => goToHafiza(k.id)}
                          className="flex items-center justify-between gap-2 text-left rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 p-3 transition cursor-pointer"
                        >
                          <span className="min-w-0">
                            <span className="block text-[11px] font-mono font-bold text-slate-400">{k.id}</span>
                            <span className="block font-semibold text-slate-900 leading-snug break-words">{k.ad}</span>
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
