import React, { useState } from 'react';
import { UserRound, X, Mail, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TIER_LABEL } from '../config/plans';

/** Giriş/Üyelik düğmesi. Supabase ayarlı değilse hiç görünmez. */
export const AccountButton: React.FC = () => {
  const { enabled, user, tier, sendMagicLink, signInWithGoogle, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [err, setErr] = useState('');

  if (!enabled) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    const r = await sendMagicLink(email.trim());
    if (r.ok) setState('sent');
    else {
      setState('error');
      setErr(r.error || 'Gönderilemedi');
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={user ? 'Hesabım' : 'Giriş yap / Üye ol'}
        className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 transition cursor-pointer"
      >
        <UserRound className="w-4 h-4" />
        <span className="hidden sm:inline">{user ? 'Hesabım' : 'Giriş'}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">{user ? 'Hesabım' : 'Giriş / Üye ol'}</h3>
              <button onClick={() => setOpen(false)} aria-label="Kapat" className="p-1 text-slate-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {user ? (
              <div className="mt-3 space-y-3 text-sm">
                <p className="text-slate-700 break-all">{user.email}</p>
                <p>
                  Üyelik: <b>{TIER_LABEL[tier]}</b>
                </p>
                <p className="text-xs text-slate-500">İlerlemen hesabına kaydedilir; başka cihazda giriş yapınca devam eder.</p>
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Çıkış yap
                </button>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                <p className="text-xs text-slate-500">
                  Üye olursan ilerlemen ve yanlışların cihazlar arasında saklanır. Giriş yapmadan da kullanmaya devam
                  edebilirsin (ilerleme yalnızca bu cihazda kalır).
                </p>
                <button
                  onClick={signInWithGoogle}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer"
                >
                  Google ile devam et
                </button>
                <form onSubmit={submit} className="space-y-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e-posta adresin"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={state === 'sending'}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold cursor-pointer disabled:opacity-60"
                  >
                    <Mail className="w-4 h-4" /> E-posta ile giriş bağlantısı gönder
                  </button>
                </form>
                {state === 'sent' && (
                  <p className="text-sm text-emerald-700">Bağlantı e-postana gönderildi. Postanı kontrol et.</p>
                )}
                {state === 'error' && <p className="text-sm text-rose-700">{err}</p>}
                <p className="text-[11px] text-slate-400">
                  Devam ederek Gizlilik ve Kullanım Şartları'nı kabul etmiş olursun.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
