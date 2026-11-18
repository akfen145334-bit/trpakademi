import React, { useEffect, useRef, useState } from 'react';
import { Download, Trash2, RefreshCw, Check } from 'lucide-react';
import { PackInfo, loadManifest, downloadPack, removePack, getInstalledVersion, packUrl, usePackVersion, initPacks } from '../services/packService';

import { initIntegrity, getSignState, getSignedDate, subscribeSign } from '../services/integrity';

const mb =(n: number) => (n / 1048576).toFixed(1) + ' MB';

/** Ayarlar → Ders paketleri: ses ve resim paketlerini indir / güncelle / sil. */
export const PackManager: React.FC = () => {
  usePackVersion();
  const [signState, setSignState] = useState(getSignState());
  useEffect(() => {
    initIntegrity().then(setSignState);
    const off = subscribeSign(() => setSignState(getSignState()));
    return () => {
      off();
    };
  }, []);
  const [packs, setPacks] = useState<PackInfo[]>([]);
  const [prog, setProg] = useState<Record<string, number>>({});
  const [err, setErr] = useState('');
  const [est, setEst] = useState('');
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    initPacks();
    loadManifest().then(setPacks);
    (navigator as any).storage?.estimate?.().then((e: any) => e && e.quota && setEst(`Cihaz depolaması: ${mb(e.usage || 0)} kullanılıyor`)).catch(() => {});
  }, []);

  const run = async (p: PackInfo) => {
    setErr('');
    setProg(x => ({ ...x, [p.id]: 0.001 }));
    try {
      abort.current = new AbortController();
      await downloadPack(p, f => setProg(x => ({ ...x, [p.id]: f })), abort.current.signal);
    } catch (e: any) {
      setErr(`${p.title}: ${e?.message || 'indirilemedi'}`);
    } finally {
      setProg(x => {
        const n = { ...x };
        delete n[p.id];
        return n;
      });
    }
  };

  const all = async (kind: 'ses' | 'resim') => {
    const todo = packs.filter(p => p.kind === kind && packUrl(p) && getInstalledVersion(p.id) !== p.ver);
    if (!todo.length) return;
    const total = todo.reduce((a, p) => a + p.size, 0);
    if (!window.confirm(`${todo.length} paket, toplam ${mb(total)} indirilecek. Mobil veri kullanıyorsan Wi-Fi'ye bağlanman önerilir. Devam edilsin mi?`)) return;
    for (const p of todo) await run(p);
  };

  const ready = packs.filter(p => packUrl(p));

  return (
    <section className="space-y-3">
      <h3 className="font-bold text-slate-800">Ders paketleri (ses ve resim)</h3>
      <p className="text-xs text-slate-600 leading-relaxed">
        Ses ve resimler büyük olduğu için uygulamayla birlikte gelmez; istediğin dersin paketini bir kez indirirsin, sonra internet harcamadan çalışır. Paketler uygulamanın dışında açılamayan özel biçimdedir.
      </p>
      {packs.length === 0 ? (
        <p className="text-xs text-slate-500">Paket listesi yüklenemedi.</p>
      ) : ready.length === 0 ? (
        <p className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600">Paketler henüz yayınlanmadı. Şimdilik ses ve resimler doğrudan siteden akar.</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => all('ses')} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 cursor-pointer">Tüm sesleri indir</button>
            <button onClick={() => all('resim')} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">Tüm resimleri indir</button>
          </div>
          <ul className="space-y-1.5">
            {packs.map(p => {
              const inst = getInstalledVersion(p.id);
              const f = prog[p.id];
              const avail = !!packUrl(p);
              const update = inst && inst !== p.ver;
              return (
                <li key={p.id} className="flex items-center justify-between gap-2 text-xs border border-slate-200 rounded-lg px-2.5 py-2">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 truncate">{p.title}</div>
                    <div className="text-slate-500">
                      {mb(p.size)} · {p.n} dosya
                      {inst && !update && (
                        <span className="text-emerald-700 font-bold"> · <Check className="inline w-3 h-3" /> indirildi</span>
                      )}
                      {update && <span className="text-amber-700 font-bold"> · güncelleme var</span>}
                      {!avail && <span> · yakında</span>}
                    </div>
                    {f !== undefined && (
                      <div className="mt-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${Math.round(f * 100)}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {avail && f === undefined && (!inst || update) && (
                      <button onClick={() => run(p)} aria-label="İndir" className="p-1.5 rounded-md bg-amber-100 text-amber-900 hover:bg-amber-200 cursor-pointer">
                        {update ? <RefreshCw className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                      </button>
                    )}
                    {inst && f === undefined && (
                      <button onClick={() => removePack(p.id)} aria-label="Sil" className="p-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-700 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
      {est && <p className="text-[11px] text-slate-400">{est}</p>}
      <p className={`text-[11px] ${signState === 'bad' ? 'text-red-700 font-bold' : 'text-slate-400'}`}>
        {signState === 'ok' && `Dijital imza: doğrulandı (${getSignedDate()}). Ders, soru ve resim verileri imzalıdır.`}
        {signState === 'bad' && 'Dijital imza GEÇERSİZ: veriler değiştirilmiş olabilir. Lütfen resmî adresten tekrar aç.'}
        {signState === 'none' && 'Dijital imza bu tarayıcıda doğrulanamadı.'}
        {signState === 'checking' && 'Dijital imza denetleniyor…'}
      </p>
      {err && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-2">{err}</p>}
    </section>
  );
};
