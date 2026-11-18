import { useEffect, useState } from 'react';
import { fetchVerified } from './integrity';

/** Konu anlatımına eklenen temsili görseller. Veri tasarrufu için: dizin tek küçük dosya, resimler sadece istenince (veya ayara göre) yüklenir. */
export interface TopicImage {
  /** bağlı olduğu konu anlatımı cümle kimliği */
  s: number;
  /** dosya adı (public/data/img/<f>) */
  f: string;
  /** kısa başlık */
  c: string;
  /** yaklaşık boyut (KB) */
  k?: number;
}

const base = (): string => {
  try {
    return (import.meta as any).env?.BASE_URL || './';
  } catch {
    return './';
  }
};

let indexPromise: Promise<Record<string, TopicImage[]>> | null = null;
const loadIndex = () => {
  if (!indexPromise) {
    indexPromise = fetchVerified('data/img/index.json', `${base()}data/img/index.json`, true)
      .then(b => JSON.parse(new TextDecoder().decode(b)))
      .catch(() => ({}));
  }
  return indexPromise;
};

export const imageUrl = (f: string) => `${base()}data/img/${f}`;

export type ImageMode = 'tap' | 'auto' | 'off';
const KEY = 'trp_img_mode';
export const getImageMode = (): ImageMode => {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'tap' || v === 'auto' || v === 'off') return v;
  } catch {
    /* yoksay */
  }
  // varsayılan: dokunarak yükle (en az veri); veri tasarrufu açıksa hep böyle
  return 'tap';
};
export const setImageMode = (m: ImageMode) => {
  try {
    localStorage.setItem(KEY, m);
  } catch {
    /* yoksay */
  }
  window.dispatchEvent(new Event('trp-img-mode'));
};

export const useImageMode = (): ImageMode => {
  const [m, setM] = useState<ImageMode>(getImageMode());
  useEffect(() => {
    const h = () => setM(getImageMode());
    window.addEventListener('trp-img-mode', h);
    return () => window.removeEventListener('trp-img-mode', h);
  }, []);
  return m;
};

export const useSubtopicImages = (subtopicId: string): TopicImage[] => {
  const [list, setList] = useState<TopicImage[]>([]);
  useEffect(() => {
    let alive = true;
    loadIndex().then(idx => alive && setList(idx[subtopicId] || []));
    return () => {
      alive = false;
    };
  }, [subtopicId]);
  return list;
};
