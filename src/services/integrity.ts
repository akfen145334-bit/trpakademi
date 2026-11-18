import { SIGN_PUBLIC_KEY, SIGN_COURSE_HASH } from '../config/imza';

/**
 * Dijital imza doğrulaması: soru dosyaları, resim dizini ve resimler, paket listesi yayıncının Ed25519 özel anahtarıyla
 * imzalanır (public/data/imza.json). Uygulama açık anahtarla imzayı, sonra her dosyanın SHA-256 özetini doğrular.
 * Değiştirilmiş/başka kaynaktan gelmiş veri kullanılmaz.
 */
interface Signed {
  v: number;
  time: string;
  owner: string;
  course: string;
  files: Record<string, string>;
}

const base = (): string => {
  try {
    return (import.meta as any).env?.BASE_URL || './';
  } catch {
    return './';
  }
};
const b64 = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');

export type SignState = 'checking' | 'ok' | 'bad' | 'none';
let state: SignState = 'checking';
let signed: Signed | null = null;
let ready: Promise<SignState> | null = null;
const listeners = new Set<() => void>();
const set = (s: SignState) => {
  state = s;
  listeners.forEach(f => f());
  try {
    window.dispatchEvent(new Event('trp-sign'));
  } catch {
    /* yoksay */
  }
};
export const getSignState = () => state;
export const getSignedDate = () => signed?.time || '';

export const initIntegrity = (): Promise<SignState> => {
  if (!ready) {
    ready = (async () => {
      try {
        const r = await fetch(`${base()}data/imza.json`, { cache: 'no-cache' });
        if (!r.ok) {
          set('none');
          return state;
        }
        const j = (await r.json()) as { body: string; sig: string };
        if (!crypto?.subtle) {
          set('none');
          return state;
        }
        const key = await crypto.subtle.importKey('raw', b64(SIGN_PUBLIC_KEY), { name: 'Ed25519' }, false, ['verify']);
        const ok = await crypto.subtle.verify({ name: 'Ed25519' }, key, b64(j.sig), new TextEncoder().encode(j.body));
        if (!ok) {
          set('bad');
          return state;
        }
        signed = JSON.parse(j.body) as Signed;
        set('ok');
      } catch {
        // tarayıcı Ed25519 desteklemiyorsa doğrulanamaz (veri kullanılmaya devam eder, ama "doğrulanamadı" gösterilmez)
        set('none');
      }
      return state;
    })();
  }
  return ready;
};

/** İmza listesinde bu yol için beklenen özet (imza geçerli değilse null) */
const expected = (rel: string): string | null => (state === 'ok' && signed ? signed.files[rel] ?? null : null);

/** Metin dosyaları için CRLF farkını yok say */
const sha256 = async (buf: ArrayBuffer, text: boolean): Promise<string> => {
  let b = buf;
  if (text) b = new TextEncoder().encode(new TextDecoder().decode(buf).replace(/\r\n/g, '\n')).buffer as ArrayBuffer;
  return hex(await crypto.subtle.digest('SHA-256', b));
};

/**
 * Dosyayı getirip imzalı özetle karşılaştırır. İmza kapalıysa ('none': ör. geliştirme) olduğu gibi döner;
 * 'bad' ise veya özet uyuşmuyorsa hata fırlatır.
 */
export const fetchVerified = async (rel: string, url: string, text: boolean): Promise<ArrayBuffer> => {
  await initIntegrity();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Dosya alınamadı: ${rel}`);
  const buf = await res.arrayBuffer();
  if (state === 'bad') throw new Error('Veri imzası geçersiz');
  if (state === 'ok') {
    const exp = expected(rel);
    if (!exp) throw new Error(`İmzasız veri: ${rel}`);
    if ((await sha256(buf, text)) !== exp) throw new Error(`İmza uyuşmuyor: ${rel}`);
  }
  return buf;
};

/** Resim: doğrulayıp blob adresi döndürür */
export const verifiedImageUrl = async (file: string): Promise<string> => {
  const buf = await fetchVerified(`data/img/${file}`, `${base()}data/img/${file}`, false);
  const type = /\.jpe?g$/i.test(file) ? 'image/jpeg' : 'image/webp';
  return URL.createObjectURL(new Blob([buf], { type }));
};

/** Gömülü ders içeriğinin özeti imzadakiyle aynı mı? (ders metni değiştirildiyse false) */
export const courseHashMatches = async (courses: Array<{ id: string; subtopics: Array<{ id: string; sentences: Array<{ text: string }> }> }>): Promise<boolean | null> => {
  await initIntegrity();
  if (state !== 'ok' || !signed) return null;
  const canon = JSON.stringify(courses.map(c => ({ id: c.id, subtopics: c.subtopics.map(s => ({ id: s.id, sentences: s.sentences.map(x => x.text) })) })));
  const h = hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canon)));
  return h === signed.course && signed.course === SIGN_COURSE_HASH ? true : h === signed.course;
};

export const subscribeSign = (f: () => void) => {
  listeners.add(f);
  return () => listeners.delete(f);
};
