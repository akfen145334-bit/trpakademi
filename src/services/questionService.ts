import { Question } from '../types';
import { QPACK_VERSION } from '../data/qpackVersion';

/** public/data/q/<dersId>.json içindeki sıkıştırılmış kayıt */
interface Row {
  id: string;
  s: string; // alt başlık
  b: 0 | 1; // 1 = Mutlaka Bil sorusu
  q: string;
  o: string[];
  c: number;
  e: string;
  d: 0 | 1 | 2;
  t?: string;
  k?: number[];
  v?: 0 | 1;
  h?: string;
}

const baseUrl = (): string => {
  try {
    return (import.meta as any).env?.BASE_URL || './';
  } catch {
    return './';
  }
};

const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const DIFF_OLD: Array<'temel' | 'orta' | 'ileri'> = ['temel', 'orta', 'ileri'];

/** Bir dersin yeni soru havuzunu alt başlık kimliğine göre gruplayarak getirir. */
export async function fetchCourseQuestions(courseId: string): Promise<Record<string, Question[]>> {
  const res = await fetch(`${baseUrl()}data/q/${courseId}.json?v=${QPACK_VERSION}`);
  if (!res.ok) throw new Error('Soru dosyası alınamadı: ' + courseId);
  const rows: Row[] = await res.json();
  const out: Record<string, Question[]> = {};
  for (const r of rows) {
    const q: Question = {
      id: r.id,
      subtopicId: r.s,
      courseId,
      questionText: r.q,
      options: r.o.map((o, i) => `${LETTERS[i]}) ${o}`),
      correctIndex: r.c,
      explanation: r.e,
      difficulty: DIFF_OLD[r.d],
      diff: r.d,
      part: r.b ? 'mb' : 'konu',
      k: r.k,
      kid: r.id,
      sig: r.h,
      verified: !!r.v
    };
    (out[r.s] ||= []).push(q);
  }
  return out;
}
