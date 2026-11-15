import { Question } from '../types';

interface Item {
  question: Question;
  courseTitle: string;
  subtopicTitle: string;
  userSelected?: number;
}

const esc = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Eksiklerim kitabı için tahmini sayfa sayısı: 1 kapak/içindekiler + sayfa başına ~14 bilgi */
export const eksiklerimPageEstimate = (infoCount: number) => (infoCount === 0 ? 0 : 1 + Math.ceil(infoCount / 14));

/**
 * ÜCRETLİ "Tüm eksiklerimden PDF kitap": ücretsiz kısım yalnızca ilk sayfadır
 * (ders/alt başlık listesi + bilgi sayıları + ücret uyarısı). Tam kitap yalnızca ödeme sonrası açılır;
 * ödeme sistemi bağlanana dek tam sürüm üretilmez (PAYWALL_ENABLED bayrağından bağımsız).
 */
export function exportEksiklerimTeaserPdf(
  rows: { course: string; subtopics: { title: string; infoCount: number }[] }[],
  priceText: string
): boolean {
  const w = window.open('', '_blank');
  if (!w) return false;
  const date = new Date().toLocaleDateString('tr-TR');
  const total = rows.reduce((n, r) => n + r.subtopics.reduce((m, s) => m + s.infoCount, 0), 0);
  const pages = eksiklerimPageEstimate(total);
  const body = rows
    .map(
      r =>
        `<h2>${esc(r.course)} <small>(${r.subtopics.reduce((m, s) => m + s.infoCount, 0)} bilgi)</small></h2><ul>${r.subtopics
          .map(s => `<li>${esc(s.title)} <span>${s.infoCount} bilgi</span></li>`)
          .join('')}</ul>`
    )
    .join('');
  w.document.write(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Eksiklerim Kitabı – 1. sayfa</title>
<style>
body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:24px;line-height:1.45}
h1{font-size:24px;margin:0}h2{font-size:15px;margin:16px 0 4px}h2 small{color:#666;font-weight:normal}
.sub{color:#555;font-size:12px;margin-bottom:12px}ul{list-style:none;padding:0;margin:0}
li{font-size:13px;padding:2px 0;border-bottom:1px dotted #ccc;display:flex;justify-content:space-between}
.box{margin-top:22px;border:2px solid #b45309;background:#fffbeb;border-radius:8px;padding:12px;font-size:14px}
@media print{body{margin:10mm}}
</style></head><body>
<h1>Eksiklerim Kitabı</h1>
<div class="sub">TRP Akademi · ${date} · Toplam ${total} eksik bilgi · tahmini ${pages} sayfa</div>
${body || '<p>Henüz eksik bilgi yok.</p>'}
<div class="box"><b>Bu, kitabın yalnızca 1. sayfasıdır.</b><br>Tamamını PDF olarak indirmek için ${esc(priceText)} ücretini yatırınız.</div>
<script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script>
</body></html>`);
  w.document.close();
  return true;
}

/**
 * "Eksiklerimi PDF al": yanlış cevaplanan sorular + zayıf konular için yazdırılabilir föy açar.
 * Tarayıcının yazdır penceresinde "PDF olarak kaydet" seçilir (ek kütüphane gerekmez).
 */
export function exportEksiklerimPdf(items: Item[], weakTopics: { course: string; subtopic: string }[]): boolean {
  const w = window.open('', '_blank');
  if (!w) return false;
  const date = new Date().toLocaleDateString('tr-TR');
  const qHtml = items
    .map((it, i) => {
      const opts = it.question.options
        .map((o, oi) => {
          const cls = oi === it.question.correctIndex ? 'ok' : oi === it.userSelected ? 'bad' : '';
          const tag = oi === it.question.correctIndex ? ' ✓ Doğru' : oi === it.userSelected ? ' ✗ Senin cevabın' : '';
          return `<li class="${cls}"><b>${String.fromCharCode(65 + oi)})</b> ${esc(o.replace(/^[A-E]\)\s*/, ''))}${tag}</li>`;
        })
        .join('');
      return `<section class="q"><div class="meta">${esc(it.courseTitle)} / ${esc(it.subtopicTitle)}</div>
<p class="qt"><b>${i + 1}.</b> ${esc(it.question.questionText)}</p><ul>${opts}</ul>
${it.question.explanation ? `<p class="ex"><b>Açıklama:</b> ${esc(it.question.explanation)}</p>` : ''}</section>`;
    })
    .join('');
  const wHtml = weakTopics.length
    ? `<h2>Tekrar edilecek konular</h2><ul class="topics">${weakTopics
        .map(t => `<li>${esc(t.course)} — ${esc(t.subtopic)}</li>`)
        .join('')}</ul>`
    : '';
  w.document.write(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Eksiklerim – TRP Akademi</title>
<style>
body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:24px;line-height:1.45}
h1{font-size:22px;margin:0}h2{font-size:17px;margin:22px 0 8px}.sub{color:#555;font-size:12px;margin-bottom:14px}
.q{border:1px solid #ccc;border-radius:8px;padding:10px 12px;margin:10px 0;page-break-inside:avoid}
.meta{font-size:11px;color:#666}.qt{margin:6px 0;font-size:14px}ul{list-style:none;padding:0;margin:6px 0}
li{font-size:13px;padding:2px 0}li.ok{color:#047857;font-weight:bold}li.bad{color:#be123c;text-decoration:line-through}
.ex{font-size:12px;background:#f4f4f5;padding:6px 8px;border-radius:6px}.topics li{font-size:13px;list-style:disc;margin-left:18px}
@media print{body{margin:10mm}}
</style></head><body>
<h1>Eksiklerim – Çalışma Föyü</h1>
<div class="sub">TRP Akademi · ${date} · ${items.length} yanlış soru · ${weakTopics.length} tekrar konusu</div>
${qHtml || '<p>Yanlış cevaplanan soru yok.</p>'}${wHtml}
<script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script>
</body></html>`);
  w.document.close();
  return true;
}
