import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

// Telefona yüklenebilir uygulama (PWA): servis çalışanını kaydet
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* kayıt başarısızsa site yine normal çalışır */
    });
  });
}
