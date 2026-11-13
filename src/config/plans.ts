/**
 * Katman (kayıtsız / üye / premium) ve ücret duvarı ayarları.
 *
 * PAYWALL_ENABLED = false iken HER ŞEY herkese açıktır (bugünkü durum). Ödeme, avukat onaylı
 * sözleşmeler ve hesap sistemi hazır olunca true yapılır. Sınırlar tek yerden değiştirilir.
 */
export const PAYWALL_ENABLED = false;

export type Tier = 'anon' | 'member' | 'premium';

export interface TierLimits {
  /** Her ders için okunabilir/dinlenebilir ilk alt başlık sayısı (Infinity = tümü) */
  lectureSubtopicsPerCourse: number;
  /** Açılabilen hafıza kartı sayısı (listedeki ilk N kart) */
  hafizaCards: number;
  /** Mutlaka Bil'de sesle dinlenebilen alt başlık sayısı */
  mutlakaBilAudioSubtopics: number;
  /** Günlük çözülebilir test sorusu */
  dailyQuestions: number;
  /** Aylık deneme sınavı hakkı */
  monthlyExams: number;
  /** Deneme başına en fazla soru */
  examMaxQuestions: number;
  /** "Eksiklerimi dinle" (yanlış/zayıf konuları sesli dinleme) */
  eksiklerimAudio: boolean;
  /** "Eksiklerimi PDF al" (yazdırılabilir çalışma föyü) */
  eksiklerimPdf: boolean;
}

export const TIER_LIMITS: Record<Tier, TierLimits> = {
  anon: {
    lectureSubtopicsPerCourse: 2,
    hafizaCards: 6,
    mutlakaBilAudioSubtopics: 3,
    dailyQuestions: 10,
    monthlyExams: 1,
    examMaxQuestions: 20,
    eksiklerimAudio: false,
    eksiklerimPdf: false
  },
  member: {
    lectureSubtopicsPerCourse: Infinity,
    hafizaCards: 20,
    mutlakaBilAudioSubtopics: Infinity,
    dailyQuestions: 30,
    monthlyExams: 1,
    examMaxQuestions: 20,
    eksiklerimAudio: false,
    eksiklerimPdf: false
  },
  premium: {
    lectureSubtopicsPerCourse: Infinity,
    hafizaCards: Infinity,
    mutlakaBilAudioSubtopics: Infinity,
    dailyQuestions: Infinity,
    monthlyExams: Infinity,
    examMaxQuestions: 100,
    eksiklerimAudio: true,
    eksiklerimPdf: true
  }
};

export const TIER_LABEL: Record<Tier, string> = {
  anon: 'Misafir',
  member: 'Ücretsiz üye',
  premium: 'Premium'
};

/** Geçerli sınırlar: duvar kapalıysa herkes sınırsız (premium) görünür. */
export const limitsFor = (tier: Tier): TierLimits => TIER_LIMITS[PAYWALL_ENABLED ? tier : 'premium'];
