// Hafıza kartları: görsel sahne + hafıza kodlaması + sınav çapası + "filmi geri sar" soru-cevapları (ana/alt başlığa göre).
export interface HafizaKart {
  id: string;
  ana: string;
  alt: string;
  ad: string;
  sahne: string;
  kod: { e: string; m: string }[];
  capa: string;
  film: { s: string; c: string }[];
}

export const HAFIZA_KARTLARI: HafizaKart[] = [
  {
    "id": "ST-01",
    "ana": "Sanat Tarihi",
    "alt": "Antik Yunan ve Roma Mimarisi",
    "ad": "Antik Heykel Ustaları Kaidesi",
    "sahne": "Beyaz mermer avluda beş antik kaide yan yana: Myron, sırtına taktığı motorla diski fırlatmadan hemen önceki ANda havada donmuş (Diskobolos). Yanında Praxiteles, bir kolunda bebek Dionysos'u tutan Hermes heykeli, diğer elinde ise ilk çıplak kadın heykeli olan Knidos Aphroditesi'ni tutuyor. Phidias, 7 harikadan biri olan dev Zeus heykelinin altın parmaklarını parlatıyor. Polykleitos elinde cetvelle kusursuz insan oranlı mızrakçı Dorifor'u ölçüyor. Lysippos ise Büyük İskender'in portre büstünü tamamlıyor.",
    "kod": [
      {
        "e": "myron",
        "m": "MYRON Motoru = Diski fırlatmadan hemen önceki 'AN' (Diskobolos)."
      },
      {
        "e": "praxiteles",
        "m": "PRAKtik usta = İki başyapıt tek ustanın elinde (Hermes + Knidos Aphroditesi)."
      },
      {
        "e": "polykleitos",
        "m": "POLİ-teknik Oran = Cetvelle kusursuz insan beden oranını (Kanon / Dorifor) ölçen heykeltıraş."
      }
    ],
    "capa": "DİSK atan atlet = Myron; MIZRAK taşıyan kusursuz oranlı atlet = Polykleitos. İki atleti sınavlarda asla karıştırma!",
    "film": [
      {
        "s": "Diskobolos heykelinde yakalanan kritik an nedir ve heykeltıraşı kimdir?",
        "c": "Fırlatmadan hemen önceki an; Myron."
      },
      {
        "s": "Tarihteki ilk çıplak kadın heykeli olan Knidos Aphroditesi kime aittir?",
        "c": "Praxiteles."
      },
      {
        "s": "Kusursuz insan beden oranını (Kanon) belirleyen mızrakçı heykeli kime aittir?",
        "c": "Polykleitos (Dorifor)."
      }
    ]
  },
  {
    "id": "ST-02",
    "ana": "Sanat Tarihi",
    "alt": "Antik Yunan ve Roma Mimarisi",
    "ad": "Sütun Nizamları ve Karyatidler",
    "sahne": "Taş kemerli sokakta üç dev sütun askeri tekmil nizamında: Asker tıraşlı düz başlıklı Dor, saçları koçboynuzu veya saç lüleleri (volüt) gibi iki yana kıvrık İyon, başında dikenli kenger (akantus) yapraklarından taç taşıyan süslü Korint sütunu. Yan tarafta mermerden bir kadın heykeli (Karyatid), çatının dev taş kirişini başının üzerinde dimdik taşıyor. Arka kapıda ağaç yerine yüzlerce sütunun dizildiği bir 'sütun ormanı' (hipostil salon) yükseliyor.",
    "kod": [
      {
        "e": "siralama",
        "m": "'DİK dur!' Nizamı = Dor → İyon → Korint (Sadeden en süslüye evrensel sıralama)."
      },
      {
        "e": "karyatid",
        "m": "Başındaki taş yüküyle mimarlıkta 'kariyer' yapan kadın heykeli."
      },
      {
        "e": "hipostil",
        "m": "Tavanı yüzlerce sütunla taşınan 'sütun ormanı' plan şeması."
      }
    ],
    "capa": "Korint başlığının sınavlardaki şifresi daima AKANTUS (kenger) yapraklarıdır. Çatıyı taşıyan kadın heykeli Karyatid, erkek heykeli ise Atlant'tır.",
    "film": [
      {
        "s": "'DİK dur' şifresiyle sütunların sadeden süslüye sıralaması nasıldır?",
        "c": "Dor → İyon → Korint."
      },
      {
        "s": "Akantus yapraklarıyla süslenen sütun başlığı hangisidir?",
        "c": "Korint."
      },
      {
        "s": "Sütun görevi gören kadın heykellerine ne ad verilir?",
        "c": "Karyatid."
      }
    ]
  },
  {
    "id": "ST-03",
    "ana": "Sanat Tarihi",
    "alt": "Bizans Sanatı",
    "ad": "Ayasofya'nın Beş Yıllık Asılı Kubbesi ve İkonoklazm",
    "sahne": "Tarihi Yarımada meydanında 532–537 arasında 5 yılda gökyüzüne asılan altın Ayasofya kubbesi parlar. Altında iki Anadolulu deha durur: Trallesli (Aydın) geometrici Anthemios ile Miletoslu fizikçi İsidoros; pandantifler üzerine kubbeyi boşlukta durur gibi oturturlar. Yan sokaktaki kilisede ise askerler ellerindeki kazmalarla duvardaki kutsal azize fresklerini parçalamaktadır; yere saçılan mozaiklerin üstünde 'İkonoklazm' mührü okunur.",
    "kod": [
      {
        "e": "ayasofya",
        "m": "Iustinianus + 5 yıl (532-537) + Trallesli Anthemios & Miletoslu İsidoros."
      },
      {
        "e": "ikonoklazm",
        "m": "İkona (kutsal resim) + Klazma (kırma/yok etme) = 8-9. yüzyıl tasvir yasağı."
      }
    ],
    "capa": "Ayasofya'nın mimarları Yunanistan veya Roma'dan değil, BATI ANADOLU'dandır (Tralles ve Miletos). Latin istilası (1204) dönemindeki Bizans sürgün hükümeti merkezi ise NİKEA (İznik)'dır.",
    "film": [
      {
        "s": "Ayasofya kaç yılda inşa edilmiştir ve yaptıran imparator kimdir?",
        "c": "5 yılda (532-537); İmparator Iustinianus."
      },
      {
        "s": "Ayasofya'nın Anadolulu mimarları kimlerdir?",
        "c": "Trallesli Anthemios ve Miletoslu İsidoros."
      },
      {
        "s": "Bizans'ta dinî tasvirlerin kırılıp yasaklandığı döneme ne denir?",
        "c": "İkonoklazm."
      }
    ]
  },
  {
    "id": "ST-04",
    "ana": "Sanat Tarihi",
    "alt": "Anadolu Selçuklu ve Beylikler Sanatı",
    "ad": "Selçuklu Çinileri, Taş Taçkapılar ve Darüşşifalar",
    "sahne": "Konya Karatay Medresesi kubbesinde turkuaz, lacivert ve patlıcan moru firuze çini mozaikler yıldızlar gibi parlar. Yanında Divriği Ulu Camii'nin taçkapısında güneş vurduğunda namaz kılan bir insan silüeti belirir. Avluda Kayseri Gevher Nesibe Darüşşifası'nda hekimler su sesi ve ney melodileri eşliğinde akıl hastalarını tedavi ederken, açık avlulu eyvanın havuzundan su çağıldar.",
    "kod": [
      {
        "e": "selcuklu_cinisi",
        "m": "Firuze (turkuaz) + Patlıcan moru + Geometrik yıldız geçmeler."
      },
      {
        "e": "gevher_nesibe",
        "m": "Kayseri Gevher Nesibe = Dünyanın ilk tıp fakültesi ve müzikle tedavi darüşşifası."
      },
      {
        "e": "divrigi",
        "m": "Taşın dantel gibi işlendiği UNESCO eseri Mengücek başyapıtı taçkapı."
      }
    ],
    "capa": "Anadolu Selçuklu mimarisinin simgesi TÜRBE ve KÜMBET'tir (çadır biçimli silindirik çatı). Osmanlı'da kubbe hâkimken, Selçuklu'da taçkapı taş oymacılığı ve eyvan planı öne çıkar.",
    "film": [
      {
        "s": "Dünyanın ilk tıp merkezi ve müzikle tedavi darüşşifası nerededir?",
        "c": "Kayseri Gevher Nesibe Darüşşifası."
      },
      {
        "s": "UNESCO Dünya Mirası olan taş oymalı taçkapısıyla ünlü Selçuklu/Mengücek eseri hangisidir?",
        "c": "Divriği Ulu Camii ve Darüşşifası."
      },
      {
        "s": "Selçuklu çinilerinde en baskın kullanılan renkler nelerdir?",
        "c": "Firuze (turkuaz), kobalt mavisi ve patlıcan moru."
      }
    ]
  },
  {
    "id": "ST-05",
    "ana": "Sanat Tarihi",
    "alt": "Osmanlı Mimarisi",
    "ad": "Sinan'ın Kariyer Merdiveni, Saraylar ve Cami Mimarisi",
    "sahne": "Mimar Sinan'ın çalışma masasında 3 basamaklı diploma merdiveni: Şehzade Camii (Çırak), Süleymaniye (Kalfa), Edirne Selimiye Camii (Usta). Boğaz kıyısında II. Mahmud plaj şemsiyesi altında deniz havası alır; arkasında Beylerbeyi Sarayı bahçesindeki Mermer Köşk, Sarı Köşk ve Ahır Köşkü yükselir. Doğubayazıt'taki İshak Paşa Sarayı duvarında Selçuklu taş ustası, Osmanlı çinicisi ve İranlı nakkaş aynı duvara motif işler. Cami içinde ise hoca merdivenli yüksek minbere tırmanır.",
    "kod": [
      {
        "e": "sinan_merdiveni",
        "m": "Ç-K-U Kuralı = Çırak Şehzade → Kalfa Süleymaniye → Usta Selimiye (Edirne)."
      },
      {
        "e": "beylerbeyi",
        "m": "II. Mahmud'un Boğaz'daki yazlığı (Mermer Köşk + Sarı Köşk + Ahır Köşkü)."
      },
      {
        "e": "minber",
        "m": "Merdivenli yüksek hutbe kürsüsü (Mihrap ise kıble nişidir)."
      }
    ],
    "capa": "Safranbolu ve Cumalıkızık yaşayan geleneksel Türk sivil mimarisidir; fakat KAYAKÖY (Muğla) terk edilmiş bir Rum köyü olduğu için geleneksel Türk evi listesine girmez.",
    "film": [
      {
        "s": "Mimar Sinan'ın ustalık eseri nerededir?",
        "c": "Edirne Selimiye Camii."
      },
      {
        "s": "Mimar Sinan'ın çıraklık eseri hangisidir?",
        "c": "Şehzade Camii (İstanbul)."
      },
      {
        "s": "Geleneksel Türk sivil mimarisi koruma alanları içinde yer almayan hayalet yerleşim hangisidir?",
        "c": "Kayaköy (Muğla)."
      }
    ]
  },
  {
    "id": "ST-06",
    "ana": "Sanat Tarihi",
    "alt": "Geleneksel El Sanatları",
    "ad": "Kündekari, Tezhip, Surname ve Ebru Atölyesi",
    "sahne": "Ahşap ustası hiç çivi ve tutkal kullanmadan geometrik tahtaları birbirini kündeye getiren güreşçiler gibi kenetler. Ebru ustası kitreli koyu suyun üstüne boya damlatıp kağıdı yatırarak motifi sudan çeker. Tezgahın ucunda nakkaş altın tozunu ezip el yazması kitabın kenarlarına parıltılar kondurur; masasında şehzade sünnet şenliğini anlatan Surname açık durur. Fırından çıkan İznik çinilerinde mercan kırmızısı parlar.",
    "kod": [
      {
        "e": "kundekari",
        "m": "Çivisiz ahşap parçaların 'künde güreşi' gibi kenetlenmesi."
      },
      {
        "e": "tezhip",
        "m": "'TEZ altını getir!' = Sayfa kenarlarını altınla süsleme sanatı."
      },
      {
        "e": "surname",
        "m": "Sünnet düğünü ve saray şenlik kitabı (Sünnet-name)."
      },
      {
        "e": "ebru",
        "m": "Kitreli su üzerinde renklerin kağıda aktarılması."
      }
    ],
    "capa": "Kündekari tekniğinde kesinlikle METAL ÇİVİ veya TUTKAL kullanılmaz; tamamen ahşap kilit geometrisidir.",
    "film": [
      {
        "s": "Çivi veya tutkal kullanılmadan ahşap parçaların birbirine geçirilmesi sanatına ne denir?",
        "c": "Kündekari."
      },
      {
        "s": "Altın yaldızla kitap tezhibi yapan sanatçıya ne ad verilir?",
        "c": "Müzehhib."
      },
      {
        "s": "Osmanlı'da saray şenliklerini ve sünnet düğünlerini resmeden eserlere ne denir?",
        "c": "Surname."
      }
    ]
  },
  {
    "id": "ST-07",
    "ana": "Sanat Tarihi",
    "alt": "Resim Sanatı (Doğu ve Batı Ekolleri)",
    "ad": "Büyük Resim Galerisi: Öpücük'ten Kaplumbağa Terbiyecisi'ne",
    "sahne": "Galerinin batı duvarında altın desenler içinde birbirine sarılan çift (Gustav Klimt - Öpücük / Belvedere Sarayı), sapanını omzuna atmış mermer dev (Michelangelo - Davut) ve masada 13 kişinin oturduğu fresk (Da Vinci - Son Akşam Yemeği) asılıdır. Türk duvarında başında kırmızı fesi, sırtında ney ve elinde yeşil marulla kaplumbağalara söz dinletmeye çalışan ressam (Osman Hamdi Bey - Kaplumbağa Terbiyecisi) durur.",
    "kod": [
      {
        "e": "opucuk",
        "m": "Gustav Klimt = Viyana Belvedere Sarayı (Altın Dönem)."
      },
      {
        "e": "kaplumbaga_terbiyecisi",
        "m": "Osman Hamdi Bey = Hem ressam hem 1881 Müze-i Hümayun müdürü (sabır sembolü marul)."
      },
      {
        "e": "davut",
        "m": "Michelangelo = Floransa Akademi Galerisi (Mermer dev)."
      }
    ],
    "capa": "Klimt'in 'Öpücük' tablosunun sınav adresi VİYANA BELVEDERE SARAYI'dır. Osman Hamdi Bey ise Asar-ı Atika Nizamnamesi'nin (1884) mimarıdır.",
    "film": [
      {
        "s": "Gustav Klimt'in 'Öpücük' tablosu hangi müzede sergilenmektedir?",
        "c": "Viyana Belvedere Sarayı."
      },
      {
        "s": "Kaplumbağa Terbiyecisi tablosunun ressamı kimdir?",
        "c": "Osman Hamdi Bey."
      },
      {
        "s": "Michelangelo'nun ünlü mermer Davut heykeli nerededir?",
        "c": "Floransa Akademi Galerisi."
      }
    ]
  },
  {
    "id": "AM-01",
    "ana": "Anadolu Medeniyetleri",
    "alt": "Prehistorya",
    "ad": "Karain'den Göbeklitepe ve Çatalhöyük'e",
    "sahne": "Antalya Karain Mağarası'nda elinde çakmaktaşı olan Neandertal avcısı duvara Anadolu'nun en eski insan izini kazar. Urfa Göbeklitepe'de üzerinde tilki ve akrep kabartmaları olan dev T biçimli dikilitaşlar dairesel tapınak oluşturur. Konya Çatalhöyük'te kapısı ve sokağı olmayan, insanların çatıdaki deliklerden merdivenle evlerine girdiği bitişik kerpiç evler yükselir; duvarda leopar desenli Ana Tanrıça oturur.",
    "kod": [
      {
        "e": "karain",
        "m": "KARA-İN = Türkiye'de insan yaşayan en eski doğal mağara (Paleolitik)."
      },
      {
        "e": "gobeklitepe",
        "m": "T Biçimli Taşlar = Dünyanın ilk anıtsal kült/tapınak merkezi (Neolitik)."
      },
      {
        "e": "catalhoyuk",
        "m": "Çatılı Höyük = Sokaksız, kapısız, çatıdan girilen ilk proto-kent."
      }
    ],
    "capa": "Göbeklitepe bir KÖY veya YERLEŞİM değil, toplanma ve inanç (kült) merkezidir. Çatalhöyük ise sokak dokusu olmayan, çatıdan merdivenle girilen yerleşimdir.",
    "film": [
      {
        "s": "T biçimli sütunlarıyla bilinen dünyanın en eski kült merkezi neresidir?",
        "c": "Göbeklitepe (Şanlıurfa)."
      },
      {
        "s": "Girişi çatılardan yapılan sokaksız Neolitik yerleşim hangisidir?",
        "c": "Çatalhöyük (Konya)."
      },
      {
        "s": "Anadolu'da Paleolitik döneme ait en eski insan fosili nerede bulunmuştur?",
        "c": "Karain Mağarası (Antalya)."
      }
    ]
  },
  {
    "id": "AM-02",
    "ana": "Anadolu Medeniyetleri",
    "alt": "Asur Kolonileri",
    "ad": "Kültepe Kervanları ve İlk Kil Tabletler",
    "sahne": "Kayseri Kültepe (Kaniş) pazarında eşek kervanlarıyla gelen Asurlu tüccarlar, ellerindeki çivi yazılı ıslak kil tabletlere kalay ve kumaş borç senetlerini kazırlar. Yanlarındaki killi mühürlerle tabletleri zarflarlar. Pazarın merkezinde büyük ticaret merkezi Karum, yol kenarında ise küçük konaklama istasyonu Vabartum kurulmuştur.",
    "kod": [
      {
        "e": "kultepe",
        "m": "KÜLTEPE = Anadolu'ya YAZIYI getiren Asur Ticaret Kolonileri (Tarihi başlatan merkez)."
      },
      {
        "e": "karum",
        "m": "Büyük pazar/ticaret merkezi (Liman/Pazar)."
      },
      {
        "e": "vabartum",
        "m": "Küçük konaklama ve kervan istasyonu."
      }
    ],
    "capa": "Anadolu'da Tarih Çağları (Yazı) Hititlerle değil, ASUR TİCARET KOLONİLERİ ile Kültepe Kaniş'te başlamıştır.",
    "film": [
      {
        "s": "Anadolu'da yazıyı başlatan ilk merkez neresidir?",
        "c": "Kültepe Kaniş (Kayseri)."
      },
      {
        "s": "Asurlu tüccarların kurduğu büyük pazar merkezlerine ne ad verilir?",
        "c": "Karum."
      },
      {
        "s": "Asur tüccarlarının küçük kervan konaklama istasyonlarına ne denir?",
        "c": "Vabartum."
      }
    ]
  },
  {
    "id": "AM-03",
    "ana": "Anadolu Medeniyetleri",
    "alt": "Hitit İmparatorluğu",
    "ad": "Hattuşa Surları, Kadeş Masası ve Pankuş Meclisi",
    "sahne": "Çorum Hattuşa surlarında Yerkapı potern tünelinden askerler geçer; Aslanlı Kapı şehri korur. Sarayda kral Labarna ile kraliçe Tavananna, Pankuş adlı soylular meclisinde yasaları tartışır. Duvarda M.Ö. 1280 tarihli tarihin ilk yazılı barış antlaşması olan Kadeş Antlaşması gümüş tableti asılıdır. Yazılıkaya açık hava tapınağında fırtına tanrısı Teşup dağların üstünde yükselir.",
    "kod": [
      {
        "e": "tavananna",
        "m": "TAVAN-ANNA = Hititlerde kral kadar yetkili kraliçe."
      },
      {
        "e": "pankus",
        "m": "PANKUŞ = Kralın yetkilerini denetleyen soylular meclisi."
      },
      {
        "e": "kades",
        "m": "KADEŞ (M.Ö. 1280) = Hitit Kralı III. Hattuşili ile Mısır Firavunu II. Ramses arasındaki ilk yazılı barış."
      }
    ],
    "capa": "Hititler fethettikleri her bölgenin tanrısını kabul ettikleri için 'BİN TANRILI İL' olarak anılır. Kadeş Antlaşması M.Ö. 1280'de imzalanmıştır.",
    "film": [
      {
        "s": "Hititlerin başkenti neresidir?",
        "c": "Hattuşa (Boğazköy / Çorum)."
      },
      {
        "s": "Hititlerde yetkili soylular meclisinin adı nedir?",
        "c": "Pankuş."
      },
      {
        "s": "Tarihteki ilk yazılı barış antlaşması hangisidir?",
        "c": "Kadeş Antlaşması (M.Ö. 1280)."
      }
    ]
  },
  {
    "id": "AM-04",
    "ana": "Anadolu Medeniyetleri",
    "alt": "Demir Çağı Uygarlıkları",
    "ad": "Frigya, Lidya ve Urartu Başkentleri",
    "sahne": "Gordion'da Kral Midas eşek kulaklarını sallayarak pelerinini büyük bir altın çengelli iğneyle (fibula) tutturur; arkasında dokuma Tapates kilimleri serilidir. Sardes'te Paktolos Çayı kıyısında Lidyalılar aslan başlı ilk madeni paraları takas edip Kral Yolu'nda koşar. Van Gölü kıyısında Tuşpa Kalesi'nde Urartu taş ustaları kayaları yontup 50 km'lik Şamran su kanalını açar; savaş tanrısı Haldi'ye kadeh kaldırırlar.",
    "kod": [
      {
        "e": "frigler",
        "m": "FİBULA (çengelli iğne) + Tapates (kilim) + Midas = Gordion (Polatlı)."
      },
      {
        "e": "lidyalilar",
        "m": "İLK PARA + Sardes + Kral Yolu (Sardes-Susa) = Zengin tüccarlar."
      },
      {
        "e": "urartular",
        "m": "TAŞ USTALARI + Tanrı Haldi + Şamran Kanalı = Tuşpa (Van Kalesi)."
      }
    ],
    "capa": "Frigler ahşap oymacılığı ve madeni fibula (iğne) ustasıdır; Urartular ise taş mimarisi ve hidrolik su kanalı (Şamran) ustasıdır.",
    "film": [
      {
        "s": "Tarihte ilk madeni parayı basan ve başkenti Sardes olan devlet hangisidir?",
        "c": "Lidyalılar."
      },
      {
        "s": "Friglerin maden sanatında geliştirdiği çengelli iğneye ne ad verilir?",
        "c": "Fibula."
      },
      {
        "s": "Urartuların başkenti neresidir ve hangi su kanalını inşa etmişlerdir?",
        "c": "Tuşpa (Van); Şamran (Menua) Kanalı."
      }
    ]
  },
  {
    "id": "AM-05",
    "ana": "Anadolu Medeniyetleri",
    "alt": "Helenistik ve Roma Dönemi",
    "ad": "Büyük İskender, Gordion Düğümü ve Roma Anadolu'su",
    "sahne": "Gordion tapınağında genç Büyük İskender, Asya'nın anahtarı sayılan kördüğümü kılıcıyla tek hamlede keser. Ardından Granikos ve İssos'ta Pers ordularını yenerek Doğu ve Batı kültürünü birleştiren Helenizm'i başlatır. Arkasında Roma lejyonerleri Augustus döneminin Pax Romana barış bayrağını diker; Celsus Kütüphanesi'nin mermer cephesi Efes'te yükselir.",
    "kod": [
      {
        "e": "iskender",
        "m": "Kılıç darbesiyle çözülen Gordion Düğümü = Doğu ile Batı sentezi Helenizm."
      },
      {
        "e": "pax_romana",
        "m": "Augustus ile başlayan 200 yıllık Roma Barışı dönemi."
      },
      {
        "e": "celsus",
        "m": "Efes'te hem anıt mezar hem kütüphane olan Roma şaheseri."
      }
    ],
    "capa": "Helenistik dönem Büyük İskender'in seferiyle başlar ve Doğu (Pers/Mısır) ile Batı (Yunan) sentezidir. Efes Celsus Kütüphanesi aynı zamanda Celsus'un mezar odasını barındırır.",
    "film": [
      {
        "s": "Doğu ve Batı kültürlerinin kaynaşmasıyla ortaya çıkan döneme ne ad verilir?",
        "c": "Helenistik Dönem."
      },
      {
        "s": "Gordion düğümünü kılıcıyla kesen ünlü komutan kimdir?",
        "c": "Büyük İskender."
      },
      {
        "s": "Efes'teki Celsus Kütüphanesi'nin alt katında ne bulunmaktadır?",
        "c": "Tiberius Julius Celsus'un mermer lahdi (mezar odası)."
      }
    ]
  },
  {
    "id": "ARK-01",
    "ana": "Arkeoloji",
    "alt": "Mimari ve Dini Yapı Terimleri",
    "ad": "Antik Kentte Bir Gün (11 İstasyonlu Mimari Yürüyüş)",
    "sahne": "Antik kentin kapısından girildiğinde tüccarların buluştuğu Agora meydanı uzanır. Yanında kent meclisinin toplandığı kapalı Bouleuterion ve yöneticilerin ağırlandığı kutsal ocak Prytaneion yer alır. Filozoflar güneşten koruyan sütunlu galeride (Stoa) yürür. Müzik yarışması için küçük çatılı Odeon'a, gladyatör dövüşü için devasa açık hava Tiyatrosu'na koşulur. Şehir çıkışında ise lahitlerin dizildiği mezarlık (Nekropol) yer alır.",
    "kod": [
      {
        "e": "agora",
        "m": "A-GORA = Alışveriş ve toplanma meydanı."
      },
      {
        "e": "bouleuterion",
        "m": "BULUŞMA Meclisi = Kent parlamentosu."
      },
      {
        "e": "prytaneion",
        "m": "Sönmeyen kutsal ocağın yandığı kent konağı."
      },
      {
        "e": "odeon",
        "m": "O-DE-ON = Akustik çatılı müzik ve konser salonu."
      },
      {
        "e": "nekropol",
        "m": "Nekro (ölü) + Polis (şehir) = Mezarlık."
      }
    ],
    "capa": "Odeon = Küçük ve çatılı müzik salonudur; Tiyatro = Çok basamaklı devasa açık hava yapısıdır. Bouleuterion ise kent parlamentosudur.",
    "film": [
      {
        "s": "Antik kentlerde çatılı konser ve müzik yapısına ne denir?",
        "c": "Odeon."
      },
      {
        "s": "Şehir meclisinin toplandığı yapı hangisidir?",
        "c": "Bouleuterion."
      },
      {
        "s": "Antik kent mezarlıklarına ne ad verilir?",
        "c": "Nekropol."
      }
    ]
  },
  {
    "id": "ARK-02",
    "ana": "Arkeoloji",
    "alt": "Antik Seramik Formları",
    "ad": "Seramik Tezgâhı: Amphoradan Kylix'e",
    "sahne": "Çömlekçi tezgâhında 5 antik kap yan yana: İki kulplu sivri dipli zeytinyağı küpü Amphora, şarapla suyu karıştırmak için kullanılan dev geniş ağızlı kâse Krater, sempozyumda şarap içilen iki kulplu yayvan kadeh Kylix, zeytinyağı akıtan dar boyunlu tek kulplu Lekythos ve hayvan başı biçiminde boynuz kadeh Rhyton.",
    "kod": [
      {
        "e": "amphora",
        "m": "Çift kulplu, sivri tabanlı deniz ticareti kabı (zeytinyağı/şarap)."
      },
      {
        "e": "krater",
        "m": "KRATER volkanı gibi geniş ağızlı = Şarap ve su karıştırma kabı."
      },
      {
        "e": "kylix",
        "m": "K-İ-LİKS = Yayvan ayaklı içki kadehi."
      },
      {
        "e": "rhyton",
        "m": "Hayvan başı biçimli ritüel kadehi."
      }
    ],
    "capa": "Şarap içme kadehi = Kylix; şarabı suyla karıştırma kazanı = Krater'dir. Mezarlara yağ akıtılan dar boyunlu kap = Lekythos'tur.",
    "film": [
      {
        "s": "Antik çağda su ile şarabı karıştırmak için kullanılan geniş kap hangisidir?",
        "c": "Krater."
      },
      {
        "s": "Sivri dipli çift kulplu taşıma küpüne ne denir?",
        "c": "Amphora."
      },
      {
        "s": "Hayvan başı şeklinde yapılan kutsal içki kabı hangisidir?",
        "c": "Rhyton."
      }
    ]
  },
  {
    "id": "ARK-03",
    "ana": "Arkeoloji",
    "alt": "Kazı ve Koruma Terimleri",
    "ad": "Dört Kardeş Terimi ve Müze Gece Devriyesi",
    "sahne": "Arkeolojik kazı alanında dört koruma uzmanı çalışır: Biri yıkılan tapınak sütunlarını orijinal taşlarıyla ayağa kaldırır (Anastilosis); diğeri eserin daha fazla bozulmasını önlemek için kimyasal koruyucu sürer (Konservasyon); üçüncüsü kırık parçaları aslına sadık kalarak onarır (Restorasyon); dördüncüsü ise tamamen yok olmuş çatıyı tarihi belgelere göre yeniden inşa eder (Rekonstrüksiyon).",
    "kod": [
      {
        "e": "anastilosis",
        "m": "ANASTİLOSİS = Sütunun orijinal parçalarını yerine koyup ayağa kaldırma."
      },
      {
        "e": "konservasyon",
        "m": "KORUMA = Eseri dondurma, bozulmasını durdurma (ekleme yapmadan)."
      },
      {
        "e": "restorasyon",
        "m": "ONARIM = Kırık veya hasarlı eseri aslına sadık tamir etme."
      },
      {
        "e": "rekonstruksiyon",
        "m": "YENİDEN YAPIM = Yok olmuş bir yapıyı sıfırdan inşa etme."
      }
    ],
    "capa": "Yıkılmış sütun parçalarını kendi taşlarıyla ayağa kaldırmaya ANASTİLOSİS denir. Eseri bozunmaya karşı dondurup korumak ise KONSERVASYON'dur.",
    "film": [
      {
        "s": "Orijinal mimari parçaların yerlerine yerleştirilerek yapının ayağa kaldırılmasına ne denir?",
        "c": "Anastilosis."
      },
      {
        "s": "Eserin mevcut durumunu dondurup bozulmasını önleme işlemine ne ad verilir?",
        "c": "Konservasyon."
      },
      {
        "s": "Tamamen yok olmuş bir yapının çizim ve belgelere dayanılarak yeniden inşa edilmesine ne denir?",
        "c": "Rekonstrüksiyon."
      }
    ]
  },
  {
    "id": "TT-01",
    "ana": "Genel Türk Tarihi ve Kültürü",
    "alt": "İslam Öncesi Türk Tarihi",
    "ad": "Bozkırın Üç Otağı: Hunlar, Göktürkler ve Uygurlar",
    "sahne": "Ötüken bozkırında 3 büyük otağ yükselir: Birinci otağda Mete Han ıslıklı oku fırlatıp onlu ordu nizamını kurar (M.Ö. 209). İkinci otağda Bilge Kağan ve Vezir Tonyukuk, 'Türk' adını kazıdıkları Orhun Yazıtları dikilitaşlarının başında durur. Üçüncü otağda ise Uygur hükümdarı Bögü Kağan çadırı bırakıp kerpiç şehirlere yerleşir; duvara Maniheizm freskleri çizer ve matbaada harf dizer.",
    "kod": [
      {
        "e": "hunlar",
        "m": "Mete Han + Onlu Teşkilat (M.Ö. 209) + Islıklı Ok = Türk Kara Kuvvetleri temeli."
      },
      {
        "e": "gokturkler",
        "m": "'Türk' adını kullanan ilk devlet + Orhun Yazıtları (Tonyukuk, Kül Tigin, Bilge Kağan)."
      },
      {
        "e": "uygurlar",
        "m": "Uygar Uygurlar = İlk yerleşik hayata geçen, tarım yapan ve matbaa kullanan Türkler."
      }
    ],
    "capa": "'Türk' adını ilk kullanan = GÖKTÜRKLER; yerleşik hayata geçip şehir kuran ve Maniheizm'i benimseyen = UYGURLAR'dır.",
    "film": [
      {
        "s": "Tarihte 'Türk' adını resmi devlet adı olarak kullanan ilk devlet hangisidir?",
        "c": "Göktürkler (Köktürkler)."
      },
      {
        "s": "Yerleşik hayata geçen ilk Türk devleti hangisidir?",
        "c": "Uygurlar."
      },
      {
        "s": "Türk ordusundaki onlu teşkilatı kuran Asya Hun hükümdarı kimdir?",
        "c": "Mete Han (M.Ö. 209)."
      }
    ]
  },
  {
    "id": "TT-02",
    "ana": "Genel Türk Tarihi ve Kültürü",
    "alt": "Türk-İslam Devletleri",
    "ad": "Kervansaray Kitap Sandığı ve Karahanlı Dörtlüsü",
    "sahne": "Tarihi kervansaray salonunda altın işlemeli 4 el yazması kitap açık durur: Yusuf Has Hacib elinde teraziyle hükümdara mutluluk yasasını anlatır (Kutadgu Bilig); Kaşgarlı Mahmud elinde renkli dünya haritasıyla Türkçe kelimeleri sıralar (Divanü Lugati't-Türk); Edib Ahmed ahlak kapısında öğüt verir (Atabetü'l-Hakayık); Ahmed Yesevi ise dervişleriyle hikmet söyler (Divan-ı Hikmet).",
    "kod": [
      {
        "e": "kutadgu_bilig",
        "m": "Yusuf Has Hacib = 'Kutlu/Mutluluk Veren Bilgi' (İlk Türk-İslam siyasetnamesi)."
      },
      {
        "e": "divanu_lugatit_turk",
        "m": "Kaşgarlı Mahmud = İlk Türkçe Sözlük + İlk Dünya Haritası."
      },
      {
        "e": "atabetul_hakayik",
        "m": "Edib Ahmed Yükneki = 'Hakikatlerin Eşiği' (Ahlak kitabı)."
      },
      {
        "e": "divani_hikmet",
        "m": "Hoca Ahmed Yesevi = Tasavvufi şiirler/hikmetler."
      }
    ],
    "capa": "İlk Türkçe sözlük ve Türk dünyası haritası = DİVANÜ LUGATİ'T-TÜRK; ilk Türk-İslam siyasetnamesi ve mesnevisi = KUTADGU BİLİG'dir.",
    "film": [
      {
        "s": "İlk Türkçe sözlük olan Divanü Lugati't-Türk'ün yazarı kimdir?",
        "c": "Kaşgarlı Mahmud."
      },
      {
        "s": "Kutadgu Bilig'in yazarı kimdir ve ne anlama gelir?",
        "c": "Yusuf Has Hacib; 'Mutluluk Veren Bilgi'."
      },
      {
        "s": "Pir-i Türkistan olarak bilinen ve Divan-ı Hikmet'i yazan mutasavvıf kimdir?",
        "c": "Hoca Ahmed Yesevi."
      }
    ]
  },
  {
    "id": "TT-03",
    "ana": "Genel Türk Tarihi ve Kültürü",
    "alt": "Anadolu Selçukluları ve Beylikler",
    "ad": "Selçuklu'nun Dört Savaş Menzili",
    "sahne": "Anadolu haritasında 4 büyük savaş sancağı dikilidir: 1040 Dandanakan'da Tuğrul ve Çağrı beyler Gaznelileri yenip devleti kurar. 1071 Malazgirt'te Sultan Alparslan beyaz kefenini giyip Anadolu'nun kapılarını açar. 1176 Miryokefalon'da II. Kılıçarslan Bizans'ı bozguna uğratıp Anadolu'nun tapusunu alır. 1243 Kösedağ'da ise Moğol süvarileri Selçuklu ordusunu dağıtır.",
    "kod": [
      {
        "e": "dandanakan_1040",
        "m": "Dandanakan = Büyük Selçuklu'nun resmen kuruluşu."
      },
      {
        "e": "malazgirt_1071",
        "m": "Malazgirt = Anadolu'nun kapılarının Türklere açılışı (Yurt AÇAN)."
      },
      {
        "e": "miryokefalon_1176",
        "m": "Miryokefalon = Anadolu'nun Türk yurdu olduğunun kesinleşmesi (Yurt TUTAN)."
      },
      {
        "e": "kosedag_1243",
        "m": "Kösedağ = Selçuklu'nun yıkılış ve II. Beylikler dönemine girişi."
      }
    ],
    "capa": "Malazgirt = Yurt AÇAN savaş; Miryokefalon = Yurt TUTAN (Anadolu'nun tapusunu alan) savaştır. Kösedağ ise Moğol istilası felaketidir.",
    "film": [
      {
        "s": "Anadolu'nun kapılarını Türklere açan savaş ve tarihi hangisidir?",
        "c": "1071 Malazgirt Savaşı."
      },
      {
        "s": "Anadolu'nun kesin olarak Türk yurdu olduğunu tescilleyen savaş hangisidir?",
        "c": "1176 Miryokefalon Savaşı."
      },
      {
        "s": "Anadolu Selçuklu Devleti'nin Moğollara yenilerek yıkılış sürecine girdiği savaş hangisidir?",
        "c": "1243 Kösedağ Savaşı."
      }
    ]
  },
  {
    "id": "TT-04",
    "ana": "Genel Türk Tarihi ve Kültürü",
    "alt": "Osmanlı Tarihi",
    "ad": "Kapıdan Kapıya Osmanlı İmparatorluğu",
    "sahne": "Topkapı Sarayı Bâb-ı Hümâyûn kapısında Osmanlı tarihi canlanır: 1453'te Fatih karadan gemileri yürütüp fetheder. Yavuz Sultan Selim Çaldıran ve Ridaniye seferleriyle kutsal emanetleri ve hilafeti İstanbul'a getirir. Kanuni Sultan Süleyman Mohaç sahrasında zafer kazanır. Karşı köşede Divan-ı Hümayun toplanır: Sadrazam mührü taşır, Şeyhülislam fetva verir, Nişancı tuğra çeker.",
    "kod": [
      {
        "e": "fatih",
        "m": "1453 Çağ açan fetih + Topkapı Sarayı + Fatih Kanunnamesi."
      },
      {
        "e": "yavuz",
        "m": "8 yıla 80 yıllık iş sığdıran sultan = Mısır Seferi + Halifelik."
      },
      {
        "e": "divan_ucsu",
        "m": "Seyfiye (Kılıç/Yönetim) + İlmiye (Hukuk/Eğitim) + Kalemiye (Yazışma/Maliye)."
      }
    ],
    "capa": "Divan'da tuğra çeken ve fethedilen toprakları tahrir defterine kaydeden görevli NİŞANCI'dır. Hukuk ve adalet işlerine ise KAZASKER bakar.",
    "film": [
      {
        "s": "Osmanlı'da padişah fermanlarına tuğra çeken Divan üyesi kimdir?",
        "c": "Nişancı."
      },
      {
        "s": "Mısır seferiyle halifeliği Osmanlı'ya getiren padişah kimdir?",
        "c": "Yavuz Sultan Selim."
      },
      {
        "s": "Divan-ı Hümayun'da eğitim ve yargı sınıfını temsil eden zümre hangisidir?",
        "c": "İlmiye sınıfı."
      }
    ]
  },
  {
    "id": "TT-05",
    "ana": "Genel Türk Tarihi ve Kültürü",
    "alt": "Çağdaş Türk Dünyası ve Cumhuriyet",
    "ad": "Millî Mücadele, Üç Taş İnkılabı ve Bağımsız Türk Cumhuriyetleri",
    "sahne": "Ankara TBMM binası önünde Atatürk, 19 Mayıs 1919 Samsun çıkışıyla başlayan mücadeleyi 29 Ekim 1923'te Cumhuriyet ile taçlandırır. Meydanda üç büyük devrim taşı parlar: Saltanatın kaldırılması (1922), Halifeliğin kaldırılması (1924) ve Medeni Kanun (1926). Arka fonda 1991'de Sovyetlerin dağılmasıyla bağımsız olan 5 Türk Cumhuriyetinin (Azerbaycan, Kazakistan, Özbekistan, Türkmenistan, Kırgızistan) bayrakları dalgalanır.",
    "kod": [
      {
        "e": "cumhuriyet_zinciri",
        "m": "19 Mayıs 1919 Samsun → 23 Nisan 1920 TBMM → 29 Ekim 1923 Cumhuriyet."
      },
      {
        "e": "bagimsiz_turkler_1991",
        "m": "1991 Sovyet Dağılması = AKÖTK (Azerbaycan, Kazakistan, Özbekistan, Türkmenistan, Kırgızistan)."
      }
    ],
    "capa": "Lozan Barış Antlaşması (24 Temmuz 1923) ile kapitülasyonlar tamamen kaldırılmış ve Türkiye Cumhuriyeti'nin sınırları tescil edilmiştir. 1991'de bağımsız olan 5 kardeş Türk cumhuriyeti sınavların vazgeçilmez sorusudur.",
    "film": [
      {
        "s": "Cumhuriyet hangi tarihte ilan edilmiştir?",
        "c": "29 Ekim 1923."
      },
      {
        "s": "Türkiye Cumhuriyeti'nin kurucu tapu senedi sayılan barış antlaşması hangisidir?",
        "c": "Lozan Barış Antlaşması (24 Temmuz 1923)."
      },
      {
        "s": "1991'de bağımsızlığını kazanan Orta Asya Türk cumhuriyetleri hangileridir?",
        "c": "Kazakistan, Özbekistan, Türkmenistan, Kırgızistan (ayrıca Kafkasya'da Azerbaycan)."
      }
    ]
  },
  {
    "id": "MD-01",
    "ana": "Mitoloji & Dinler Tarihi",
    "alt": "Antik Yunan-Roma Mitolojisi",
    "ad": "Olimpos Kulesi ve 12 Tanrı Zirvesi",
    "sahne": "Bulutların üstündeki Olimpos Dağı tahtında Zeus elinde şimşek demetiyle oturur; yanında kıskanç kraliçe Hera tavus kuşuyla durur. Denizlerde Poseidon üç çatallı yabasıyla fırtına koparırken, yer altında Hades üç başlı köpeği Kerberos'la bekler. Zırhlı bilgelik tanrıçası Athena baykuşuyla kalkan tutar; kanatlı sandaletli haberci Hermes haberi hızla ulaştırır.",
    "kod": [
      {
        "e": "zeus_jupiter",
        "m": "Göklerin hâkimi ve şimşek tanrısı."
      },
      {
        "e": "poseidon_neptun",
        "m": "Denizler ve depremler tanrısı (üç dişli mızrak)."
      },
      {
        "e": "athena_minerva",
        "m": "Akıl, strateji ve savaş tanrıçası (baykuş + zeytin dalı)."
      },
      {
        "e": "hermes_merkur",
        "m": "Kanatlı sandaletli tüccar ve haberci tanrı."
      }
    ],
    "capa": "Yunan mitolojisindeki isimler ile Roma karşılıkları: Zeus = Jüpiter, Hera = Juno, Poseidon = Neptün, Athena = Minerva, Aphrodite = Venüs, Ares = Mars, Hermes = Merkür.",
    "film": [
      {
        "s": "Poseidon'un Roma mitolojisindeki karşılığı nedir?",
        "c": "Neptün."
      },
      {
        "s": "Zeytin dalı ve baykuşla simgelenen bilgelik tanrıçası kimdir?",
        "c": "Athena (Minerva)."
      },
      {
        "s": "Haberci ve tüccarların koruyucusu kanatlı sandaletli tanrı kimdir?",
        "c": "Hermes (Merkür)."
      }
    ]
  },
  {
    "id": "MD-02",
    "ana": "Mitoloji & Dinler Tarihi",
    "alt": "İbrahimi Dinler & Kutsal Mekânlar",
    "ad": "Anadolu'nun Yedi Kilisesi, Ekümenik Konsiller ve Gök Tanrı",
    "sahne": "Ege haritasında İncil'in Vahiy bölümünde geçen 7 kutsal kandil yanar (Efes, İzmir, Bergama, Tiyatira, Sardes, Filadelfiya, Laodikea). İznik Gölü kıyısında toplanan I. Konsil'de (325) piskoposlar İncil metinlerini tartışır. Gökyüzü terasında ise Altay şamanı davul çalar; iyilik tanrısı Ülgen 17. kat gökte nur saçarken, yer altındaki Erlik kara tahtında oturur.",
    "kod": [
      {
        "e": "yedi_kilise",
        "m": "Batı Anadolu'da yer alan 7 Vahiy Kilisesi: Efes, Smyrna (İzmir), Bergama, Tiyatira (Akhisar), Sardes (Salihli), Filadelfiya (Alaşehir), Laodikea (Denizli)."
      },
      {
        "e": "iznik_konsili",
        "m": "325 İznik = Hristiyanlığın ilk Ekümenik Konsili (Arianizm tartışması)."
      },
      {
        "e": "tengrizm",
        "m": "Ülgen (iyilik ve gök) vs Erlik (kötülük ve yer altı) + Umay (bereket ana)."
      }
    ],
    "capa": "Hristiyanlıktaki '7 Kilise' bir bina değil, Batı Anadolu'daki 7 ÖNEMLİ CEMAAT/ŞEHİRDİR. Hepsi Türkiye sınırları içerisindedir.",
    "film": [
      {
        "s": "İncil'de adı geçen 7 Vahiy Kilisesi hangi coğrafyada yer alır?",
        "c": "Batı Anadolu (Ege Bölgesi / Türkiye)."
      },
      {
        "s": "Hristiyanlıkta ilk genel (ekümenik) konsil nerede ve ne zaman toplanmıştır?",
        "c": "325 yılında İznik'te (Nikaia)."
      },
      {
        "s": "Eski Türk inancında göğün ve iyiliğin efendisi olan tanrı kimdir?",
        "c": "Ülgen."
      }
    ]
  },
  {
    "id": "TC-01",
    "ana": "Türkiye'nin Turizm Coğrafyası",
    "alt": "Fiziki Coğrafya ve Kaynaklar",
    "ad": "Volkanlar Hattı, Kırık Dağlar ve Nehir Kuşakları",
    "sahne": "Türkiye gökyüzünden süzülen bir leyleğin gözünden görünür: Ege'de Horst ve Graben kırık dağları (Kaz, Madra, Yunt, Boz, Aydın, Menteşe) denize dik uzanır. İç ve Doğu Anadolu'da volkanik koniler dizi halinde parlar: Erciyes, Hasan Dağı, Karadağ, Karacadağ, Nemrut, Süphan, Tendürek ve Ağrı Dağı. Fırat ve Dicle nehirleri Mezopotamya'ya doğru bereket taşırken, Kızılırmak yay çizerek Karadeniz'e dökülür.",
    "kod": [
      {
        "e": "ege_daglari",
        "m": "'Kazma Yutmuş Boz Ayı' = Kaz, Madra, Yunt, Bozdağlar, Aydın dağları."
      },
      {
        "e": "volkanlar",
        "m": "Nemrut (krater gölü), Süphan, Tendürek, Ağrı (en yüksek zirve 5137 m)."
      },
      {
        "e": "kizilirmak",
        "m": "Sınırlarımız içinde doğup sınırlarımız içinde denize dökülen en uzun nehir."
      }
    ],
    "capa": "Türkiye sınırları içindeki EN UZUN nehir = KIZILIRMAK'tır. Ancak havzası en büyük olup sınırlarımız dışına çıkan nehir = FIRAT'tır.",
    "film": [
      {
        "s": "Türkiye sınırları içinde doğup yine Türkiye sınırlarında denize dökülen en uzun nehir hangisidir?",
        "c": "Kızılırmak."
      },
      {
        "s": "Türkiye'nin en yüksek zirvesi hangisidir ve kaç metredir?",
        "c": "Büyük Ağrı Dağı (5137 metre)."
      },
      {
        "s": "Ege Bölgesi'ndeki kırık dağ sıralanışına örnek veriniz?",
        "c": "Kaz Dağı, Madra, Yunt, Bozdağlar, Aydın Dağları."
      }
    ]
  },
  {
    "id": "TC-02",
    "ana": "Türkiye'nin Turizm Coğrafyası",
    "alt": "İlginç Doğal Oluşumlar ve Karstik Şekiller",
    "ad": "Pamukkale Travertenleri, Cennet-Cehennem ve Mağaralar",
    "sahne": "Denizli Pamukkale'de bembeyaz kalker traverten basamaklarından termal su buharlaşarak akar. Mersin Silifke'de yerin dibine çöken devasa Cennet ve Cehennem karstik obrukları ağzını açmıştır. Tokat Ballıca Mağarası'nda soğan biçimli sarkıtlar sarkar. Toroslar boyunca kireçtaşının erimesiyle oluşan kanyonlar ve düdenler sıralanır.",
    "kod": [
      {
        "e": "karstik_sekiller",
        "m": "Traverten (birikim) + Obruk/Mağara (aşınım) = Kireçtaşının kalsiyum karbonat erimesi."
      },
      {
        "e": "ballica",
        "m": "Soğan sarkıtlarıyla dünyaca ünlü Tokat mağarası."
      },
      {
        "e": "cennet_cehennem",
        "m": "Mersin Silifke'de yer altı mağara tavanının çökmesiyle oluşan karstik obruklar."
      }
    ],
    "capa": "Pamukkale travertenleri KARSTİK BİRİKİM şeklidir; Cennet-Cehennem obrukları ise KARSTİK AŞINIM (tavan çökmesi) şeklidir.",
    "film": [
      {
        "s": "Pamukkale travertenleri hangi jeolojik süreçle oluşmuştur?",
        "c": "Karstik birikim (Kalsiyum bikarbonatlı termal suların çökeltisi)."
      },
      {
        "s": "Cennet-Cehennem çöküntüleri hangi karstik yer şeklidir?",
        "c": "Obruk."
      },
      {
        "s": "Nadir görülen soğan sarkıtlarıyla bilinen mağaramız nerededir?",
        "c": "Ballıca Mağarası (Tokat)."
      }
    ]
  },
  {
    "id": "TC-03",
    "ana": "Türkiye'nin Turizm Coğrafyası",
    "alt": "Turizm Türleri ve Destinasyonları (Sağlık ve Termal)",
    "ad": "Beş Şifalı Kaplıca, Talasso ve Ege Termal Kuşağı",
    "sahne": "Ege jeotermal fay hattı boyunca 5 şifalı tedavi merkezi yükselir: Sıcak mineralli suyla dolu termal havuz (Termalizm), deniz suyu ve yosunla dolu kıyı havuzu (Talassoterapi), şifalı siyah bataklık çamuru (Peloidoterapi), temiz yayla havası kürleri (Klimatizm) ve mineralli içme/banyo kürü (Balneoterapi). Afyon Sandıklı'da romatizmalı hastalar çamura gömülürken, Denizli Karahayıt'ta 60 derecelik kırmızı termal su fışkırır.",
    "kod": [
      {
        "e": "bes_dogal_tedavi",
        "m": "Termal (sıcak mineral su) + Talasso (deniz suyu/iklimi) + Peloido (şifalı çamur) + Balneo (banyo) + Klimatizm (dağ/yayla iklimi)."
      },
      {
        "e": "ege_baskentleri",
        "m": "Afyon (Sandıklı & Gazlıgöl çamuru) + Denizli (Karahayıt kırmızı suyu) + Bursa & Yalova (tarihi kaplıcalar)."
      },
      {
        "e": "uc_tesis_turu",
        "m": "Medikal Turizm (hastane/ameliyat) vs Termal-Spa (şifa ve kaplıca) vs Wellness (zindelik ve rahatlama)."
      }
    ],
    "capa": "TALASSOTERAPİ = Deniz suyu, deniz iklimi ve yosunla yapılan tedavidir (asla termal kükürtlü yeraltı suyu ile karıştırma). PELOİDOTERAPİ ise şifalı çamur banyosudur.",
    "film": [
      {
        "s": "Deniz suyu, deniz iklimi ve yosun kürleriyle uygulanan tedavi yöntemine ne ad verilir?",
        "c": "Talassoterapi."
      },
      {
        "s": "Kırmızı renkli termal suyu ve travertenleriyle ünlü sağlık turizmi merkezimiz neresidir?",
        "c": "Karahayıt (Denizli)."
      },
      {
        "s": "Şifalı çamur kullanılarak yapılan tedaviye tıp dilinde ne ad verilir?",
        "c": "Peloidoterapi."
      }
    ]
  },
  {
    "id": "ME-01",
    "ana": "Turist Rehberliği Mevzuatı ve Etiği",
    "alt": "Meslek Kanunu (6326) ve Odalar",
    "ad": "13 Kapılı Koridor ve Ruhsatın Hukuku",
    "sahne": "Dört katlı mevzuat binasının girişinde bir rehber duvara asılı çerçeveli Ruhsatnamesini gösterir (ömür boyu geçerli diploma). Yanında TUREB görevlisi rehberin boynuna takması için 1 yıl geçerli bandrollü Çalışma Kartını uzatır. Masada 6326 Sayılı Meslek Kanunu açıktır. Alt salonda A, B ve C grubu seyahat acentalarının yetki belgeleri sıralanmıştır.",
    "kod": [
      {
        "e": "ruhsatname",
        "m": "Bakanlık verir = Ömür boyu geçerlidir (Mesleğe kabul hakkı)."
      },
      {
        "e": "calisma_karti",
        "m": "TUREB verir = 1 YIL geçerlidir (Eylemli rehberlik vizesi)."
      },
      {
        "e": "eylemli_vs_eylemsiz",
        "m": "Çalışma kartı olan = Eylemli (rehberlik yapabilir); kartı olmayan = Eylemsiz (rehberlik yapamaz)."
      }
    ],
    "capa": "Ruhsatname ömür boyudur ve Bakanlıkça verilir; Çalışma Kartı ise her yıl TUREB tarafından yenilenir. Çalışma kartı olmayan rehber tur anlatamaz (eylemsizdir).",
    "film": [
      {
        "s": "Rehberlik Ruhsatnamesi ile Çalışma Kartı arasındaki temel fark nedir?",
        "c": "Ruhsatname Bakanlıkça ömür boyu verilir; Çalışma kartı TUREB tarafından yıllık verilir."
      },
      {
        "s": "Turist rehberlerinin meslek kanununun numarası kaçtır?",
        "c": "6326 Sayılı Kanun."
      },
      {
        "s": "Çalışma kartı almamış bir rehber sahada tur yönetebilir mi?",
        "c": "Hayır, eylemsiz rehber sayılır ve mesleği icra edemez."
      }
    ]
  },
  {
    "id": "ME-02",
    "ana": "Turist Rehberliği Mevzuatı ve Etiği",
    "alt": "Meslek Etiği",
    "ad": "Mikrofon, Dört İlke Rozeti ve Hanutçuluk Tuzağı",
    "sahne": "Tur otobüsünün önünde rehber ceketinde 4 yıldızlı etik rozetini taşır: Dürüstlük, Tarafsızlık, Gizlilik ve Meslektaş Saygısı. Turistleri zorla belirli bir deri veya lokum mağazasına sokmak isteyen komisyoncu hanutçuya karşı durur; mağaza sahibinin uzattığı gizli komisyon zarfını elinin tersiyle iter. Şikâyet eden turisti LAST kuralıyla (Listen, Apologize, Solve, Thank) sakince dinler.",
    "kod": [
      {
        "e": "dort_etik_ilke",
        "m": "Dürüstlük + Tarafsızlık (din/dil/politika girmeme) + Gizlilik + Meslektaş Saygısı."
      },
      {
        "e": "hanutculuk",
        "m": "Rehberin en ağır mesleki suçlarından biri: Haksız kazanç ve zorunlu alışveriş yönlendirmesi."
      },
      {
        "e": "last_kurali",
        "m": "L-A-S-T = Dinle (Listen) → Özür dile/anla (Apologize) → Çöz (Solve) → Teşekkür et (Thank)."
      }
    ],
    "capa": "Hanutçuluk (gizli komisyon veya zoraki alışveriş yönlendirmesi) hem 6326 sayılı kanuna hem meslek etiğine aykırıdır ve ağır disiplin/para cezası yaptırımı vardır.",
    "film": [
      {
        "s": "Rehberlik meslek etiğinin 4 temel ilkesi nelerdir?",
        "c": "Dürüstlük, Tarafsızlık, Gizlilik, Meslektaş Saygısı."
      },
      {
        "s": "Rehberlerin alışverişten gizli komisyon alması veya turistleri zorlamasına ne ad verilir?",
        "c": "Hanutçuluk."
      },
      {
        "s": "Şikâyet yönetimindeki LAST kuralının açılımı nedir?",
        "c": "Listen (Dinle), Apologize (Özür dile), Solve (Çöz), Thank (Teşekkür et)."
      }
    ]
  },
  {
    "id": "SY-01",
    "ana": "Genel Sağlık Bilgisi ve İlk Yardım",
    "alt": "İlk Yardımın Temel İlkeleri ve Acil Durumlar",
    "ad": "Altın Sıra: KBK, ABC ve Heimlich Manevrası",
    "sahne": "Kaza yerinde ilk yardımcı sırasıyla müdahale eder: Önce güvenlik üçgeniyle çevre emniyetini alır (Koruma), 112'yi aratır (Bildirme) ve yaralıya geçer (Kurtarma). Bilinci kapalı yaralıda ABC kontrolü yapar: Çeneyi yukarı kaldırıp soluk yolunu açar (A), 10 saniye Bak-Dinle-Hisset ile solunumu dinler (B), 30 kalp masajı ve 2 suni solunumla dolaşımı sağlar (C). Boğazına yemek kaçıp ellerini boynuna götüren turistin arkasına geçip göbek ile göğüs kemiği arasına yumrukla Heimlich manevrası uygular.",
    "kod": [
      {
        "e": "kbk_kurali",
        "m": "Koruma (çevre güvenliği) → Bildirme (112 Acil) → Kurtarma (müdahale)."
      },
      {
        "e": "abc_zinciri",
        "m": "A (Airway - Hava yolu açma) → B (Breathing - Solunum 10 sn) → C (Circulation - 30 Kalp Masajı : 2 Solunum)."
      },
      {
        "e": "heimlich",
        "m": "Tam tıkanmada (nefes alamayan, konuşamayan) karına bası manevrası."
      }
    ],
    "capa": "Kısmi tıkanmada (öksürebilen, ses çıkaran kişi) KESİNLİKLE sırta vurulmaz, sadece öksürmeye teşvik edilir! Heimlich yalnızca TAM TIKANMADA uygulanır.",
    "film": [
      {
        "s": "İlk yardımın temel aşamaları olan KBK'nin açılımı nedir?",
        "c": "Koruma, Bildirme (112), Kurtarma."
      },
      {
        "s": "Temel Yaşam Desteğinde yetişkinlerde kalp masajı ve suni solunum oranı kaçtır?",
        "c": "30 Kalp Masajı : 2 Suni Solunum."
      },
      {
        "s": "Tam tıkanma yaşayan ve nefes alamayan kişiye hangi manevra uygulanır?",
        "c": "Heimlich Manevrası."
      }
    ]
  },
  {
    "id": "IL-01",
    "ana": "İletişim ve Rehberlik Becerileri",
    "alt": "İletişimin Temel Ögeleri ve Türleri",
    "ad": "İletişim Döngüsü, Beden Dili ve Kişisel Alan Çemberleri",
    "sahne": "Rehber (Kaynak) mikrofonla (Kanal) ören yeri hikayesini anlatır (Mesaj); turist grubu (Alıcı) gülümseyip başını sallar (Dönüt/Geri bildirim). Arkadan geçen helikopter sesi iletişimi bozar (Fiziksel Gürültü). Rehberin etrafında iç içe 4 renkli mesafe çemberi çizilidir: 0-45 cm Mahrem alan, 45-120 cm Kişisel alan, 1.2-3.6 m Sosyal alan ve 3.6 m üzeri Genel kamusal alan.",
    "kod": [
      {
        "e": "iletisim_beslisi",
        "m": "Kaynak → Mesaj → Kanal → Alıcı → Dönüt (En kritik halka dönüttür)."
      },
      {
        "e": "gurultu",
        "m": "Mesajın doğru algılanmasını engelleyen her türlü içsel veya dışsal parazit."
      },
      {
        "e": "alan_cemberleri",
        "m": "Mahrem (0-45 cm) | Kişisel (45-120 cm) | Sosyal (1.2-3.6 m) | Kamusal (3.6 m+)."
      }
    ],
    "capa": "İletişimin başarılı olduğunu gösteren ve döngüyü tamamlayan yegâne unsur GERİ BİLDİRİM (Dönüt)'tür. Rehber ile turist grubu arasındaki ideal tur anlatım mesafesi SOSYAL ALAN (1.2 - 3.6 metre)'dır.",
    "film": [
      {
        "s": "İletişim sürecinin başarıyla tamamlandığını gösteren son öge nedir?",
        "c": "Geri bildirim (Dönüt)."
      },
      {
        "s": "Rehber ile turist grubu arasındaki 1.2 - 3.6 metre arası mesafe hangi alan kategorisidir?",
        "c": "Sosyal Alan."
      },
      {
        "s": "0 - 45 cm arası sadece çok yakınların girebildiği mesafe hangisidir?",
        "c": "Mahrem Alan."
      }
    ]
  },
  {
    "id": "IL-02",
    "ana": "İletişim ve Rehberlik Becerileri",
    "alt": "Turist Tipleri ve Motivasyon",
    "ad": "Havalimanı Terminali: Plog'un Yolcuları ve Cohen'in Gezginleri",
    "sahne": "Havalimanında iki farklı yolcu tipi dikkat çeker: Sırt çantasıyla kimsenin gitmediği patikalara koşan maceracı Allosentrik turist ve elinde standart paket tur programı, tanıdık yemek ve güvence arayan kaygılı Psikosentrik turist. Yanlarında Cohen'in güvenli turizm balonunda kalan örgütlü kitle turisti ile yerel halkın arasına karışan Drifter (serseri gezgin) valiz bekler.",
    "kod": [
      {
        "e": "plog_modeli",
        "m": "Allosentrik (Yenilikçi, maceracı, keşifçi) vs Psikosentrik (Tanıdık, güvenli, paket turcu) vs Mezosentrik (Orta yolcular)."
      },
      {
        "e": "cohen_tipleri",
        "m": "Örgütlü Kitle Turisti (tam korumalı balon) → Bireysel Kitle Turisti → Gezgin (Explorer) → Bağımsız Serseri (Drifter)."
      },
      {
        "e": "motivasyon",
        "m": "İtici Güçler (kaçış, stres atma, merak) vs Çekici Güçler (güneş, kum, tarih, ucuzluk)."
      }
    ],
    "capa": "Plog modelinde maceracı ve risk alan turist = ALLOSENTRİK; riskten kaçıp bilindik otellere giden = PSİKOSENTRİK'tir. Çoğunluk ise Mezosentrik gruptadır.",
    "film": [
      {
        "s": "Plog'un tipolojisinde maceracı, keşifçi ve bağımsız hareket eden turist kimdir?",
        "c": "Allosentrik turist."
      },
      {
        "s": "Cohen'in sınıflandırmasında turizm kurumlarını tamamen reddedip yerel halk gibi yaşayan turist tipine ne denir?",
        "c": "Drifter (Serseri Gezgin)."
      },
      {
        "s": "Tanıdık çevre arayan, risk almayan ve paket turları tercih eden turist tipi hangisidir?",
        "c": "Psikosentrik turist."
      }
    ]
  },
  {
    "id": "IL-03",
    "ana": "İletişim ve Rehberlik Becerileri",
    "alt": "Turizm Sosyolojisi",
    "ad": "Doxey İrritasyon İndeksi, Gösteri Etkisi ve Kültürel Metalaşma",
    "sahne": "Tarihi bir sahil kasabasında 4 basamaklı Doxey merdiveni yükselir: İlk basamakta turistleri alkışla karşılayan esnaf (Öfori/Coşku), ikinci basamakta turisti sadece para olarak gören kayıtsız halk (Apati), üçüncü basamakta kalabalıktan ve trafikten bıkıp homurdanan köylüler (İrritasyon) ve en üstte turiste 'Buradan gidin!' diye bağıran öfkeli göstericiler (Antagonizm/Düşmanlık). Kasabanın gençleri gelen turistlerin kıyafetlerini taklit eder (Gösteri Etkisi); meydanda ise para karşılığı yapay kına gecesi oynanır (Kültürel Metalaşma).",
    "kod": [
      {
        "e": "doxey_dortlusu",
        "m": "Öfori (Coşku) → Apati (Kayıtsızlık) → İrritasyon (Rahatsızlık) → Antagonizm (Düşmanlık)."
      },
      {
        "e": "gosteri_etkisi",
        "m": "Demonstration Effect = Yerel halkın turistlerin tüketim, giyim ve yaşam alışkanlıklarını özenip taklit etmesi."
      },
      {
        "e": "kulturel_metalasma",
        "m": "Kültürün ticarileşmesi = Otantik geleneklerin ve ritüellerin turist çekmek için yapay bir metaya/gösteriye dönüştürülmesi."
      },
      {
        "e": "sosyal_tasima_kapasitesi",
        "m": "Yerel halkın turist yoğunluğuna tahammül edebilme psikolojik eşiği."
      }
    ],
    "capa": "Doxey İrritasyon İndeksi'nin son ve en tehlikeli aşaması ANTAGONİZM (Düşmanlık)'dir. Yerel halkın turistleri taklit etmesi ise GÖSTERİ ETKİSİ (Demonstration Effect)'dir.",
    "film": [
      {
        "s": "Doxey İrritasyon İndeksi'nin 4 aşaması sırasıyla nelerdir?",
        "c": "1. Öfori (Coşku) → 2. Apati (Kayıtsızlık) → 3. İrritasyon (Rahatsızlık) → 4. Antagonizm (Düşmanlık)."
      },
      {
        "s": "Yerel gençlerin turistlerin davranış ve giyim tarzlarını taklit etmesine ne denir?",
        "c": "Gösteri Etkisi (Demonstration Effect)."
      },
      {
        "s": "Otantik yerel kültür ögelerinin para karşılığı ticari bir gösteriye dönüştürülmesine ne denir?",
        "c": "Kültürel Metalaşma."
      }
    ]
  },
  {
    "id": "GM-01",
    "ana": "Güncel Turizm ve Miras",
    "alt": "UNESCO Alanları ve Yaşayan Miras",
    "ad": "UNESCO Dünya Mirası Türkiye Haritası ve Somut Olmayan Miras",
    "sahne": "Türkiye haritası üzerinde UNESCO altın mühürleri parıldar: 1985'te listeye ilk giren Divriği Ulu Camii ve İstanbul'un Tarihi Alanları; hem doğal hem kültürel karma miras olan Göreme-Kapadokya ve Pamukkale-Hierapolis. Yanında Gordion ve en son listeye giren Manisa Sardes & Bin Tepe Tümülüsleri yer alır. Meydanda Karagöz perdesi açılmış, usta ebru teknesinden kağıt çekerken bakır ustası Antep İşi nakış işler.",
    "kod": [
      {
        "e": "ilk_unesco_1985",
        "m": "Divriği Ulu Camii + İstanbul Tarihi Alanları + Göreme-Kapadokya (1985)."
      },
      {
        "e": "karma_miras",
        "m": "Türkiye'de hem DOĞAL hem KÜLTÜREL miras olan sadece 2 yer vardır: Göreme/Kapadokya ve Pamukkale/Hierapolis."
      },
      {
        "e": "somut_olmayan",
        "m": "Meddahlık, Karagöz, Âşıklık, Ebru, Çini, Antep İşi Nakışı."
      }
    ],
    "capa": "Türkiye'nin UNESCO Karma (Doğal+Kültürel) Miras Alanları SADECE İKİ TANEDİR: Göreme Millî Parkı ve Kapadokya ile Pamukkale-Hierapolis. Diğer alanların tamamı kültüreldir.",
    "film": [
      {
        "s": "Türkiye'de UNESCO Dünya Miras Listesi'ne giren ilk iki eser (1985) hangileridir?",
        "c": "Divriği Ulu Camii ve Darüşşifası ile İstanbul'un Tarihi Alanları (ayrıca karma olarak Göreme)."
      },
      {
        "s": "Türkiye'deki 2 karma (hem doğal hem kültürel) UNESCO mirası hangileridir?",
        "c": "Göreme Millî Parkı ve Kapadokya ile Pamukkale-Hierapolis."
      },
      {
        "s": "Son dönemde UNESCO Dünya Miras Listesi'ne eklenen Lidya başkenti ve mezar alanı neresidir?",
        "c": "Sardes ve Bin Tepe Tümülüsleri (Manisa)."
      }
    ]
  },
  {
    "id": "GM-02",
    "ana": "Güncel Turizm ve Miras",
    "alt": "Turizm İstatistikleri ve Güncel Gelişmeler",
    "ad": "2025-2026 Turizm Zirvesi ve Küresel Ev Sahipliği",
    "sahne": "Bakanlık sahnesinde dev ekranda 2025-2026 hedefleri ışıldar: 60+ Milyon Ziyaretçi ve 60+ Milyar Dolar Gelir. Giriş kapısında en çok gelen ilk üç ülkenin bayrakları yan yana durur: Rusya, Almanya ve İngiltere. Kürsüde Türkiye'nin 2027 UNESCO Dünya Miras Komitesi toplantısına ev sahipliği yapacağı alkışlarla ilan edilir; İznik Konsili'nin 1700. yılı anısına İznik Gölü kıyısında açılan anıt parlar.",
    "kod": [
      {
        "e": "turist_ilk_uc",
        "m": "R-A-İ Kuralı = 1. Rusya, 2. Almanya, 3. İngiltere (Birleşik Krallık)."
      },
      {
        "e": "unesco_2027",
        "m": "2027 Dünya Miras Komitesi Ev Sahibi = TÜRKİYE."
      },
      {
        "e": "iznik_1700",
        "m": "İznik Konsili'nin 1700. Yıldönümü (325 - 2025/2026)."
      }
    ],
    "capa": "Türkiye'ye en çok turist gönderen ilk üç ülke istatistiğinde liderler RUSYA ve ALMANYA'dır, üçüncü sırada İNGİLTERE gelir.",
    "film": [
      {
        "s": "Türkiye'ye en fazla turist gönderen ilk üç ülke hangileridir?",
        "c": "1. Rusya, 2. Almanya, 3. İngiltere (Birleşik Krallık)."
      },
      {
        "s": "Türkiye hangi yılın UNESCO Dünya Miras Komitesi toplantısına ev sahipliği yapma hakkı kazanmıştır?",
        "c": "2027 yılı."
      },
      {
        "s": "Hristiyanlık tarihi açısından 1700. yıldönümü anılan önemli toplantı nerede yapılmıştır?",
        "c": "İznik (325 İznik Konsili)."
      }
    ]
  },
  {
    "id": "KART-ST-01",
    "ana": "Sanat Tarihi",
    "alt": "Antik Yunan ve Roma Mimarisi",
    "ad": "Antik Yunan ve Roma Mimarisi",
    "sahne": "Mermer bir avluda 5 antik heykel kaidesi yan yana yükselir: Myron, sırtına bağlanan motorla diski fırlatmadan hemen önceki gerilim dolu ANda havada donup kalmıştır. Yanında usta Praxiteles, bir kolunda bebek Dionysos'u tutan Hermes'i, diğer elinde ise ilk çıplak kadın heykeli Knidos Aphroditesi'ni tutar. Polykleitos elinde cetvelle mızrakçı Dorifor'un kusursuz beden oranını ölçer. Yan tarafta 3 sütun nöbet tutar: Asker tıraşlı düz başlıklı Dor, saçları koçboynuzu/volüt kıvrımlı İyon, başında dikenli kenger (akantus) yapraklı taç taşıyan Korint. Köşede ise çatıyı başında taşıyan kadın heykeli Karyatid durur.",
    "kod": [
      {
        "e": "myron",
        "m": "MYRON Motoru = Diski savurmadan hemen önceki 'AN' (Diskobolos)."
      },
      {
        "e": "praxiteles",
        "m": "PRAKtik usta = İki başyapıt tek ustanın elinde (Hermes + Knidos)."
      },
      {
        "e": "polykleitos",
        "m": "POLİ-teknik cetvel = Kusursuz insan oranı kanonu (Dorifor mızrakçı)."
      },
      {
        "e": "sutun_siralamasi",
        "m": "DİK Dur Nizamı: Dor → İyon → Korint (Sadeden en süslüye)."
      },
      {
        "e": "karyatid_atlant",
        "m": "Karyatid = Taş yüküyle 'kariyer' yapan KADIN sütun. Atlant = ERKEK sütun."
      }
    ],
    "capa": "DİSK atan atlet = Myron; MIZRAK taşıyan kusursuz oranlı atlet = Polykleitos. Korint sütun başlığının sınav şifresi daima AKANTUS (kenger) yaprağıdır.",
    "film": [
      {
        "s": "Diskobolos heykelinde yakalanan kritik an nedir ve heykeltıraşı kimdir?",
        "c": "Fırlatmadan hemen önceki an; Myron."
      },
      {
        "s": "Akantus (kenger) yapraklarıyla süslenen sütun başlığı hangisidir?",
        "c": "Korint."
      },
      {
        "s": "Sütun görevi gören kadın heykeline ne ad verilir?",
        "c": "Karyatid (Erkek olanına Atlant denir)."
      }
    ]
  },
  {
    "id": "KART-ST-02",
    "ana": "Sanat Tarihi",
    "alt": "Bizans Sanatı",
    "ad": "Bizans Sanatı",
    "sahne": "Ayasofya Meydanı'nda 532-537 arasında 5 yılda gökyüzüne asılan devasa altın renkli kubbe parlar. Kubbenin altında Aydın/Trallesli geometrici Anthemios ile Miletoslu fizikçi İsidoros, pandantifler üzerine kubbeyi oturtur. Yan kilisede askerler ellerinde kazmalarla duvardaki azize fresklerini parçalamaktadır; yere saçılan mozaik parçaları üzerinde 'İkonoklazm' mührü okunur. Kariye'de ise İsa'nın mezardan insanları çektiği Anastasis diriliş freski ışıldar.",
    "kod": [
      {
        "e": "ayasofya_mimarlari",
        "m": "Batı Anadolu Dehaları: Trallesli (Aydın) Anthemios + Miletoslu (Söke) İsidoros (532-537, 5 yılda tamamlandı)."
      },
      {
        "e": "pandantif",
        "m": "Kare mekândan yuvarlak kubbeye geçiş sağlayan küresel üçgenler."
      },
      {
        "e": "ikonoklazm",
        "m": "İkona (resim) + Klazma (kırma) = 8-9. yüzyıl tasvir kırıcılığı."
      },
      {
        "e": "mozaik_fresk",
        "m": "Tessera = Renkli taş küplerle yapılan mozaik; Fresk = Yaş sıva üstüne boyama."
      }
    ],
    "capa": "Ayasofya'nın mimarları Roma veya Yunanistan'dan değil, BATI ANADOLU'dandır (Tralles ve Miletos). İlk müze mekânı ise Aya İrini'dir.",
    "film": [
      {
        "s": "Ayasofya'yı sadece 5 yılda inşa eden Batı Anadolulu iki mimar kimdir?",
        "c": "Trallesli Anthemios ve Miletoslu İsidoros."
      },
      {
        "s": "Taş küplerle (tessera) yapılan süsleme ile yaş sıvaya yapılan resim sanatı nedir?",
        "c": "Mozaik ve Fresk."
      },
      {
        "s": "Kutsal tasvirlerin parçalandığı Bizans dönemine ne ad verilir?",
        "c": "İkonoklazm."
      }
    ]
  },
  {
    "id": "KART-ST-03",
    "ana": "Sanat Tarihi",
    "alt": "Anadolu Selçuklu ve Beylikler Sanatı",
    "ad": "Anadolu Selçuklu ve Beylikler Sanatı",
    "sahne": "Geniş bir bozkırda taşlaşmış çadır gibi duran külahlı kümbetler yükselir. Erzurum Çifte Minareli Medrese'nin açık avlusundan gökyüzü görünürken, Konya Karatay Medresesi'nin üzeri kapalı bir kubbeyle örtülüdür. Divriği Ulu Camii taçkapısında üç boyutlu mukarnas sarkıtlar ve gölgeyle beliren namaz kılan insan silüeti belirir. Beyşehir Eşrefoğlu Camii'nde sedir ağacından yüzlerce ahşap direk tavanı tutar, ortadaki karlık çukurunda eriyen kar ahşaba nem sağlar.",
    "kod": [
      {
        "e": "medrese_formulu",
        "m": "Erzurum-Sivas AÇIK havada, Konya KAPALI kutuda (Avlu tipi şifresi)."
      },
      {
        "e": "kumbet",
        "m": "Taşlaşmış Çadır: KÜMbette KÜlah var, TÜRbede Kubbe var (Alt kat mumyalık/kripta)."
      },
      {
        "e": "divrigi",
        "m": "1228 Mengücek eseri = Mukarnaslı barok taçkapı (1985 UNESCO)."
      },
      {
        "e": "ahsap_camiler",
        "m": "2023 UNESCO tescilli ahşap direkli camiler: Eşrefoğlu (Beyşehir), Arslanhane (Ankara), Sivrihisar, Afyon, Kasaba Köyü."
      }
    ],
    "capa": "Açık avlulu = Erzurum Çifte Minareli & Sivas Gök Medrese; Kapalı avlulu = Konya Karatay & İnce Minareli. Kümbet silindirik/çokgen gövdeli ve konik külahlıdır.",
    "film": [
      {
        "s": "Kümbet ile türbe arasındaki en belirgin mimari örtü farkı nedir?",
        "c": "Kümbet külahla (konik/piramidal), türbe ise kubbe ile örtülüdür."
      },
      {
        "s": "Taçkapısındaki üç boyutlu taş işçiliğiyle bilinen 1985 UNESCO eseri Selçuklu külliyesi hangisidir?",
        "c": "Divriği Ulu Camii ve Darüşşifası."
      },
      {
        "s": "Kapalı avlulu Selçuklu medreselerine iki klasik örnek hangileridir?",
        "c": "Konya Karatay ve Konya İnce Minareli Medrese."
      }
    ]
  },
  {
    "id": "KART-ST-04",
    "ana": "Sanat Tarihi",
    "alt": "Osmanlı Mimarisi",
    "ad": "Osmanlı Mimarisi",
    "sahne": "Mimar Sinan'ın önünde duran piramitte kubbe sayısı geriye doğru sayılır: 4 yarım kubbeli Şehzade (Çırak), 2 yarım kubbeli Süleymaniye (Kalfa) ve 8 filayağı üzerine oturan tek ana kubbeli Edirne Selimiye (Usta). Yan tarafta öğrencisi Sedefkâr Mehmet Ağa 6 minareli Sultanahmet Camii'ni (Mavi Cami) çizer. Boğaz kıyısında Balyan ailesi Dolmabahçe Sarayı'nı Batı üslubunda yontar. Camide imam merdivenli minbere tırmanırken, hünkâr parmaklıklı mahfilinde dua eder.",
    "kod": [
      {
        "e": "sinan_merdiveni",
        "m": "Kubbe Azaldıkça Ustalık Artar: 4 (Şehzade/Çırak) → 2 (Süleymaniye/Kalfa) → 1 (Selimiye/Usta - Edirne UNESCO)."
      },
      {
        "e": "sultanahmet",
        "m": "Sedefkâr Mehmet Ağa'nın 6 minareli eseri (Sinan eseri SANMA!)."
      },
      {
        "e": "kulliye_uyeleri",
        "m": "MED-DARÜŞ-İMA-TAB-HAM-ARAS (Medrese, Darüşşifa, İmaret/aşevi, Tabhane/nekahat, Hamam, Arasta/çarşı)."
      },
      {
        "e": "minber_mihrap",
        "m": "Minber = Merdivenli hutbe kürsüsü; Mihrap = Kıbleye bakan imam nişi."
      }
    ],
    "capa": "Sultanahmet Camii Sinan'ın değil, öğrencisi Sedefkâr Mehmet Ağa'nındır. İlk Osmanlı Barok camisi ise 1755 tarihli NURUOSMANİYE Camii'dir.",
    "film": [
      {
        "s": "Mimar Sinan'ın ustalık eserindeki taşıyıcı ayak sayısı ve kubbe planı nedir?",
        "c": "8 filayağı üzerine oturan tek ana kubbe (Edirne Selimiye)."
      },
      {
        "s": "6 minareli Sultanahmet Camii'nin mimarı kimdir?",
        "c": "Sedefkâr Mehmet Ağa."
      },
      {
        "s": "Osmanlı'nın ilk Barok üsluplu camisi hangisidir?",
        "c": "Nuruosmaniye Camii."
      }
    ]
  },
  {
    "id": "KART-ST-05",
    "ana": "Sanat Tarihi",
    "alt": "Geleneksel El Sanatları",
    "ad": "Geleneksel El Sanatları",
    "sahne": "Ahşap ustası tek çivi ve tutkal kullanmadan geometrik tahtaları birbirine kündeye getirerek kilitler. Ebru teknesinde kitreli koyu suyun üstüne boya damlatılıp desen kağıda çekilir. Nakkaş Osman minyatürle şehzade sünnetini (Surname) çizerken ne gölge ne de derinlik kullanır; önemli padişah figürünü devasa boyutlarda resmeder. Duvarda mercan kırmızılı İznik çinileri parlar.",
    "kod": [
      {
        "e": "kundekari",
        "m": "Çivisiz ahşap parçaların 'künde güreşi' gibi birbirine kenetlenmesi."
      },
      {
        "e": "minyatur_kurali",
        "m": "Gölge ve perspektif YOKTUR; önemli kişi daima BÜYÜK çizilir (Matrakçı Nasuh, Nakkaş Osman, Levnî)."
      },
      {
        "e": "hat_turleri",
        "m": "Kûfî (köşeli/eski), Sülüs (büyük cami yazısı), Nesih (kitap yazısı). Ekol: Şeyh Hamdullah."
      },
      {
        "e": "tezhip",
        "m": "'TEZ altını getir!' = Kitap sayfalarını altın tozu ve boyayla süsleme sanatı."
      }
    ],
    "capa": "Kündekari tekniğinde ASLA METAL ÇİVİ veya TUTKAL kullanılmaz. Minyatürde ise perspektif ve gölge bulunmaz, hiyerarşik boyutlandırma vardır.",
    "film": [
      {
        "s": "Çivisiz ve tutkalsız geometrik ahşap geçme sanatına ne denir?",
        "c": "Kündekâri."
      },
      {
        "s": "Klasik Osmanlı minyatürünün iki temel kuralı nedir?",
        "c": "Gölge ve perspektifin olmaması; kişilerin makamına göre büyük çizilmesi."
      },
      {
        "s": "Sünnet şenliklerini ve saray düğünlerini anlatan minyatürlü eserlere ne denir?",
        "c": "Surname."
      }
    ]
  },
  {
    "id": "KART-AM-01",
    "ana": "Anadolu Medeniyetleri",
    "alt": "Prehistorya ve Taş Tepeler Zinciri",
    "ad": "Prehistorya ve Taş Tepeler Zinciri",
    "sahne": "Paris metrosunda koşan bir dedektif taş çağlarını sayar. Antalya Karain Mağarası'nda Neandertal insanı çakmaktaşı yontar. Urfa Taş Tepeler projesinde Göbeklitepe ve Karahantepe'de T biçimli dikilitaşlar dairesel tapınak oluşturur. Çayönü'nde insanlar terrazzo mozaik tabanlı evlerde otururken, Aşıklıhöyük'te bir hekim kafatasını delerek beyin ameliyatı yapar. Çatalhöyük'te ise damdan merdivenle girilen sokaksız kerpiç evler yükselir.",
    "kod": [
      {
        "e": "cag_siralamasi",
        "m": "PaMeNe KaTuDe: Paleolitik (Karain) → Mezolitik → Neolitik (Göbeklitepe/Çatalhöyük) → Kalkolitik → Tunç (Kültepe) → Demir."
      },
      {
        "e": "tas_tepeler",
        "m": "GÖBEK'li KARAHAN, NEVALİ'yi baraja düşürdü (Göbeklitepe, Karahantepe, Nevali Çori)."
      },
      {
        "e": "yerlesim_sifreleri",
        "m": "Çayönü = 'Çay TERRAZZO'da içilir' (ilk taban/tarım). Aşıklıhöyük = 'Aşık beynini açtı' (ilk beyin ameliyatı trepanasyon). Çatalhöyük = 'Çatıdan gir' (sokaksız proto-kent)."
      }
    ],
    "capa": "Göbeklitepe yerleşim/köy değil, anıtsal kült/inanç merkezidir. İlk beyin ameliyatı (trepanasyon) Aşıklıhöyük'tedir (Aksaray).",
    "film": [
      {
        "s": "Dünyanın bilinen en eski anıtsal kült ve tapınak merkezi neresidir?",
        "c": "Göbeklitepe (Şanlıurfa)."
      },
      {
        "s": "Anadolu'da ilk beyin ameliyatı (trepanasyon) izi nerede bulunmuştur?",
        "c": "Aşıklıhöyük (Aksaray)."
      },
      {
        "s": "Sokakları olmayan, girişi çatılardan merdivenle sağlanan Neolitik yerleşim hangisidir?",
        "c": "Çatalhöyük (Konya)."
      }
    ]
  },
  {
    "id": "KART-AM-02",
    "ana": "Anadolu Medeniyetleri",
    "alt": "Asur Kolonileri ve İlk Yazı",
    "ad": "Asur Kolonileri ve İlk Yazı",
    "sahne": "Kayseri Kültepe (Kaniş Karumu)'ne giren eşek kervanlarında Asurlu tüccarlar balyaları indirir. Kumaş kutusu (kutanum) açılır, kil mühür topakları (bulla) kırılır ve çivi yazılı kil tabletler tercümana (targumannum) okutulur. Yol üstündeki küçük ara durakta (wabartum) dinlenen tüccarlar, yerel beye (rubaum) vergi öder.",
    "kod": [
      {
        "e": "koloni_sozlugu",
        "m": "KUTAnūm kutu kumaş, BULLA mühürlü kil topak, TARGUMANnum tercüman, WABARTUM ara konaklama durağı."
      },
      {
        "e": "karum",
        "m": "Büyük pazar/ticaret merkezi (Başkent: Kayseri Kültepe / Kaniş Karumu - MÖ 1950 Anadolu'da tarihin başlangıcı)."
      },
      {
        "e": "anadolu_ilkleri",
        "m": "Kültepe yazdı (çivi yazısı) → Kadeş imzaladı (ilk yazılı barış) → Frig iğneledi → Lidya bastı."
      }
    ],
    "capa": "Anadolu'ya yazıyı Hititler değil, Mezopotamyalı ASURLU TÜCCARLAR getirmiştir (MÖ 1950, Kültepe Kaniş).",
    "film": [
      {
        "s": "Anadolu'da tarih çağlarını başlatan çivi yazılı tabletler nerede bulunmuştur?",
        "c": "Kayseri Kültepe (Kaniş Karumu)."
      },
      {
        "s": "Asur Ticaret Kolonileri Çağında kervanların mola verdiği küçük ara istasyonlara ne denir?",
        "c": "Wabartum (Büyük pazara ise Karum denir)."
      },
      {
        "s": "Kil balyaların üzerine basılan mühürlü kil topağa ne ad verilir?",
        "c": "Bulla."
      }
    ]
  },
  {
    "id": "KART-AM-03",
    "ana": "Anadolu Medeniyetleri",
    "alt": "Demir Çağı Uygarlıkları (Hitit, Frig, Lidya, Urartu)",
    "ad": "Demir Çağı Uygarlıkları (Hitit, Frig, Lidya, Urartu)",
    "sahne": "Hattuşa surlarında fırtına tanrısı Teşup boğasıyla gürlerken, kâtipler Anal yıllıklarını yazar. Gordion'da Kral Midas pelerinini fibula iğnesiyle tutturup ahşap kakmalı masada oturur. Sardes'te Paktolos Çayı'ndan çıkarılan elektrum madeniyle ilk para basılır, tüccarlar Kral Yolu'nda koşar. Van Tuşpa Kalesi'nde Urartu kralı savaş tanrısı Haldi'ye seslenir; arkasında kayalara oyulmuş 50 km'lik Şamran su kanalı çağlar.",
    "kod": [
      {
        "e": "baskentler_zinciri",
        "m": "Hattuşa'da HİTİT, Gordion'da FRİG, Sardes'te LİDYA, Tuşpa'da URARTU."
      },
      {
        "e": "hitit",
        "m": "Teşup + Hepat (Tanrılar) • Pankuş (Meclis) • Anal (Tanrıya hesap veren tarafsız yıllık) • Kadeş Antlaşması (MÖ 1270)."
      },
      {
        "e": "frig",
        "m": "Fibula (çengelli iğne) + Tapates (kilim) + Tümülüs mezarlar + Matar/Kibele (Pessinus göktaşı)."
      },
      {
        "e": "lidya",
        "m": "Elektrum sikke + Paktolos Çayı alüvyon altını + Sardes Bintepeler + Kral Yolu."
      },
      {
        "e": "urartu",
        "m": "Taş ustalığı + Şamran Su Kanalı + Tanrı HALDİ + Oda mezarlar."
      }
    ],
    "capa": "Tanrı HALDİ kesinlikle Hitit değil, URARTU baş tanrısıdır! Frig = Ahşap/İğne; Urartu = Taş/Su kanalıdır.",
    "film": [
      {
        "s": "Urartuların baş tanrısı kimdir ve inşa ettikleri 50 km'lik ünlü su kanalı hangisidir?",
        "c": "Baş tanrı Haldi; Şamran (Menua) Su Kanalı."
      },
      {
        "s": "Hitit krallarının zaferleri kadar yenilgilerini de yazdıkları objektif yıllıklara ne denir?",
        "c": "Anal."
      },
      {
        "s": "Elektrumdan (altın-gümüş alaşımı) ilk madeni parayı basan devlet hangisidir?",
        "c": "Lidyalılar (Sardes)."
      }
    ]
  },
  {
    "id": "KART-ARK-01",
    "ana": "Arkeoloji",
    "alt": "Tarihlendirme ve Kazı Terminolojisi",
    "ad": "Tarihlendirme ve Kazı Terminolojisi",
    "sahne": "Kazı alanında bir höyük kat kat dilimlenmiş baklava gibi açılmıştır: Alttaki tabakalar bayat (eski), üsttekiler tazedir (Stratigrafi). Yan tarafta laboratuvarda canlı kemiği C-14 ile ölçülürken, bir dendrolog ağaç halkalarını tek tek sayar; volkanik tüflere kar yağarken K-Ar testi yapılır. Yıkılmış bir kütüphane özgün taşlarıyla ayağa kaldırılır (Anastiloz).",
    "kod": [
      {
        "e": "mutlak_tarihleme",
        "m": "C14 (Canlı organik) • Dendro (Ağaç halkası - Dendrolog) • K-Ar (Volkana KAR yağdı - lav/kül) • Arkeomagnetizma (Fırının manyetik pusulası)."
      },
      {
        "e": "goreceli_tarihleme",
        "m": "Stratigrafi = Kat kat baklava (alttaki eski). Ante = ÖNCE (TAQ), Post = SONRA (TPQ - postacı sonra gelir)."
      },
      {
        "e": "insitu_anastiloz",
        "m": "In-situ = Yerli yerinde (özgün tabaka). Anastiloz = ANA STİLe dönüş (Orijinal parçalarla ayağa kaldırma - Efes Celsus)."
      }
    ],
    "capa": "Stratigrafi yıl vermez, sadece bağıl kıyas yapar. Anastiloz için ORİJİNAL PARÇA şarttır; yeni malzemeyle baştan yapmaya ise 'Rekonstrüksiyon' denir.",
    "film": [
      {
        "s": "Yıkılmış bir antik yapının kendi orijinal taşlarıyla yeniden ayağa kaldırılmasına ne denir?",
        "c": "Anastiloz (Örn: Efes Celsus Kütüphanesi)."
      },
      {
        "s": "Ağaç halkalarını sayarak kesin yıllık mutlak tarihleme yapan yöntem nedir?",
        "c": "Dendrokronoloji."
      },
      {
        "s": "Bir buluntunun bulunduğu özgün yerinde bozulmadan kalmasına ne ad verilir?",
        "c": "In-situ."
      }
    ]
  },
  {
    "id": "KART-ARK-02",
    "ana": "Arkeoloji",
    "alt": "Antik Seramik Formları ve Sofra Düzeni",
    "ad": "Antik Seramik Formları ve Sofra Düzeni",
    "sahne": "Dionysos'un ziyafet masasında dev gövdeli Krater içinde suyla şarap karıştırılır. Hizmetkâr tek kulplu Oinochoe sürahisiyle şarabı alır ve misafirlerin iki kulplu yayvan kadehi Kylix'e döker. Dionysos ise iki devasa kulpu olan derin tanrı kadehi Kantharos'u havaya kaldırır. Masanın altında sivri dipli taşıma kabı Amphora durur, duvarda 3 kulplu su kabı Hydria asılıdır. Kadın masasında makyaj kutusu Pyxis, mezar başında yağ şişesi Lekythos parlar.",
    "kod": [
      {
        "e": "sofra_tekerlemesi",
        "m": "KRATER'de karıştır, OİNOCHOE ile doldur, KYLİX'ten iç; tanrıysan KANTHAROS'tan iç!"
      },
      {
        "e": "amphora",
        "m": "Sivri dipli iki kulplu gemi taşıma kabı."
      },
      {
        "e": "hydria",
        "m": "Su kabı (3 kulplu: 2 yatay kaldırma, 1 dikey dökme kulpu)."
      },
      {
        "e": "lekythos_pyxis",
        "m": "Lekythos = Mezara konan dar boyunlu zeytinyağı şişesi. Pyxis = Makyaj/mücevher kutusu."
      }
    ],
    "capa": "Şarap ve suyun karıştırıldığı büyük kap KRATER'dir; sürahi OİNOCHOE, yayvan kadeh KYLİX, tanrı kadehi KANTHAROS'tur.",
    "film": [
      {
        "s": "Antik Yunan'da şarap ile suyu karıştırmak için kullanılan geniş kaba ne denir?",
        "c": "Krater."
      },
      {
        "s": "Tanrı Dionysos'un elinde tuttuğu derin ve yüksek çift kulplu kadeh hangisidir?",
        "c": "Kantharos."
      },
      {
        "s": "Su taşımak için kullanılan üç kulplu antik kap nedir?",
        "c": "Hydria."
      }
    ]
  },
  {
    "id": "KART-ARK-03",
    "ana": "Arkeoloji",
    "alt": "Kaçırılan Eserler ve Müzecilik Öncüleri",
    "ad": "Kaçırılan Eserler ve Müzecilik Öncüleri",
    "sahne": "Avrupa haritasında kaçırılan eserler canlanır: Bergama Zeus Altarı ile Milet Agora Kapısı Berlin Pergamon Müzesi'ne taşınmış; Ksantos Nereidler Anıtı ile Mausoleum frizleri Londra British Museum'a yerleşmiştir; Truva Priamos Hazinesi Moskova Puşkin Müzesi'ndedir. İstanbul'da Osman Hamdi Bey 1884 Asar-ı Atika Nizamnamesi mührünü basarak Sayda'dan getirdiği İskender Lahdi'ni müzeye yerleştirir. Antalya Müzesi'nde Yorgun Herakles dinlenmektedir.",
    "kod": [
      {
        "e": "kacirilan_eserler",
        "m": "ZEUS ile MİLET Berlin'e, NEREID Londra'ya, PRİAMOS Moskova'ya kaçtı; İSKENDER İstanbul'da, HERAKLES Antalya'da, ARTEMİS Efes'te kaldı."
      },
      {
        "e": "arkeolog_dortlusu",
        "m": "ARIK Alaca'yı kazdı, AKURGAL Ege'yi, ÇAMBEL şifreyi çözdü (Karatepe çift dilli yazıt), SCHMIDT Göbekliyi buldu."
      },
      {
        "e": "osman_hamdi",
        "m": "1881 Müze Müdürü + 1883 Sanayi-i Nefise kurucusu + 1884 Asar-ı Atika Nizamnamesi (Eser kaçışını durduran yasa)."
      }
    ],
    "capa": "Eski eserlerin yurt dışına çıkarılmasını kesin olarak yasaklayan belge Osman Hamdi Bey'in hazırladığı 1884 ASAR-I ATİKA NİZAMNAMESİ'dir.",
    "film": [
      {
        "s": "Berlin Pergamon Müzesi'nde sergilenen Anadolu kökenli iki devasa eser hangisidir?",
        "c": "Bergama Zeus Altarı ve Milet Agora Kapısı."
      },
      {
        "s": "Karatepe-Aslantaş çift dilli yazıtını çözerek Hitit hiyeroglifini aydınlatan ilk kadın arkeoloğumuz kimdir?",
        "c": "Halet Çambel."
      },
      {
        "s": "Eski eserlerin yurt dışına kaçırılmasını engelleyen 1884 tarihli kanun hangisidir?",
        "c": "Asar-ı Atika Nizamnamesi (Osman Hamdi Bey)."
      }
    ]
  },
  {
    "id": "KART-TT-01",
    "ana": "Genel Türk Tarihi ve Kültürü",
    "alt": "İslam Öncesi Türk Devletleri ve İnanç Sistemi",
    "ad": "İslam Öncesi Türk Devletleri ve İnanç Sistemi",
    "sahne": "Uçsuz bucaksız bozkırda Mete Han ordusunu onlu sisteme dizer. Yanında Bumin Kağan göğe 'Türk' tabelası asar. Kutluk Kağan dağınık boyları derleyip toparlarken, Bögü Kağan ışık dinine (Maniheizm) girip et yemeyi yasaklar, Uygur sarayları kurulur. Mezar başında öldürülen düşman sayısınca taş askerler (balbal) dizilmiştir; kurganın üzerinde ruhlar uçmağa (cennete) kuş olup kanatlanır.",
    "kod": [
      {
        "e": "hukumdar_zinciri",
        "m": "METE orduyu onluk dizdi (MÖ 209) → BUMİN 'Türk' tabelasını astı (552) → KUTLUK ili derledi (İlteriş) → BÖGÜ ışık dinine girdi (Maniheizm)."
      },
      {
        "e": "orhun_sirasi",
        "m": "V-K-K Sırası: Vezir (Tonyukuk 725) → Kardeş (Kül Tigin 732) → Kağan (Bilge Kağan 735) - Moğolistan."
      },
      {
        "e": "inanc_terimleri",
        "m": "Balbal = Öldürülen düşman askeri heykeli. Kurgan = Ahşap mezar odalı tepe. Uçmağ = Kuş gibi uçulan cennet. Tamu = Cehennem. Hazarlar = Musevi tek Türk devleti."
      }
    ],
    "capa": "Balbal stel (yazıtlı taş) DEĞİLDİR, öldürülen düşman sayısınca mezara dizilen taş savaşçıdır. İlk Müslüman Türk devleti olan Karahanlılar Anadolu'da ASLA kurulmamıştır.",
    "film": [
      {
        "s": "Orhun Abideleri'nin dikiliş kronolojisi (V-K-K kuralı) nasıldır?",
        "c": "Vezir Tonyukuk (725) → Kül Tigin (732) → Bilge Kağan (735)."
      },
      {
        "s": "Maniheizm dinini kabul ederek yerleşik hayata geçen ilk Türk devleti hangisidir?",
        "c": "Uygurlar (Bögü Kağan)."
      },
      {
        "s": "Tarihte Musevilik dinini kabul eden tek Türk devleti kimdir?",
        "c": "Hazarlar."
      }
    ]
  },
  {
    "id": "KART-TT-02",
    "ana": "Genel Türk Tarihi ve Kültürü",
    "alt": "Selçuklu Savaşları ve Beylikler Mozaiği",
    "ad": "Selçuklu Savaşları ve Beylikler Mozaiği",
    "sahne": "Zaman yolcusunun önünde 4 savaş kapısı açılır: 1040'ta Dandanakan'da doğan devlet, 1071 Malazgirt'te Anadolu'nun kapısını açar; 1176 Miryokefalon'da tapu tescillenir ve Batı haritalarına 'Turchia' yazılır; 1243 Kösedağ'da Moğollar köstek vurur. Arkada beylikler yarışır: Saltuk Erzurum'da kümbet yapar, Danişmend ilk medreseyi kurar, Mengücek Divriği taşını oyar, Artuk Malabadi köprüsünü atar, Karesi Beyliği ise donanmasıyla Osmanlı'ya katılır.",
    "kod": [
      {
        "e": "dort_savas_formulu",
        "m": "1040 DOĞDU (Dandanakan) → 1071 KAPI (Malazgirt) → 1176 TAPU (Miryokefalon / Turchia) → 1243 KÖSTEK (Kösedağ / Beylikler)."
      },
      {
        "e": "birinci_donem_beylikler",
        "m": "SALTUK önce (Erzurum ilk beylik) • DANİŞMEND bilgin (Niksar Yağıbasan ilk medrese) • MENGÜCEK taşçı (Divriği) • ARTUK köprücü (Malabadi + El-Cezeri)."
      },
      {
        "e": "ikinci_donem_beylikler",
        "m": "KARAMAN Türkçe konuştu (1277) • KARESİ denize açtı (Osmanlı'ya ilk katılan beylik ve donanma) • GERMİYAN çeyiz verdi."
      }
    ],
    "capa": "Miryokefalon Savaşı ile Anadolu'nun Türk yurdu olduğu KESİNLEŞMİŞTİR (Tapu). Osmanlı'ya katılan İLK beylik Karesioğulları'dır.",
    "film": [
      {
        "s": "Anadolu'nun tapusu kabul edilen ve Batılıların 'Turchia' demesini sağlayan savaş hangisidir?",
        "c": "1176 Miryokefalon Savaşı."
      },
      {
        "s": "Anadolu'da kurulan ilk Türk medresesi hangisidir ve hangi beylik yapmıştır?",
        "c": "Yağıbasan Medresesi (Danişmendliler - Tokat/Niksar)."
      },
      {
        "s": "Osmanlı Devleti'ne katılan ilk beylik hangisidir?",
        "c": "Karesioğulları (Balıkesir/Çanakkale - denizcilik ve Rumeli'ye geçiş)."
      }
    ]
  },
  {
    "id": "KART-MD-01",
    "ana": "Mitoloji & Dinler Tarihi",
    "alt": "Olimpos Panteonu ve Gezegen Kopyası",
    "ad": "Olimpos Panteonu ve Gezegen Kopyası",
    "sahne": "Gökyüzünde gezegenler antik tanrılara dönüşür: En büyük gezegen Jüpiter elinde şimşekle baş tanrı Zeus'tur. Güneşe en yakın hızlı Merkür, kanatlı sandaletleriyle haberci Hermes'tir. Kızıl Mars elinde mızrakla savaş tanrısı Ares'tir. Parlak Venüs deniz köpüğünden doğan Afrodit, mavi Neptün üç dişli yabasıyla Poseidon'dur. En karanlık cüce gezegen Plüton yeraltı tanrısı Hades'tir. Apollon ise Roma'da adını değiştirmeden parlar.",
    "kod": [
      {
        "e": "gezegen_tanri_sifresi",
        "m": "Zeus=Jüpiter • Hermes=Merkür • Ares=Mars • Afrodit=Venüs • Poseidon=Neptün • Hades=Plüton • Hephaistos=Vulkan (Volkan/Ateş) • Demeter=Ceres (Cereal/Tahıl)."
      },
      {
        "e": "degismeyen_tanri",
        "m": "APOLLON = Roma panteonunda adı DEĞİŞMEYEN TEK TANRIDIR (Kehanet merkezleri Didyma ve Klaros)."
      },
      {
        "e": "ana_tanrica_zinciri",
        "m": "KUBABA (Hitit/Karkamış) → KYBELE/MATAR (Frig) → MAGNA MATER (Roma Büyük Anası)."
      }
    ],
    "capa": "Roma mitolojisinde adı değişmeyen tek Olimpos tanrısı APOLLON'dur. Didyma ve Klaros onun kehanet merkezleridir.",
    "film": [
      {
        "s": "Yunan mitolojisindeki adı Roma'da da hiç değişmeyen tanrı kimdir?",
        "c": "Apollon."
      },
      {
        "s": "Haberci tanrı Hermes'in Roma mitolojisindeki karşılığı ve simgesi nedir?",
        "c": "Merkür; kanatlı sandaletler ve Caduceus asası."
      },
      {
        "s": "Friglerin 'Matar', Romalıların 'Magna Mater' dediği Ana Tanrıça'nın Hitit atası kimdir?",
        "c": "Kubaba (Geç Hitit Karkamış)."
      }
    ]
  },
  {
    "id": "KART-MD-02",
    "ana": "Mitoloji & Dinler Tarihi",
    "alt": "Hristiyanlık Konsilleri, 7 Kilise ve Hac Merkezleri",
    "ad": "Hristiyanlık Konsilleri, 7 Kilise ve Hac Merkezleri",
    "sahne": "Raylar üstünde ilerleyen konsiller treni İznik'te durur: 325'te İmparator Konstantin I. İznik Konsilini toplar; tren 381'de İstanbul'a gidip Teslis'i onaylar; 431'de Efes'te Meryem Ana'ya 'Tanrı Anası (Theotokos)' tacı takılır; 787'de tekrar İznik'te ikonalar kiliselere iade edilir. Ege pazarında sıcak lavaş-poğaça dağıtılır (ESPTSPL: Efes, Smyrna, Pergamon, Thyateira, Sardes, Philadelphia, Laodikeia). Hatay'da St. Pierre mağara kilisesinde ilk kez 'Hristiyan' adı yankılanır.",
    "kod": [
      {
        "e": "konsiller_treni",
        "m": "325 İZNİK açtı (İznik Amentüsü) → 381 İSTANBUL Teslis'i onayladı → 431 EFES Meryem'i taçlandırdı (Theotokos) → 787 İZNİK kapattı (İkonoklazm bitti)."
      },
      {
        "e": "yedi_kilise",
        "m": "ESPTSPL Akrostişi: Efes, Smyrna (İzmir), Pergamon (Bergama), Thyateira (Akhisar), Sardes (Salihli), Philadelphia (Alaşehir), Laodikeia (Denizli)."
      },
      {
        "e": "kanonik_inciller",
        "m": "MMLY (Matta, Markos, Luka, Yuhanna). Barnabas KANONİK DEĞİLDİR!"
      },
      {
        "e": "hac_noktalari",
        "m": "St. Pierre (Antakya - Hristiyan adının ilk verildiği mağara kilisesi) • Meryem Ana Evi (Bülbül Dağı/Selçuk) • St. Nicholas (Demre Noel Baba)."
      }
    ],
    "capa": "HİERAPOLİS 7 Kilise'den biri DEĞİLDİR (Denizli'deki 7 Kilise üyesi LAODİKEİA'dır!). Barnabas ise 4 kanonik İncil arasında yer almaz.",
    "film": [
      {
        "s": "Vahiy kitabında adı geçen 7 Kilise akrostişi (ESPTSPL) içindeki Denizli kenti hangisidir?",
        "c": "Laodikeia (Hierapolis listede yoktur)."
      },
      {
        "s": "Meryem Ana'nın 'Theotokos' (Tanrı Anası) ilan edildiği konsil hangisidir?",
        "c": "431 Efes Konsili."
      },
      {
        "s": "İsa'nın takipçilerine tarihte ilk kez 'Hristiyan' adı nerede verilmiştir?",
        "c": "Hatay/Antakya St. Pierre Kilisesi."
      }
    ]
  },
  {
    "id": "KART-TC-01",
    "ana": "Türkiye'nin Turizm Coğrafyası",
    "alt": "Fiziki Coğrafya, Göller ve Termal Kaynaklar",
    "ad": "Fiziki Coğrafya, Göller ve Termal Kaynaklar",
    "sahne": "Bir göçmen kuş Türkiye üzerinde uçar: Van Gölü'nde inci kefallerinin üzerinden geçerken Nemrut ve Süphan volkanlarını görür. Konya Karapınar'da dev obruklar ve 'Dünyanın Nazar Boncuğu' Meke Maar gölü parlar. Ege grabenlerinde buhar tüten beş şifalı kaplıca dizilmiştir: Afyon Gazlıgöl, Denizli Pamukkale Karahayıt'ın kırmızı suyu, Bursa Çekirge, Yalova Termal ve Kütahya Yoncalı. Alanya Damlataş Mağarası'nda astım hastaları nefes alırken, Köprülü Kanyon'da rafting botları köpüklere dalar.",
    "kod": [
      {
        "e": "volkanlar_ve_obruk",
        "m": "Güneydoğu Toroslar ve İç Anadolu volkanik kuşağı. Meke Gölü = Çift patlamalı maar (Dünyanın nazar boncuğu)."
      },
      {
        "e": "termal_be_li",
        "m": "Gazlıgöl (Afyon), Karahayıt (Denizli - Kırmızı traverten), Çekirge (Bursa), Armutlu/Termal (Yalova), Yoncalı (Kütahya)."
      },
      {
        "e": "turizm_magaralari",
        "m": "Damlataş (Alanya - Astım şifası) • Karain (Antalya - Tarih öncesi) • Ballıca (Tokat - Soğan sarkıtlar) • Dupnisa (Kırklareli)."
      }
    ],
    "capa": "Pamukkale beyaz traverten iken, hemen yanındaki KARAHAYIT termali demir oksit nedeniyle KIRMIZI su ve kırmızı traverten oluşturur.",
    "film": [
      {
        "s": "Dünyanın nazar boncuğu olarak bilinen maar gölü nerededir?",
        "c": "Konya Karapınar (Meke Gölü)."
      },
      {
        "s": "Kırmızı travertenleri ve termal sularıyla ünlü Denizli kaplıca merkezi neresidir?",
        "c": "Karahayıt."
      },
      {
        "s": "Türkiye'de turizme açılan ilk mağara olup astım tedavisiyle bilinen mağara hangisidir?",
        "c": "Alanya Damlataş Mağarası."
      }
    ]
  },
  {
    "id": "KART-RM-01",
    "ana": "Turist Rehberliği Mevzuatı ve Etiği",
    "alt": "6326 Sayılı Kanun, Ruhsatname ve Disiplin Cezaları",
    "ad": "6326 Sayılı Kanun, Ruhsatname ve Disiplin Cezaları",
    "sahne": "Bir aday rehber Bakanlık kapısından ömür boyu geçerli Ruhsatnamesini alır; ardından Rehberler Odasına gidip her yıl yenilenen çalışma kartını göğsüne asar. TUREB binasında 13 kapılı koridordan geçer (7 büyük il odası + 6 bölgesel oda). Koridorun sonunda 4 basamaklı disiplin merdiveni yükselir: Kartını takmayana Uyarma, taban ücret altına inene Kınama, yılda 2 kınama alana 1 aydan 1 yıla kadar Geçici Men, ülke onurunu zedeleyene ise Meslekten Çıkarma verilir.",
    "kod": [
      {
        "e": "ruhsat_kart_ayrimi",
        "m": "RUHSAT ömürlük nikâh (Bakanlık verir), KART yıllık vize (Oda verir)."
      },
      {
        "e": "eylemli_eylemsiz",
        "m": "Eylemli = Ruhsat + O yılki çalışma kartı var. Eylemsiz = Ruhsat var, kart yok (Rehberlik yapamaz!)."
      },
      {
        "e": "tureb_13_kapi",
        "m": "13 Kapılı Koridor = 7 İl Meslek Odası + 6 Bölgesel Oda = Toplam 13 Oda."
      },
      {
        "e": "ceza_merdiveni",
        "m": "U-K-M-Ç Formülü: Uyarma → Kınama → Geçici Men (1 yılda 2 kınama doğrudan men getirir!) → Meslekten Çıkarma."
      }
    ],
    "capa": "Ruhsatnameyi KÜLTÜR VE TURİZM BAKANLIĞI verir; çalışma kartını ise REHBERLER ODASI vize eder. Bir yılda 2 kez kınama cezası alan rehbere doğrudan GEÇİCİ MEN cezası verilir.",
    "film": [
      {
        "s": "Rehberlik ruhsatnamesini ve çalışma kartını veren kurumlar sırasıyla hangileridir?",
        "c": "Ruhsatnameyi Bakanlık; Çalışma Kartını bağlı olunan Rehberler Odası verir."
      },
      {
        "s": "Bir yıl içinde kaç kez kınama cezası alan rehbere doğrudan geçici men cezası uygulanır?",
        "c": "2 kez kınama cezası."
      },
      {
        "s": "TUREB bünyesinde kaç adet meslek ve bölgesel oda bulunmaktadır?",
        "c": "Toplam 13 oda (7 Meslek Odası + 6 Bölgesel Oda)."
      }
    ]
  },
  {
    "id": "KART-RM-02",
    "ana": "Turist Rehberliği Mevzuatı ve Etiği",
    "alt": "Turizm Kanunları ve Seyahat Acentaları (1618, 2634, 6502)",
    "ad": "Turizm Kanunları ve Seyahat Acentaları (1618, 2634, 6502)",
    "sahne": "Dört köşeli bir meydanda 4 kanun anıtı dikilidir: 6326 Rehberi, 1618 Acentayı, 2634 Turizm Teşvik ve Otelleri, 6502 Tüketiciyi korur. Limanda demirli A grubu 'Amiral' gemisi her türlü turu ve bileti satar; B grubu sadece bilet keser; C grubu ise yalnızca Türk vatandaşlarına yurt içi tur düzenler. Bir otel inşaatında önce Yatırım Belgesi, açılınca İşletme Belgesi asılır.",
    "kod": [
      {
        "e": "dort_kanun_dort_dunya",
        "m": "6326 REHBER, 1618 ACENTA, 2634 TEŞVİK/OTEL, 6502 TÜKETİCİ."
      },
      {
        "e": "acenta_gruplari",
        "m": "A Grubu = Amiral (Her şeyi yapar, paket tur operatörüdür). B Grubu = Bilet acentası. C Grubu = Cumhuriyet vatandaşına yurt içi tur."
      },
      {
        "e": "tesis_belgeleri",
        "m": "Önce Turizm Yatırım Belgesi (inşaatta) → Sonra Turizm İşletme Belgesi (açılışta). Veren tek makam: Bakanlık."
      },
      {
        "e": "vize_capasi",
        "m": "Turiste vize almak seyahat acentasının veya rehberin yasal GÖREVİ DEĞİLDİR!"
      }
    ],
    "capa": "Yalnızca Türk vatandaşlarına yurt içi tur düzenleme yetkisi C GRUBU acentadadır. Acenta işletme belgesini belediye değil, KÜLTÜR VE TURİZM BAKANLIĞI verir.",
    "film": [
      {
        "s": "1618 sayılı kanuna göre sadece Türk vatandaşlarına yurt içi tur düzenleyebilen acenta grubu hangisidir?",
        "c": "C Grubu acenta."
      },
      {
        "s": "Seyahat acentası ve turizm işletme belgelerini vermeye yetkili tek kurum hangisidir?",
        "c": "Kültür ve Turizm Bakanlığı."
      },
      {
        "s": "Paket tur sözleşmesi tanımı için en az kaç hizmet unsuru ve ne kadar süre şarttır?",
        "c": "En az iki farklı hizmet unsuru (ulaşım, konaklama vb.) ve 24 saati aşan (veya gecelik) süre."
      }
    ]
  },
  {
    "id": "KART-SY-01",
    "ana": "Genel Sağlık Bilgisi ve İlk Yardım",
    "alt": "İlk Yardımın Temel İlkeleri, ABC ve CPR Zinciri",
    "ad": "İlk Yardımın Temel İlkeleri, ABC ve CPR Zinciri",
    "sahne": "Kaza yerinde ilk yardımcı sırasıyla KBK kalkanını kaldırır: Önce Koru (can güvenliği), sonra Bildir (112), sonra Kurtar. Yerde yatan yetişkinin omzuna dokunup 'İyi misiniz?' diye sorulurken, bebeğin ayak tabanına pıt pıt vurulur. Baş-çene pozisyonuyla hava yolu (A) açılır; 10 saniye göğse bak-dinle-hisset (B) yapılır; kalbi duran kazazedeye 30 kalp masajı ve 2 suni solunum (30:2) ritmiyle masaj uygulanır.",
    "kod": [
      {
        "e": "ilkyardim_tanimi",
        "m": "İlaç YOKsa İlk Yardım (Olay yeri, eldeki imkân), İlaç VARsa Acil Tedavi (Doktor/Ambulans)."
      },
      {
        "e": "kbk_zinciri",
        "m": "KORU → BİLDİR (112) → KURTAR."
      },
      {
        "e": "abc_formulu",
        "m": "A (Airway - Baş-Çene pozisyonu) • B (Breathing - 10 sn Bak-Dinle-Hisset) • C (Circulation - Dolaşım)."
      },
      {
        "e": "cpr_orani",
        "m": "30 Kalp Masajı : 2 Suni Solunum (Dakikada 100-120 bası hızıyla)."
      }
    ],
    "capa": "Bilinç kontrolü yetişkinde OMUZDAN, bebekte AYAK TABANINDAN yapılır. Solunum tam 10 SANİYE boyunca Bak-Dinle-Hisset yöntemiyle dinlenir.",
    "film": [
      {
        "s": "Temel Yaşam Desteğinde (CPR) kalp masajı ve suni solunum oranı kaçtır?",
        "c": "30 Kalp Masajı : 2 Suni Solunum (30:2)."
      },
      {
        "s": "Bebeklerde bilinç kontrolü vücudun neresinden yapılır?",
        "c": "Ayak tabanına hafifçe vurularak."
      },
      {
        "s": "İlk yardım müdahale zincirinin (KBK) açılımı nedir?",
        "c": "Koru - Bildir (112) - Kurtar."
      }
    ]
  },
  {
    "id": "KART-SY-02",
    "ana": "Genel Sağlık Bilgisi ve İlk Yardım",
    "alt": "Tam Tıkanma, Heimlich ve Acil Pozisyonlar",
    "ad": "Tam Tıkanma, Heimlich ve Acil Pozisyonlar",
    "sahne": "Restoranda boğazına et kaçan turist ellerini boynuna götürür, konuşamaz ve morarır. İlk yardımcı arkasına geçer; bir elini yumruk yapıp göbek deliği ile göğüs kemiği arasına koyar, diğer eliyle kavrayıp arkaya ve yukarı doğru 'HEY! MİDEye bas' (Heimlich) hamlesini yapar. Yan masada bayılan kişi yan yatış koma pozisyonuna alınır; tansiyonu düşen şoktaki yaralının bacakları 30 cm yukarı kaldırılır; kaza yapan araçtan yaralı omurgası korunarak Rentek manevrasıyla çekilir.",
    "kod": [
      {
        "e": "heimlich",
        "m": "Tam Tıkanma (Konuşamaz, nefes alamaz, eller boyunda) → Heimlich Manevrası. Kısmi Tıkanma (Öksürür) → DOKUNMA, öksürt!"
      },
      {
        "e": "koma_pozisyonu",
        "m": "Yarı yüzüstü yan yatış = Bilinç kapalı AMA solunum varsa (kusmuk kaçmasın)."
      },
      {
        "e": "sok_pozisyonu",
        "m": "Sırtüstü yatır, bacakları 30 cm YUKARI kaldır (beyne kan gitsin)."
      },
      {
        "e": "rentek_manevrasi",
        "m": "Pozisyon DEĞİLDİR! Araç içinden omurgayı bozmadan çıkarma TAŞIMA tekniğidir."
      }
    ],
    "capa": "Kısmi tıkanmada sırta VURULMAZ, sadece öksürmeye teşvik edilir. Renteck bir pozisyon değil, ARAÇTAN ÇIKARMA tekniğidir.",
    "film": [
      {
        "s": "Tam tıkanma yaşayan kazazedeye uygulanan hayat kurtarıcı manevra nedir?",
        "c": "Heimlich Manevrası."
      },
      {
        "s": "Şok pozisyonunda kazazedenin bacakları kaç cm yukarı kaldırılır?",
        "c": "30 cm."
      },
      {
        "s": "Kaza yapmış araç içinden omuriliğe zarar vermeden yaralı çıkarma tekniğinin adı nedir?",
        "c": "Rentek Manevrası."
      }
    ]
  },
  {
    "id": "KART-IL-01",
    "ana": "İletişim ve Rehberlik Becerileri",
    "alt": "İletişim Süreci, Mehrabian Formülü ve Beden Dili",
    "ad": "İletişim Süreci, Mehrabian Formülü ve Beden Dili",
    "sahne": "Tur otobüsünde rehber mikrofondan konuşur: Zihninde mesajı kodlar (encoding), ses dalgaları kanaldan alıcı turiste ulaşır, turist kod açımı (decoding) yapar. Duvardaki saat kadranında 'BEDEN SESİ KESER' formülü parlar: İletişimin %55'i Beden Dili ve Jest-Mimiktir, %38'i Ses Tonudur, sadece %7'si Kelimelerdir. Rehber el ve koluyla yön gösterir (Jest), yüzünde kaş-göz-ağız oynatır (Mimik).",
    "kod": [
      {
        "e": "iletisim_ogeleri",
        "m": "Kaynak (Kodlar) → Mesaj → Kanal → Alıcı (Kodu açar) → Geri Bildirim (Feedback çift yönlü yapar)."
      },
      {
        "e": "mehrabian_formulu",
        "m": "55 - 38 - 7 Şifresi: %55 Beden Dili (Jest/Mimik) + %38 Ses Tonu (Paralanguage) + %7 Kelimeler."
      },
      {
        "e": "jest_mimik",
        "m": "JEST = Kol ve el hareketleri; MİMİK = Yüz ifadeleri (Göz, ağız, kaş)."
      }
    ],
    "capa": "Yüz yüze iletişimde en büyük etki %55 ile BEDEN DİLİNE aittir; kelimelerin payı yalnızca %7'dir. Jest el-koldur, mimik yüzdür.",
    "film": [
      {
        "s": "Mehrabian formülüne göre yüz yüze iletişimde beden dili, ses tonu ve kelimelerin yüzdeleri kaçtır?",
        "c": "%55 Beden Dili, %38 Ses Tonu, %7 Kelimeler."
      },
      {
        "s": "İletişimi tek yönlü olmaktan çıkarıp çift yönlü hale getiren öge nedir?",
        "c": "Geri bildirim (Feedback)."
      },
      {
        "s": "El ve kol hareketlerine ne ad verilir?",
        "c": "Jest (Yüz hareketlerine ise Mimik denir)."
      }
    ]
  },
  {
    "id": "KART-IL-02",
    "ana": "İletişim ve Rehberlik Becerileri",
    "alt": "Mesafe Merdiveni (Proksemi) ve Dinleme Türleri",
    "ad": "Mesafe Merdiveni (Proksemi) ve Dinleme Türleri",
    "sahne": "Rehberin çevresinde 4 dairesel alan çizilidir (MaKiSoGe): En içte aileye özel 0-45 cm Mahrem Alan; ikinci halkada 45-120 cm Kişisel Alan; üçüncü halkada 120-350 cm Sosyal iş alanı; en dışta 3,5 metre üstü Kamusal alan. Rehber turiste suçlayıcı 'Sen' dili yerine 'Ben' diliyle konuşur ('Programa yetişememekten endişeleniyorum'); kötü dinleyicilerin maskeleri düşer: Beden orada kafa tatilde olan 'Görünüşte dinleyici', açık arayan 'Tuzak kurucu'.",
    "kod": [
      {
        "e": "mesafe_merdiveni",
        "m": "MaKiSoGe Formülü: Mahrem (0-45 cm) → Kişisel (45-120 cm) → Sosyal (120-350 cm) → Genel/Kamusal (350 cm ve üzeri)."
      },
      {
        "e": "ben_dili",
        "m": "Suçlamadan konuşma: Davranış + Duygu + Etki ('Geç kalındığında endişeleniyorum')."
      },
      {
        "e": "yansitma",
        "m": "Ayna Tekniği: Turistin sözünü özetleyerek güven verme."
      }
    ],
    "capa": "0-45 cm arası MAHREM ALANDIR ve yabancılar girdiğinde fizyolojik stres/tehdit algısı doğar. Rehber grupta 'Sen' dili değil, 'Ben' dili kullanmalıdır.",
    "film": [
      {
        "s": "Proksemik alan teorisinde 0-45 cm arasındaki en yakın mesafeye ne denir?",
        "c": "Mahrem Alan."
      },
      {
        "s": "Kişiyi suçlamadan hissettiklerini ve program üzerindeki etkiyi anlatan iletişim dili nedir?",
        "c": "Ben Dili."
      },
      {
        "s": "Fiziksel olarak dinliyor gibi görünüp zihnen tamamen başka yerde olma durumuna ne denir?",
        "c": "Görünüşte Dinleme."
      }
    ]
  },
  {
    "id": "KART-IL-03",
    "ana": "İletişim ve Rehberlik Becerileri",
    "alt": "Turist Davranışı ve Doxey Rahatsızlık İndeksi",
    "ad": "Turist Davranışı ve Doxey Rahatsızlık İndeksi",
    "sahne": "Köy meydanında yerel halkın turiste bakışı 4 aşamada değişir (CİRD): İlk turist geldiğinde köylü sevinçle pasta açar (Coşku); onuncu turistte dükkan açıp ilgisizce bakar (İlgisizlik); yüzüncü turistte park yeri kalmayınca homurdanır (Rahatsızlık); bininci turistte otobüsün camına taş atar (Düşmanlık). Yol ayrımında Allosentrik maceracı turist sırt çantasıyla bilinmeyen köye koşarken, Psikosentrik turist her yıl gittiği her şey dâhil tatil köyüne kapanır.",
    "kod": [
      {
        "e": "doxey_indeksi",
        "m": "CİRD Aşamaları: Coşku (Euphoria) → İlgisizlik (Apathy) → Rahatsızlık (Annoyance) → Düşmanlık (Antagonism)."
      },
      {
        "e": "plog_tipolojisi",
        "m": "Allosentrik = 'ALO yeni yer var mı?' diyen dışadönük maceracı. Psikosentrik = 'PSSST bildiğin yerden şaşma' diyen içedönük temkinli turist."
      },
      {
        "e": "cohen_dortlusu",
        "m": "Örgütlü kitle (tam paket) → Bağımsız kitle → Gezgin → Başıboş/Drifter (yerel gibi yaşayan)."
      }
    ],
    "capa": "Doxey indeksinin son ve en tehlikeli aşaması DÜŞMANLIK (Antagonism)'tır. Yeni ve keşfedilmemiş yerleri ilk arayan maceracı turist ALLOSENTRİK'tir.",
    "film": [
      {
        "s": "Doxey Rahatsızlık İndeksine göre yerel halkın turiste gösterdiği 4 aşamalı tepki (CİRD) sırası nedir?",
        "c": "Coşku → İlgisizlik → Rahatsızlık → Düşmanlık."
      },
      {
        "s": "Risk almaktan hoşlanan, keşfedilmemiş destinasyonları tercih eden turist tipi Plog'a göre hangisidir?",
        "c": "Allosentrik turist."
      },
      {
        "s": "Yerel halkın yaşam tarzını ve gençlerin turistin tüketim kalıplarını taklit etmesine sosyolojide ne denir?",
        "c": "Gösteri Etkisi (Demonstration Effect)."
      }
    ]
  },
  {
    "id": "KART-GM-01",
    "ana": "Güncel Turizm ve Miras",
    "alt": "UNESCO Dünya Mirası ve SOKÜM Unsurları",
    "ad": "UNESCO Dünya Mirası ve SOKÜM Unsurları",
    "sahne": "Türkiye haritasında UNESCO'nun 2 Karma İkizi parlar: Peribacaları içinde kiliseleriyle Kapadokya ve travertenler üstünde antik tiyatrosuyla Pamukkale-Hierapolis. 2023'te Gordion ile Anadolu'nun 5 ahşap direkli camisi listeye girer; 2025'te ise Sardes ve Bintepeler Lidya tümülüsleri mühürlenir. Yanındaki tezgâhta Antep işi nakış işleyen kadın (32. SOKÜM unsuru), fincandan Türk kahvesi yudumlar; nehir kıyısında ıslık diliyle kuş gibi haberleşen Karadenizliler durur.",
    "kod": [
      {
        "e": "karma_ikizler",
        "m": "Doğa + Kültür = KAPADOKYA + PAMUKKALE-HİERAPOLİS (Türkiye'de üçüncüsü YOKTUR!)."
      },
      {
        "e": "en_son_unesco",
        "m": "2023: Gordion (Ankara) + Ahşap Direkli Camiler. 2025: Sardes ve Bintepeler Lidya Tümülüsleri (Manisa)."
      },
      {
        "e": "sokum_son_unsur",
        "m": "Aralık 2025 - 32. Unsur: ANTEP İŞİ NAKIŞI. Acil Koruma Listesi: Islık Dili (Kuş Dili)."
      },
      {
        "e": "gastronomi_sehirleri",
        "m": "G-H-A Üçlüsü: Gaziantep (2015) • Hatay (2017) • Afyonkarahisar (2019)."
      }
    ],
    "capa": "Türkiye'de hem doğa hem kültür kriteriyle seçilen KARMA MİRAS alanı yalnızca 2 tanedir: Göreme/Kapadokya ve Pamukkale/Hierapolis. Sümela Manastırı ve Kekova ise asıl listede DEĞİL, GEÇİCİ listededir!",
    "film": [
      {
        "s": "Türkiye'nin UNESCO Dünya Mirası Listesi'ndeki iki karma (kültür+doğa) varlığı hangileridir?",
        "c": "Göreme Millî Parkı ve Kapadokya ile Pamukkale-Hierapolis."
      },
      {
        "s": "UNESCO Somut Olmayan Kültürel Miras (SOKÜM) listesine 32. unsur olarak Aralık 2025'te kaydedilen değerimiz nedir?",
        "c": "Antep İşi Nakışı."
      },
      {
        "s": "UNESCO Yaratıcı Şehirler Ağı'na gastronomi alanında dâhil olan ilk üç kentimiz hangileridir?",
        "c": "Gaziantep (2015), Hatay (2017), Afyonkarahisar (2019)."
      }
    ]
  },
  {
    "id": "KART-GM-02",
    "ana": "Güncel Turizm ve Miras",
    "alt": "Güncel Turizm Verileri (RAB Sıralaması) ve Sakin Şehirler",
    "ad": "Güncel Turizm Verileri (RAB Sıralaması) ve Sakin Şehirler",
    "sahne": "Havalimanı kapısında Türkiye'ye giren turistlerin pasaportları sayılır (RAB Sıralaması): En önde Rusya (~6,9M), hemen arkasında Almanya (~6,75M), üçüncü sırada Birleşik Krallık (~4,27M). İzmir Seferihisar'da salyangoz logolu tabelasıyla Türkiye'nin ilk Sakin Şehri (Cittaslow) uzanır. Duvardaki afişte 2027 UNESCO 49. Dünya Miras Komitesi toplantısına TÜRKİYE'nin ev sahipliği yapacağı ilan edilir.",
    "kod": [
      {
        "e": "rab_siralamasi",
        "m": "RAB Sıralaması: 1. Rusya → 2. Almanya → 3. Birleşik Krallık / İngiltere."
      },
      {
        "e": "cittaslow_baskenti",
        "m": "Seferihisar (İzmir - 2009 Türkiye'nin ilk sakin şehri)."
      },
      {
        "e": "unesco_2027",
        "m": "UNESCO 49. Dünya Miras Komitesi ev sahibi: TÜRKİYE (2027)."
      }
    ],
    "capa": "Türkiye'ye en çok ziyaretçi gönderen ilk iki ülke daima RUSYA ve ALMANYA'dır (RAB sıralaması). Türkiye'nin ilk Cittaslow başkenti ise İzmir Seferihisar'dır.",
    "film": [
      {
        "s": "Türkiye'ye en çok yabancı ziyaretçi gönderen ilk 3 ülke (RAB sıralaması) hangileridir?",
        "c": "1. Rusya, 2. Almanya, 3. Birleşik Krallık (İngiltere)."
      },
      {
        "s": "Türkiye'nin ilk Sakin Şehri (Cittaslow) ilan edilen ilçe hangisidir?",
        "c": "İzmir - Seferihisar (2009)."
      },
      {
        "s": "2027 yılında düzenlenecek UNESCO 49. Dünya Miras Komitesi toplantısına ev sahipliği yapacak ülke neresidir?",
        "c": "Türkiye."
      }
    ]
  }
];
