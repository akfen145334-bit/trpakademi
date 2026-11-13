import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Smartphone, 
  CheckCircle, 
  Lock, 
  Volume2, 
  Info, 
  X, 
  ExternalLink,
  ShieldCheck,
  Headphones
} from 'lucide-react';

interface BackgroundAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackgroundAudioModal: React.FC<BackgroundAudioModalProps> = ({ isOpen, onClose }) => {
  const { enableBackgroundAudio } = useApp();
  const [activated, setActivated] = useState(false);

  if (!isOpen) return null;

  const handleActivate = () => {
    const success = enableBackgroundAudio();
    setActivated(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Telefon & Tablet Arka Planda Seslendirme
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ekran kilitlendiğinde veya başka uygulamaya geçildiğinde kesintisiz dinleme
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            TRP Akademi, mobil cihazlarda yürürken, toplu taşımada veya ekran kapalıyken ders dinlemenizi kolaylaştırmak için <strong>MediaSession API</strong> ve arka plan ses köprüsü mekanizmalarını entegre etmiştir.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2 text-slate-800">
            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Kilit Ekranı Kontrolleri:</strong> Telefonunuz kilitliyken bildirim/kilit ekranında konunun adı, oynat, duraklat, sonraki cümle kontrolleri görünür.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Volume2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Cihazın Yerleşik TTS Motoru:</strong> Seslendirme cihazınızın kendi yüksek kaliteli Türkçe ses sentezleyicisi (Siri/Google TTS) ile veri harcamadan çalışır.
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Cihazınıza Özel Önemli İpuçları:</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-500 text-xs">
              <li><strong>iOS (iPhone / iPad):</strong> Safari'de seslendirmeyi başlattıktan sonra ekranı kilitlediğinizde sesin kesilmemesi için aşağıdaki "Arka Plan Sesini Etkinleştir" butonuna bir kez dokunun.</li>
              <li><strong>Android (Chrome):</strong> Pil tasarrufu modu aktifken tarayıcı arka plan sesini kısıtlayabilir. Kesintisiz deneyim için tarayıcı sekmesini kapatmayınız.</li>
              <li>Kulaklık üzerindeki oynat/duraklat tuşları da sistemle senkronize çalışır.</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleActivate}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
              activated 
                ? 'bg-emerald-600 text-white' 
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {activated ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Arka Plan Sesi Etkinleştirildi</span>
              </>
            ) : (
              <>
                <Headphones className="w-4 h-4" />
                <span>Arka Plan Sesini Etkinleştir</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            Anladım, Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
