import { useEffect, useState } from 'react';
import { DRIVE_API_KEY, LEGACY_PUBLIC_MEDIA } from '../config/links';
import { verifiedImageUrl } from './integrity';

/**
 * Ders paketleri (ses + resim): sunucu kotasını harcamamak için ağır medya, şifreli ".trp" paketleri olarak
 * Drive'da (veya herhangi bir adreste) durur. Kullanıcı bir kez indirir; paket cihazda (IndexedDB) saklanır,
 * içerik yalnızca çalınırken bellekte çözülür. Paket dosyası mp3/webp gibi doğrudan açılmaz.
 *
 * Biçim: "TRP1" | uint32 başlık uzunluğu | başlık JSON {id,ver,entries:[{n,m,o,l,iv}]} | AES-256-GCM şifreli parçalar.
 */
export interface PackInfo {
  id: string;
  kind: 'ses' | 'resim';
  course: string;
  title: string;
  ver: string;
  size: number;
  n: number;
  key: string;
  driveId?: string;
  url?: string;
}

interface Entry {
  n: string;
  m: string;
  o: number;
  l: number;
  iv: string;
}
interface Stored {
  id: string;
  ver: string;
  size: number;
  base: number;
  entries: Entry[];
  blob: Blob;
}

const base = (): string => {
  try {
    return (import.meta as any).env?.BASE_URL || './';
  } catch {
    return './';
  }
};

// ───────────── IndexedDB ─────────────
const DB = 'trp-packs';
const STORE = 'packs';
let dbp: Promise<IDBDatabase> | null = null;
const openDb = (): Promise<IDBDatabase> => {
  if (!dbp) {
    dbp = new Promise((res, rej) => {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: 'id' });
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  return dbp;
};
const tx = async <T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> => {
  const db = await openDb();
  return new Promise((res, rej) => {
    const r = fn(db.transaction(STORE, mode).objectStore(STORE));
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
};

// ───────────── bellek içi dizin ─────────────
const nameIndex = new Map<string, { pack: string; e: Entry }>();
const records = new Map<string, Stored>();
let ready: Promise<void> | null = null;
const notify = () => window.dispatchEvent(new Event('trp-packs'));

const indexRecord = (r: Stored) => {
  records.set(r.id, r);
  for (const e of r.entries) nameIndex.set(e.n, { pack: r.id, e });
};
const unindexPack = (id: string) => {
  records.delete(id);
  for (const [k, v] of nameIndex) if (v.pack === id) nameIndex.delete(k);
};

export const initPacks = (): Promise<void> => {
  if (!ready) {
    ready = (async () => {
      try {
        const all = await tx<Stored[]>('readonly', s => s.getAll());
        all.forEach(indexRecord);
      } catch {
        /* IndexedDB yoksa paket özelliği devre dışı */
      }
      notify();
    })();
  }
  return ready;
};

export const getInstalledVersion = (id: string): string | null => records.get(id)?.ver ?? null;
/** Eşzamanlı sorgu: bu medya yüklü bir pakette var mı? */
export const hasLocalMedia = (name: string): boolean => nameIndex.has(name);
/** Ses çalınabilir mi? (paket yüklüyse veya geçiş döneminde sitede dosya varsa) */
export const hasAudio = (audioId: string): boolean => LEGACY_PUBLIC_MEDIA || nameIndex.has(`a/${audioId}.mp3`);

// ───────────── manifest ─────────────
let manifestP: Promise<PackInfo[]> | null = null;
export const loadManifest = (force = false): Promise<PackInfo[]> => {
  if (!manifestP || force) {
    manifestP = fetch(`${base()}data/packs.json`, { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : { packs: [] }))
      .then(j => (j.packs || []) as PackInfo[])
      .catch(() => []);
  }
  return manifestP;
};

export const packUrl = (p: PackInfo): string | null => {
  if (p.url) return p.url;
  if (p.driveId) {
    return DRIVE_API_KEY
      ? `https://www.googleapis.com/drive/v3/files/${p.driveId}?alt=media&key=${DRIVE_API_KEY}`
      : `https://drive.google.com/uc?export=download&id=${p.driveId}`;
  }
  return null;
};

// ───────────── indirme / silme ─────────────
export const downloadPack = async (p: PackInfo, onProgress?: (frac: number) => void, signal?: AbortSignal): Promise<void> => {
  const url = packUrl(p);
  if (!url) throw new Error('Bu paket henüz yayınlanmadı.');
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`İndirme hatası (${res.status})`);
  const total = Number(res.headers.get('content-length')) || p.size;
  const chunks: Uint8Array[] = [];
  let got = 0;
  if (res.body) {
    const rd = res.body.getReader();
    for (;;) {
      const { done, value } = await rd.read();
      if (done) break;
      chunks.push(value);
      got += value.length;
      onProgress?.(Math.min(1, got / total));
    }
  } else {
    chunks.push(new Uint8Array(await res.arrayBuffer()));
  }
  const blob = new Blob(chunks as BlobPart[]);
  const head = new Uint8Array(await blob.slice(0, 8).arrayBuffer());
  if (String.fromCharCode(...head.slice(0, 4)) !== 'TRP1') throw new Error('Paket dosyası geçersiz (Drive paylaşımını ve bağlantıyı kontrol edin).');
  const hl = new DataView(head.buffer).getUint32(4, true);
  const header = JSON.parse(await blob.slice(8, 8 + hl).text());
  if (header.id !== p.id) throw new Error('Paket kimliği uyuşmuyor.');
  const rec: Stored = { id: p.id, ver: header.ver, size: blob.size, base: 8 + hl, entries: header.entries, blob };
  await tx('readwrite', s => s.put(rec));
  unindexPack(p.id);
  indexRecord(rec);
  try {
    await (navigator as any).storage?.persist?.();
  } catch {
    /* yoksay */
  }
  notify();
};

export const removePack = async (id: string): Promise<void> => {
  await tx('readwrite', s => s.delete(id));
  unindexPack(id);
  notify();
};

// ───────────── çözme ─────────────
const keyCache = new Map<string, CryptoKey>();
const getKey = async (p: PackInfo | undefined, packId: string): Promise<CryptoKey> => {
  let k = keyCache.get(packId);
  if (k) return k;
  const info = p || (await loadManifest()).find(x => x.id === packId);
  if (!info) throw new Error('Paket anahtarı yok');
  const raw = Uint8Array.from(atob(info.key), c => c.charCodeAt(0));
  k = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
  keyCache.set(packId, k);
  return k;
};

const urlCache = new Map<string, string>();
const MAX_URLS = 10;

/** Yüklü paketten medyayı çözüp geçici adres (blob:) döndürür; yoksa null. */
export const getMediaUrl = async (name: string): Promise<string | null> => {
  await initPacks();
  const hit = urlCache.get(name);
  if (hit) return hit;
  const ref = nameIndex.get(name);
  if (!ref) return null;
  const rec = records.get(ref.pack);
  if (!rec) return null;
  try {
    const key = await getKey(undefined, ref.pack);
    const enc = await rec.blob.slice(rec.base + ref.e.o, rec.base + ref.e.o + ref.e.l).arrayBuffer();
    const iv = Uint8Array.from(atob(ref.e.iv), c => c.charCodeAt(0));
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, enc);
    const u = URL.createObjectURL(new Blob([plain], { type: ref.e.m }));
    urlCache.set(name, u);
    if (urlCache.size > MAX_URLS) {
      const first = urlCache.keys().next().value as string;
      URL.revokeObjectURL(urlCache.get(first)!);
      urlCache.delete(first);
    }
    return u;
  } catch {
    return null;
  }
};

/** Ses için çalınabilir adres: paketten, yoksa (geçiş döneminde) sitedeki dosya. */
export const getAudioSrc = async (audioId: string): Promise<string | null> => {
  const u = await getMediaUrl(`a/${audioId}.mp3`);
  if (u) return u;
  return LEGACY_PUBLIC_MEDIA ? `${base()}audio/${audioId}.mp3` : null;
};

// ───────────── React ─────────────
export const usePackVersion = (): number => {
  const [v, setV] = useState(0);
  useEffect(() => {
    initPacks();
    const h = () => setV(x => x + 1);
    window.addEventListener('trp-packs', h);
    return () => window.removeEventListener('trp-packs', h);
  }, []);
  return v;
};

/** Resim için adres: paket varsa paketten; yoksa (geçiş döneminde) site adresi; hiçbiri yoksa null. */
export const useImageSrc = (file: string, enabled: boolean): { src: string | null; local: boolean } => {
  const tick = usePackVersion();
  const [src, setSrc] = useState<string | null>(null);
  const local = hasLocalMedia(`i/${file}`);
  useEffect(() => {
    let alive = true;
    if (!enabled && !local) {
      setSrc(null);
      return;
    }
    getMediaUrl(`i/${file}`).then(u => {
      if (!alive) return;
      if (u) return setSrc(u);
      if (!LEGACY_PUBLIC_MEDIA) return setSrc(null);
      // siteden gelen resim: imzalı özetiyle doğrulanır, doğrulanamazsa gösterilmez
      verifiedImageUrl(file).then(v => alive && setSrc(v)).catch(() => alive && setSrc(null));
    });
    return () => {
      alive = false;
    };
  }, [file, enabled, local, tick]);
  return { src, local };
};
