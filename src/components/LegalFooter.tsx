import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LEGAL_DOCS, LEGAL_DRAFT_NOTICE } from '../data/legal';

/** Sayfa altı bağlantıları + yasal metin penceresi (taslak uyarılı). */
export const LegalFooter: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null);
  const doc = LEGAL_DOCS.find(d => d.id === open);
  return (
    <footer className="mt-8 border-t border-slate-200 bg-white/60 px-4 py-4 text-center text-xs text-slate-500">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {LEGAL_DOCS.map(d => (
          <button key={d.id} onClick={() => setOpen(d.id)} className="underline hover:text-slate-800 cursor-pointer">
            {d.title.split(' ve ')[0]}
          </button>
        ))}
      </div>
      <p className="mt-2">TRP Akademi bağımsız bir çalışma yardımcısıdır; resmî kurumlarla bağlantısı yoktur.</p>

      {doc && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(null)}>
          <div
            className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-5 text-left shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-extrabold text-slate-900">{doc.title}</h3>
              <button onClick={() => setOpen(null)} aria-label="Kapat" className="p-1 text-slate-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-2 rounded-lg bg-amber-50 border border-amber-300 p-2 text-[11px] font-bold text-amber-900">
              {LEGAL_DRAFT_NOTICE}
            </p>
            <div className="mt-3 space-y-3 text-sm text-slate-700 leading-relaxed">
              {doc.paragraphs.map((p, i) => (
                <div key={i}>
                  {p.h && <div className="font-bold text-slate-900">{p.h}</div>}
                  <p>{p.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
