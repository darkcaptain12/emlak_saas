# Emlak SaaS

Türk gayrimenkul danışmanları için tasarlanmış, tek kullanıcılı SaaS yönetim paneli.
Danışman kendi ilan portföyünü, müşterilerini ve lead pipeline'ını tek bir yerden yönetir.

---

## Ne Yapar?

| Modül | Açıklama |
|---|---|
| **Dashboard** | Toplam ilan, aktif ilan, müşteri ve açık lead sayıları; son ilanlar ve lead durumu dağılımı |
| **İlanlar** | İlan oluşturma / düzenleme / silme; fotoğraf yükleme; satılık / kiralık, daire / arsa / villa türleri; durum takibi (aktif, pasif, satıldı…) |
| **Müşteriler** | Alıcı / satıcı / kiracı / ev sahibi profilleri; notlar |
| **Leadler** | Müşteri × ilan eşleştirmesi; Kanban board (Yeni → İletişimde → Geziliyor → Teklif → Kazanıldı / Kaybedildi); lead notları |
| **Ayarlar** | Profil bilgileri (ad, ajans adı, telefon, avatar) |

---

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16.2.1 (App Router, React 19) |
| Dil | TypeScript 5 |
| Auth & DB | Supabase (PostgreSQL + RLS + Auth) |
| Stil | Tailwind CSS v4 |
| UI bileşenleri | Base UI + shadcn/ui (nova stili) |
| Form yönetimi | react-hook-form + zod |
| Drag & Drop | @hello-pangea/dnd (Kanban) |
| Grafikler | recharts |
| Toastlar | sonner |
| Tarih | date-fns |

---

## Proje Yapısı

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Giriş formu
│   │   └── register/page.tsx       # Kayıt formu
│   └── (dashboard)/
│       ├── layout.tsx              # Sidebar + auth guard
│       ├── dashboard/page.tsx      # Ana dashboard
│       ├── properties/             # İlan listesi, detay, yeni, düzenle
│       ├── clients/                # Müşteri listesi, detay, yeni, düzenle
│       ├── leads/                  # Lead listesi, Kanban, yeni, düzenle
│       └── settings/page.tsx       # Profil ayarları
├── components/
│   ├── layout/                     # Sidebar, PageHeader
│   ├── properties/                 # PropertyForm, PropertyStatusBadge
│   ├── clients/                    # ClientForm
│   ├── leads/                      # LeadForm, LeadKanban
│   ├── shared/                     # ConfirmDialog, EmptyState
│   └── ui/                         # Base UI primitifleri
├── lib/
│   ├── actions/                    # Server Actions (property, client, lead)
│   ├── supabase/                   # client.ts + server.ts
│   ├── validations/                # Zod şemaları
│   └── utils.ts
├── types/index.ts                  # Paylaşılan TS tipleri
└── proxy.ts                        # Route koruma middleware'i
supabase/
└── migrations/
    └── 001_initial_schema.sql      # Tam DB şeması
```

---

## Veritabanı Şeması (Özet)

```
auth.users          ← Supabase Auth
    └── profiles    (id, full_name, agency_name, phone, avatar_url)
         ├── properties   (ilan bilgileri + konum + fiyat)
         │    └── property_images
         ├── clients      (müşteri bilgileri)
         └── leads        (client × property pipeline)
              └── lead_notes
```

Tüm tablolarda Row Level Security aktif — kullanıcı yalnızca kendi verilerini görür.
`profiles` tablosu, yeni `auth.users` kaydında otomatik tetikleyici ile oluşturulur.

---

## Kurulum

### 1. Bağımlılıkları yükle

```bash
npm install
```

### 2. Ortam değişkenlerini ayarla

`.env.local` dosyası zaten mevcut ve remote Supabase projesine bağlı:

```
NEXT_PUBLIC_SUPABASE_URL=https://ccyqgzdwmzcjfofasqye.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. Veritabanı migration'ını uygula

Supabase Dashboard → SQL Editor:
`supabase/migrations/001_initial_schema.sql` dosyasının içeriğini yapıştırıp çalıştır.

### 4. Test kullanıcısı oluştur

Supabase Dashboard → Authentication → Users → **Add user**:
- Email: `demo@emlak.com`
- Password: `demo1234`

Oluşan kullanıcının UUID'siyle profili güncelle:

```sql
UPDATE profiles SET
  full_name    = 'Emir Sümer',
  agency_name  = 'E2X Gayrimenkul',
  phone        = '+90 555 123 4567'
WHERE id = '<kullanici-uuid>';
```

### 5. Geliştirme sunucusunu başlat

```bash
npm run dev
```

`http://localhost:3000` → login → `demo@emlak.com` / `demo1234`

---

## Mevcut Durum

### Tamamlanan

- [x] Tüm sayfa şablonları (auth + dashboard tüm modüller)
- [x] Supabase entegrasyonu (client + server + SSR cookie yönetimi)
- [x] Route koruma middleware'i (`src/proxy.ts`)
- [x] Tam veritabanı şeması + RLS politikaları + triggerlar
- [x] Server Actions (property / client / lead CRUD)
- [x] Zod validasyon şemaları
- [x] Tüm UI bileşenleri (form, tablo, badge, dialog, Kanban vb.)
- [x] Lead Kanban board (drag & drop)
- [x] `.env.local` → remote Supabase projesine bağlı

### Yapılacak

- [ ] `001_initial_schema.sql` migration'ını Supabase'e uygula
- [ ] Test kullanıcısı oluştur (`demo@emlak.com`)
- [ ] Demo / mock modu (Supabase'siz çalışma — opsiyonel)
- [ ] Property fotoğraf yükleme (Supabase Storage entegrasyonu)
- [ ] Mobil uyumlu sidebar
- [ ] E-posta doğrulama akışı

---

## Komutlar

```bash
npm run dev      # Geliştirme sunucusu (webpack modu)
npm run build    # Production build
npm run lint     # ESLint
```
