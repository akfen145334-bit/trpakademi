// Yasal metin TASLAKLARI. Yayına/ücret almaya geçmeden önce avukat onayı gerekir.
// [KÖŞELİ] alanlar işletme sahibince doldurulacak.
export interface LegalDoc {
  id: string;
  title: string;
  paragraphs: { h?: string; t: string }[];
}

export const LEGAL_DRAFT_NOTICE =
  'TASLAK: Bu metin hukuki danışmanlık değildir; kullanıma/ücretli satışa geçmeden önce bir avukat tarafından gözden geçirilmelidir.';

export const LEGAL_DOCS: LegalDoc[] = [
  {
    id: 'gizlilik',
    title: 'Gizlilik ve KVKK Aydınlatma Metni',
    paragraphs: [
      { h: 'Veri sorumlusu', t: '[İŞLETME ADI / ŞAHIS ADI], [ADRES], [İLETİŞİM E-POSTASI].' },
      {
        h: 'Hangi veriler işlenir?',
        t: 'Hesap açmadan kullanımda çözdüğün sorular, ilerlemen ve ayarların yalnızca tarayıcında (yerel depolama) saklanır; sunucuya gönderilmez. Hesap açarsan e-posta adresin ve ilerleme kaydın (çözülen sorular, zayıf konular) hesabına bağlı olarak saklanır.'
      },
      {
        h: 'Amaç ve hukuki sebep',
        t: 'Verilerin; hizmetin sunulması, ilerlemenin cihazlar arasında senkronu ve üyelik/ödeme süreçlerinin yürütülmesi amacıyla, sözleşmenin kurulması ve ifası ile meşru menfaat hukuki sebeplerine dayanarak işlenir.'
      },
      {
        h: 'Üçüncü taraflar',
        t: 'Hesap ve veri saklama için altyapı sağlayıcısı (Supabase), barındırma için Vercel, ödeme için ödeme kuruluşu (ödeme açıldığında) kullanılır. Kart bilgilerin bu sitede tutulmaz. Verilerin yurt dışındaki sunucularda işlenebilir; [AB bölgesi/SCC bilgisi eklenecek].'
      },
      { h: 'Saklama süresi', t: 'Hesabını silmen halinde ilerleme kayıtların silinir. Ödeme kayıtları yasal süre boyunca saklanır.' },
      {
        h: 'Hakların',
        t: 'KVKK m.11 uyarınca verilerine erişme, düzeltme, silme, işlenmesine itiraz etme ve zarara uğraman halinde tazminat talep etme haklarına sahipsin. Başvuru: [İLETİŞİM E-POSTASI].'
      },
      { h: 'Çerezler', t: 'Site, giriş oturumu ve tercihlerin için gerekli depolama kullanır; reklam veya takip çerezi kullanmaz.' }
    ]
  },
  {
    id: 'sartlar',
    title: 'Kullanım Şartları',
    paragraphs: [
      {
        h: 'Hizmet',
        t: 'TRP Akademi, Turist Rehberliği Mesleğe Kabul Sınavı çalışması için konu özetleri, sesli anlatım, test ve hafıza kartları sunan bağımsız bir eğitim yardımcısıdır. Bakanlık, Anadolu Üniversitesi veya TUREB ile bağlantısı yoktur.'
      },
      {
        h: 'Sorumluluk sınırı',
        t: 'İçerikler çalışma amaçlıdır; doğruluğu için özen gösterilir ancak hata içerebilir. Resmî kaynaklar ve güncel mevzuat esastır. Sınav sonucu garanti edilmez.'
      },
      {
        h: 'Kullanım kuralları',
        t: 'İçeriklerin kopyalanması, çoğaltılması, yeniden satılması ve otomatik yöntemlerle toplanması yasaktır. Hesabın paylaşılması kabul edilmez.'
      },
      { h: 'Fikri haklar', t: 'Sitedeki özgün içerik (metin, ses, görsel, hafıza kartları) [İŞLETME ADI]’na aittir. [Üçüncü taraf kaynakların listesi/lisans durumu eklenecek.]' },
      { h: 'Değişiklik', t: 'Şartlar güncellenebilir; güncel hali bu sayfada yayımlanır.' }
    ]
  },
  {
    id: 'satis',
    title: 'Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme',
    paragraphs: [
      { h: 'Satıcı', t: '[UNVAN], [VERGİ DAİRESİ / NO], [ADRES], [TELEFON], [E-POSTA].' },
      {
        h: 'Ürün',
        t: 'Dijital içerik/hizmet: TRP Akademi Premium üyeliği ([SÜRE: ör. sınava kadar / 1 ay]). Tüm ücretler KDV dahildir: [FİYAT TL].'
      },
      { h: 'Ödeme', t: 'Ödeme, anlaşmalı ödeme kuruluşu üzerinden kredi/banka kartı ile alınır. Kart bilgileri satıcıda saklanmaz.' },
      {
        h: 'Teslimat',
        t: 'Üyelik, ödemenin onaylanmasının ardından hesabına anında tanımlanır ve elektronik ortamda ifa edilir.'
      },
      {
        h: 'Cayma hakkı',
        t: '[AVUKAT KONTROLÜ GEREKİR] Dijital hizmetlerde, tüketicinin onayıyla cayma süresi dolmadan ifasına başlanan hizmetlerde cayma hakkı kullanılamaz (Mesafeli Sözleşmeler Yönetmeliği). Bu onay, ödeme öncesinde ayrı bir kutucukla alınır. Aksi durumda 14 gün içinde gerekçe göstermeksizin cayabilirsin.'
      },
      { h: 'Uyuşmazlık', t: 'Tüketici hakem heyetleri ve tüketici mahkemeleri yetkilidir.' }
    ]
  },
  {
    id: 'iade',
    title: 'İptal ve İade Koşulları',
    paragraphs: [
      { h: 'Üyelik iptali', t: 'Otomatik yenileme sunulursa, bir sonraki dönem öncesi hesap sayfasından iptal edebilirsin. [Yenileme yoksa: Üyelik süre sonunda kendiliğinden biter.]' },
      { h: 'İade', t: '[AVUKAT KONTROLÜ GEREKİR] Hizmet teknik bir arıza nedeniyle kullanılamadıysa ücret iadesi yapılır. Diğer durumlar için Mesafeli Satış Sözleşmesi’ndeki cayma hakkı hükümleri geçerlidir.' },
      { h: 'Başvuru', t: '[İLETİŞİM E-POSTASI] adresine yazabilirsin.' }
    ]
  }
];
