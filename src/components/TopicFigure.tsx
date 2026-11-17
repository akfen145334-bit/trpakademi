import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { TopicImage, imageUrl, useImageMode } from '../services/imageService';

export const TopicFigure: React.FC<{ img: TopicImage }> = ({ img }) => {
  const mode = useImageMode();
  const [shown, setShown] = useState(false);
  if (mode === 'off') return null;
  const show = mode === 'auto' || shown;
  return (
    <figure className="my-4 mx-auto max-w-2xl">
      {show ? (
        <img
          src={imageUrl(img.f)}
          alt={`${img.c} (temsili resim)`}
          loading="lazy"
          decoding="async"
          draggable={false}
          onContextMenu={e => e.preventDefault()}
          className="w-full rounded-xl border border-slate-200 shadow-xs"
        />
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
