import React, { useState } from 'react';
import { Flag } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { Question } from '../types';

/**
 * "Hatalı soru bildir": hesap sistemi açıksa ve kullanıcı girişliyse sunucudaki `question_reports`
 * tablosuna yazar; aksi halde bildirim metnini panoya kopyalar (sahibine iletilebilsin) ve cihazda saklar.
 */
export const ReportQuestionButton: React.FC<{ question: Question }> = ({ question }) => {
  const { user } = useAuth();
  const [msg, setMsg] = useState('');

  const send = async () => {
    const text = `Hatalı soru bildirimi\nSoru: ${question.id}\n${question.questionText}`;
    try {
      const k = 'trp_hata_bildirimleri_v1';
      const list = JSON.parse(localStorage.getItem(k) || '[]');
      list.push({ id: question.id, ts: Date.now() });
      localStorage.setItem(k, JSON.stringify(list.slice(-200)));
    } catch {
      /* yok say */
    }
    if (supabase && user) {
      const { error } = await supabase
        .from('question_reports')
        .insert({ user_id: user.id, question_id: question.id, note: question.questionText.slice(0, 300) });
      setMsg(error ? 'Gönderilemedi, tekrar dene.' : 'Bildirdiğin için teşekkürler.');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setMsg('Bildirim metni panoya kopyalandı; site sahibine iletebilirsin.');
    } catch {
      setMsg('Soru numarası: ' + question.id);
    }
  };

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
      <button
        onClick={send}
        className="flex items-center gap-1 text-slate-500 hover:text-rose-700 underline-offset-2 hover:underline cursor-pointer"
      >
        <Flag className="w-3.5 h-3.5" /> Hatalı soru bildir
      </button>
      {msg && <span className="text-slate-600">{msg}</span>}
    </div>
  );
};
