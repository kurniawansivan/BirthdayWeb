# Birthday Web — CLAUDE.md

## Project

Mobile birthday website untuk pacar. Vue 3 + Vite, deploy ke Vercel.

## Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Vue Router 4** (hash-less history mode)
- **canvas-confetti** — efek confetti di game & kejutan
- **Google Fonts** — Dancing Script (dekoratif) + Nunito (body)
- **Vite** — dev server & bundler

## Struktur

```
src/
  views/
    SplashView.vue      — halaman pembuka animasi
    HomeView.vue        — beranda + navigasi fitur
    GalleryView.vue     — galeri foto 9:16 + lightbox + like
    QuizView.vue        — kuis pilihan ganda (soal dari .env)
    GameView.vue        — game tangkap hati jatuh (30 detik)
    TimelineView.vue    — timeline kisah cinta
    LetterView.vue      — surat cinta dari amplop
    SurpriseView.vue    — scratch card + ucapan selamat
  components/
    BottomNav.vue       — navigasi bawah 5 tab
    FloatingHearts.vue  — dekorasi hati melayang
  router/index.js       — definisi routes
  style.css             — global CSS + design tokens
  App.vue               — root + RouterView
public/
  images/
    image1.jpg … image9.jpg   — foto 9:16 (ganti dengan foto asli)
```

## Environment Variables (.env)

Semua data personal di `.env` — **JANGAN commit file ini**.

| Variable | Keterangan |
|---|---|
| `VITE_PARTNER_NAME` | Nama pacar |
| `VITE_YOUR_NAME` | Nama kamu |
| `VITE_PARTNER_AGE` | Umur yang dirayakan |
| `VITE_BIRTHDAY_DATE` | Tanggal ulang tahun (teks bebas) |
| `VITE_RELATIONSHIP_START_DATE` | Tanggal jadian (format `YYYY-MM-DD`) |
| `VITE_MAIN_MESSAGE` | Pesan hero di halaman beranda |
| `VITE_LOVE_LETTER` | Isi surat cinta, pisah paragraf dengan `\|\|\|` |
| `VITE_TOTAL_IMAGES` | Jumlah foto di `public/images/` |
| `VITE_SPECIAL_PLACE` | Kota/tempat spesial |
| `VITE_QUIZ_QUESTIONS` | Soal kuis (format di bawah) |

### Format VITE_QUIZ_QUESTIONS

```
pertanyaan|jawaban_benar|salah1|salah2|salah3|||pertanyaan2|...
```

## Foto

Taruh foto di `public/images/` dengan nama `image1.jpg`, `image2.jpg`, dst.
- Rasio ideal: **9:16** (portrait)
- Format: JPG/PNG/WebP
- Update `VITE_TOTAL_IMAGES` sesuai jumlah foto

## Cara Jalankan

```bash
npm run dev        # development server (localhost:3000)
npm run build      # build untuk production
npm run preview    # preview hasil build
```

## Deploy ke Vercel

1. Push repo ke GitHub (pastikan `.env` ada di `.gitignore`)
2. Connect repo di vercel.com
3. **Environment variables** diisi manual di Vercel dashboard (Settings → Environment Variables)
4. Build command: `npm run build`
5. Output directory: `dist`

File `vercel.json` sudah dikonfigurasi untuk SPA routing.

## Design Tokens (src/style.css)

```css
--pink: #FF6B9D
--hot-pink: #FF1493
--purple: #C471ED
--dark: #3D1147
--gradient-main: linear-gradient(135deg, #FF6B9D, #C471ED, #9B59B6)
--font-script: 'Dancing Script'
--font-body: 'Nunito'
```

## Tambah Halaman Baru

1. Buat `src/views/NamaView.vue`
2. Daftarkan di `src/router/index.js`
3. Tambahkan ke `navItems` di `BottomNav.vue` jika perlu tab

## Customisasi Timeline (TimelineView.vue)

Edit array `events` langsung di file — isi tanggal dan cerita sesuai kisah nyata.
