# Bosnia Rent a Car

Bosnia Rent a Car için Türkçe, mobil uyumlu tek sayfalık araç kiralama sitesi. HTML5, CSS ve JavaScript ile hazırlanmıştır; derleme, paket yöneticisi veya sunucu tarafı kod gerektirmez.

## Çalıştırma

`index.html` dosyasını tarayıcıda açın veya klasörü statik bir web sunucusunda yayınlayın. `index.html`, `styles.css`, `app.js` ve `assets/` klasörü aynı dizin yapısında bulunmalıdır.

## İçerik ve işleyiş

- Üç araç: Škoda Octavia Combi (2019), Toyota Verso (2016), Citroën Grand C4 Picasso (2011).
- Kullanıcı araç tercihini ve alış–iade tarihlerini seçer.
- Form WhatsApp mesajı veya e-posta taslağı hazırlar. **Rezervasyon kaydetmez, ödeme almaz ve mesajı kendiliğinden göndermez.**
- Alış tarihi bugünden önce, iade tarihi alıştan önce veya aynı gün olamaz.
- Fiyat, müsaitlik, sigorta, depozito ve teslim koşulları işletmeyle teyit edilir. Bu bilgiler sitede varsayım olarak yer almaz.

## İletişim ve marka

Repo'daki önceki sürümden alınmıştır:

- Telefon / WhatsApp: +90 850 840 03 87
- E-posta: info@bosniarentacar.com
- Instagram: @bosnia.rentacar
- Adres: Josipa Stadlera 6, Stari Grad, 71000 Sarajevo, Bosna-Hersek

İletişim bilgilerini değiştirirken hem `index.html` hem `app.js` dosyasını güncelleyin.

## Görseller

Repo'nun `assets/` klasöründeki var olan `logo.png`, `mostar.jpg`, `octavia.jpg`, `verso.jpg` ve `picasso.jpg` dosyaları kullanılmaktadır. Araç görselleri temsildir; araçların fiilî durumu doğrulanmış değildir. Fotoğraf kaynakları/lisansları sitenin altındadır.

## Yayınlama

Herhangi bir statik hosting (GitHub Pages, Cloudflare Pages, Netlify vb.) kullanılabilir. Alan adı DNS ve hosting ayarları bu repodaki HTML dosyalarından ayrı olarak yapılandırılmalıdır.

### Sites yayını ve SEO

Sites projesi: `appgprj_6ad3298578908191b2b9c40e31a9474a`. Canlı adres: https://bosnia-rent-a-car.frmax-8523.chatgpt.site/ . Sites deposunda yayın dosyaları `dist/` altındadır; GitHub deposunda aynı dosyalar kök dizindedir.

Canonical, Open Graph, Twitter, AutoRental/WebSite/WebPage JSON-LD, robots.txt ve sitemap.xml mevcut canlı Sites adresini kullanır. Özel alan adı bu yayına bağlandığında bu dosyalardaki origin adresleri birlikte güncellenmelidir. Google Search Console doğrulaması ve site haritası gönderimi hesap erişimiyle ayrıca yapılır; kod değişikliği indekslenme veya sıralama garantisi vermez.

Safari için form alanlarında min-width ve yerel kontrol boyutları tanımlıdır. Dar telefonlarda tarihler alt alta gelir. Sabit WhatsApp kısayolu teklif formu görünürken gizlenir.

### Kontroller

`tests/smoke.mjs` için Playwright gerekir. Statik sunucuyu açtıktan sonra `node tests/smoke.mjs` çalıştırın. İsteğe bağlı değişkenler: `TEST_URL`, `TEST_BROWSER=webkit`, `PLAYWRIGHT_MODULE` ve `BROWSER_EXECUTABLE`. Test gerçek mesaj göndermez. Gerçek Safari WebDriver testi için Safari ayarlarında uzaktan otomasyon açık olmalıdır.

Sites kaynak erişimi ile GitHub push ayrı bağlantılardır. Sites kaynağını açmak için Sites aracının verdiği kısa ömürlü kimlik bilgisi ve kaynak Git sunucusuna ağ erişimi gerekir; erişim anahtarları repoya yazılmamalıdır. Başka bir Work oturumunun ağ politikası bu HTML/CSS/JS dosyalarıyla değiştirilemez.
