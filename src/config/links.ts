/** Programın ses dosyalarının indirilebileceği Drive bağlantısı (isteğe bağlı bilgi bağlantısı). */
export const DRIVE_AUDIO_URL = '';

/**
 * Drive'daki ders paketlerini programın indirebilmesi için Google Cloud'dan alınan, YALNIZCA Drive API'ye ve
 * bu sitenin adresine (HTTP referrer) kısıtlanmış API anahtarı. (Gizli sayılmaz; kısıtlama güvenliği sağlar.)
 */
export const DRIVE_API_KEY = '';

/**
 * Geçiş anahtarı: true iken paket indirilmemişse eski yöntemle (sitedeki public/audio ve public/data/img) çalışır.
 * Paketler Drive'a yüklenip ağır medya siteden kaldırıldığında false yapılır.
 */
export const LEGACY_PUBLIC_MEDIA = true;
