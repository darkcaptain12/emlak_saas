# EmlakCRM - Gayrimenkul Yönetim Platformu

Production-ready SaaS platformu emlak acenteleri ve gayrimenkul danışmanları için. Komprehensif dashboard, müşteri yönetimi, ilanlar, lead takibi ve paket yönetimi sistemi.

## 🎯 Proje Amacı

EmlakCRM, gayrimenkul sektöründe faaliyet gösteren acentelerin tüm operasyonlarını yönetebileceği modern, kullanıcı dostu bir CRM platformudur. Özellikle:

- **İlan Yönetimi**: Emlak ilanlarını oluşturun, düzenleyin, filtreleyin ve yönetin
- **Lead Takibi**: Potansiyel müşterileri (lead'leri) Kanban board'da takip edin
- **Müşteri Yönetimi**: Tüm müşteri verilerini merkezi bir yerde saklayın
- **Analytics & Reporting**: Satış performansını görselleştirilmiş grafiklerle izleyin
- **Paket Sistemi**: Farklı kullanım limitlerine sahip 3 seviye paket

## 📦 Paket Seviyeleri

### 📍 Başlangıç (Pack1)
- **Fiyat**: ₺9.900/ay
- **İlan Limiti**: Max 20 ilan
- **Özellikler**:
  - Dashboard temel metrikler
  - İlan yönetimi (max 20)
  - Müşteri yönetimi
  - Lead takip ve Kanban board
  - Profil ayarları
  - Temel grafikler (pie chart)

### 💼 Profesyonel (Pack2)
- **Fiyat**: ₺19.900/ay
- **İlan Limiti**: Max 100 ilan
- **Özellikler**:
  - Pack1'deki tüm özellikler
  - Gelişmiş dashboard & analitik
  - İlan yönetimi (max 100)
  - Aylık lead akışı grafiği (line chart)
  - İlan tipi dağılımı analizi (bar chart)
  - Müşteri listesi ve analitik
  - Lead performans metrikleri (kazanılan/kaybedilen)
  - Dönüşüm oranı göstergesi

### 🏢 Kurumsal (Pack3)
- **Fiyat**: ₺39.900/ay
- **İlan Limiti**: Sınırsız
- **Özellikler**:
  - Pack2'deki tüm özellikler
  - Sınırsız ilanlar
  - Premium analytics (İlan durum dağılımı)
  - Tam raporlama sistemi
  - Dönüşüm oranı analizi

## 🛠️ Teknoloji Stack

### Frontend
- **Framework**: Next.js 16.2.1 (App Router, React Server Components)
- **UI Library**: Base UI (render prop pattern, no Radix UI)
- **Styling**: Tailwind CSS (dark theme)
- **Charts**: Recharts v3 (strict TypeScript)
- **Validation**: Zod v4 (preprocess pattern for type coercion)
- **Icons**: Lucide React
- **Forms**: React Hook Form

### Backend
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth (SSR + Cookie-based sessions)
- **API**: Server Actions (no traditional REST)
- **RLS**: Row Level Security policies

### DevOps & Tools
- **Version Control**: Git
- **Language**: TypeScript (strict mode, no any)
- **Package Manager**: npm
- **Development**: Next.js dev server with HMR

## 🚀 Özellikler

### 📊 Dashboard
- Gerçek zamanlı metrikler ve KPI'lar
  - Toplam İlan, Aktif İlan
  - Müşteri Sayısı, Açık Lead
  - Satıldı/Kiralandı (Pack2+)
  - Kazanılan/Kaybedilen Lead, Dönüşüm Oranı (Pack2+)
- Lead durum dağılımı (pie chart)
- Aylık lead akışı (line chart - Pack2+)
- İlan tipi dağılımı (bar chart - Pack2+)
- İlan durum dağılımı (advanced analytics - Pack3)
- Son ilanlar listesi
- Son müşteriler listesi (Pack2+)
- Onboarding rehberi

### 🏠 İlan Yönetimi
- İlan CRUD operasyonları
- İlan filtreleri:
  - Durum (Aktif, Bekliyor, Satıldı, Kiralandı, Pasif)
  - Tip (Daire, Müstakil, Arsa, Ticari, Diğer)
  - Listeleme (Satılık, Kiralık)
  - Arama (başlık, şehir, ilçe)
- İlan limiti kontrolü (paket bazlı)
- Upgrade önerileri
- Detaylı ilanlar görünümü
  - Fiyat, Lokasyon, Alan, Oda sayısı
  - Durum badge'leri

### 👥 Lead Takibi
- Kanban board view (drag & drop)
- 6 Lead durumu:
  - Yeni
  - İletişimde
  - Geziliyor
  - Teklif
  - Kazanıldı
  - Kaybedildi
- Lead CRUD operasyonları
- Performans metrikleri (Pack2+)
  - Kazanılan lead sayısı
  - Kaybedilen lead sayısı
  - Dönüşüm oranı (%)

### 👨‍💼 Müşteri Yönetimi
- Müşteri veritabanı
- İletişim bilgileri (ad, email, telefon)
- Müşteri CRUD operasyonları
- Müşteri listesi görünümü

### ⚙️ Ayarlar
- Profil bilgileri düzenle
- Acenta adı
- Telefon numarası
- Avatar yükleme (prepared for future)

### 💰 Paket Yönetimi
- Paket karşılaştırma tablosu
- Mevcut paket göstergesi
- Upgrade butonları
- WhatsApp entegrasyonu
  - Paket değişim istekleri için hazır mesaj
  - Doğrudan WhatsApp yönlendirme

## 🔐 Güvenlik & Mimarı

- **TypeScript Strict Mode**: Tüm kod type-safe, no `any`
- **React Server Components**: Sensitive işlemler server-side
- **Server Actions**: Form submissions ve mutations
- **Cookie-based Auth**: Secure session management (Supabase)
- **Row Level Security**: Başlangıç implementasyonu
- **Soft Deletes**: Veri kaybını önle (deleted_at timestamps)

## 📱 Responsive Design

- **Desktop** (lg+): Full sidebar + main content
- **Mobile** (< lg): Top bar + hamburger menu
- **Drawer**: Mobile menu overlay
- **Tailwind Breakpoints**: sm, md, lg, xl

## 🔧 Kurulum ve Çalıştırma

### Ön Koşullar
- Node.js 18+
- Supabase hesabı (free tier yeterli)
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükle**
```bash
npm install
```

2. **Ortam değişkenlerini ayarla** (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
```

3. **Database'yi ayarla** (Supabase SQL Editor)
```sql
-- Migrations uygulanır
-- profiles, properties, leads, clients tables
-- RLS policies (başlangıç state)
```

4. **Development server'ı başlat**
```bash
npm run dev
```

5. **Tarayıcıda aç**
```
http://localhost:3000
```

## 📝 Test Kullanıcısı

```
Email: demo@emlak.com
Paket: Pack1 (test edilebilir)
```

## 🗄️ Database Şeması

### profiles table
```sql
id (UUID) - Primary Key
full_name (text)
agency_name (text)
phone (text)
avatar_url (text)
email (text) - from Supabase Auth
package_type (pack1|pack2|pack3)
role (customer_user|agency_admin|super_admin)
is_active (boolean)
created_at (timestamp)
updated_at (timestamp)
package_started_at (timestamp)
package_updated_at (timestamp)
```

### properties table
```sql
id (UUID) - Primary Key
user_id (UUID) - Foreign Key
title (text)
description (text)
property_type (apartment|house|land|commercial|other)
listing_type (sale|rent)
status (active|pending|sold|rented|passive)
price (numeric)
currency (TRY|USD|EUR)
area_sqm (numeric)
rooms (integer)
city (text)
district (text)
created_at (timestamp)
updated_at (timestamp)
deleted_at (timestamp) - Soft delete
```

### leads table
```sql
id (UUID) - Primary Key
user_id (UUID) - Foreign Key
property_id (UUID) - Foreign Key
client_id (UUID) - Foreign Key
status (new|contacted|viewing|offer|won|lost)
notes (text)
created_at (timestamp)
updated_at (timestamp)
```

### clients table
```sql
id (UUID) - Primary Key
user_id (UUID) - Foreign Key
full_name (text)
email (text)
phone (text)
source (text)
created_at (timestamp)
updated_at (timestamp)
deleted_at (timestamp) - Soft delete
```

## 🚨 Bilinen Limitasyonlar & Gelecek Geliştirmeler

- [ ] RLS policies tam uygulanması ve test edilmesi
- [ ] Email notification sistemi
- [ ] SMS entegrasyonu
- [ ] Dosya ve fotoğraf uploads (sözleşmeler, emlak fotoları)
- [ ] Kaydedilmiş arama filtreleri
- [ ] PDF/Excel export
- [ ] Toplu işlemler (bulk edit/delete)
- [ ] REST API (third-party entegrasyonları için)
- [ ] Mobile app (React Native/Flutter)
- [ ] Video tours for properties
- [ ] Property virtual tours
- [ ] Calendar for viewings
- [ ] SMS notifications

## 🔄 Authentication Flow

```
1. User → /login sayfası
2. Email/password giriş
3. Supabase Auth doğrulanması
4. Session cookie oluşturulması
5. Server Component → supabase.auth.getUser()
6. profiles tablosundan kullanıcı bilgileri fetch
7. Package type ve role'e göre features sunulması
8. Dashboard / Protected pages render edilmesi
```

## 📊 Veri Akışı

```
User Actions
    ↓
Server Action
    ↓
Database Mutation (Supabase)
    ↓
Revalidation / Cache Invalidation
    ↓
UI Update (Next.js)
    ↓
User Feedback
```

## 🎨 UI/UX Tasarımı

### Color Scheme
- **Background**: slate-950 (primary), slate-900 (secondary)
- **Primary**: blue-600 (interactive elements)
- **Success**: green-500 (positive states)
- **Warning**: amber-500 (caution states)
- **Danger**: red-500 (destructive actions)
- **Purple**: purple-500 (premium features)

### Typography
- **Headings**: semibold, responsive sizes
- **Body**: Regular weight, slate-300
- **Labels**: Small caps, slate-400

### Components
- Cards: rounded-xl, border-slate-800
- Buttons: Base UI with custom variants
- Forms: React Hook Form + Zod validation
- Lists: Divide with borders, hover effects

## 📈 Performance

- **Server Components**: Reduces JavaScript bundle
- **Server Actions**: No API layer overhead
- **Recharts**: Lightweight chart library
- **Tailwind CSS**: Utility-first, minimal footprint
- **Next.js Optimizations**:
  - Image optimization
  - Code splitting
  - Prefetching

## 🤝 Contributing

1. Feature branch'i oluştur (`git checkout -b feature/xyz`)
2. Değişiklikleri commit et (`git commit -m "feat: description"`)
3. Branch'i push et (`git push origin feature/xyz`)
4. Pull Request aç

## 📄 Lisans

Proprietary - All Rights Reserved

## 👨‍💻 Geliştirici

EmlakCRM - 2026

---

**Versiyon**: 1.0.0 (MVP)
**Status**: Production Ready ✅
**Son Güncelleme**: Nisan 2026
**Deployment Ready**: Yes
