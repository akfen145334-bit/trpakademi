import React, { useState } from 'react';
import { Image as ImageIcon, Download } from 'lucide-react';
import { TopicImage, useImageMode } from '../services/imageService';
import { useImageSrc, hasLocalMedia } from '../services/packService';
import { LEGACY_PUBLIC_MEDIA } from '../config/links';

export const TopicFigure: React.FC<{ img: TopicImage }> = ({ img }) => {
  const mode = useImageMode();
  const [shown, setShown] = useState(false);
  // yerel pakette varsa veri harcanmaz: doğrudan göster
  const local = hasLocalMedia(`i/${img.f}`);
  const wantShow = mode === 'auto' || shown || local;
  const { src } = useImageSrc(img.f, wantShow);
  if (mode === 'off') return null;
  return (
    <figure className="my-4 mx-auto max-w-2xl">
      {wantShow && src ? (
        <img
          src={src}
          alt={`${img.c} (temsili resim)`}
          loading="lazy"
          decoding="async"
          draggable={false}
          onContextMenu={e => e.preventDefault()}
          className="w-full rounded-xl border border-slate-200 shadow-xs"
        />
      ) : !LEGACY_PUBLIC_MEDIA && !local ? (
        <div className="w-full flex items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold text-center px-3">
          <Download className="w-5 h-5 shrink-0" /> {img.c} — resim paketi indirilmemiş (Ayarlar → Ders paketleri)
        </div>
      ) : (
        <button
          onClick={() => setShown(true)}
          className="w-full flex items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 text-amber-900 text-sm font-bold hover:bg-amber-100 cursor-pointer"
        >
          <ImageIcon className="w-5 h-5" /> {img.c} — görseli göster{img.k ? ` (~${img.k} KB)` : ''}
        </button>
      )}
      <figcaption className="mt-1.5 text-center text-xs text-slate-500">
        <b>{img.c}</b> — Temsili resimdir.
      </figcaption>
    </figure>
  );
};
