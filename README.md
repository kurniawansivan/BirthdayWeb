# 🎂 Birthday Web

Mobile birthday website yang bisa di-deploy ke Vercel. Dibangun dengan Vue 3 + Vite, semua teks dalam Bahasa Indonesia.

**Live demo flow:** Splash animasi → Beranda → Galeri foto → Kuis → Game → Timeline → Surat Cinta → Scratch Card Kejutan

---

## Fitur

| Halaman | Deskripsi |
|---|---|
| Splash | Animasi pembuka dengan nama & umur |
| Beranda | Hero section, stat hari bersama, menu navigasi |
| Galeri Foto | Grid 2 kolom (rasio 9:16), lightbox, tombol suka |
| Kuis Cinta | Pilihan ganda dari `.env`, feedback per soal, skor akhir |
| Game Tangkap Hati | Tap hati jatuh, 30 detik, sistem combo, bonus bintang emas |
| Perjalanan Kita | Timeline kisah cinta dengan animasi scroll-reveal |
| Surat Cinta | Amplop interaktif, teks muncul satu paragraf per waktu |
| Kejutan | Scratch card gosok + confetti, ucapan ulang tahun |

---

## Tech Stack

- [Vue 3](https://vuejs.org/) — Composition API (`<script setup>`)
- [Vite](https://vitejs.dev/) — build tool
- [Vue Router 4](https://router.vuejs.org/) — SPA routing
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — efek confetti
- Google Fonts: Dancing Script + Nunito

---

## Cara Pakai

### 1. Clone & Install

```bash
git clone <repo-url>
cd BirthdayWeb
npm install
```

### 2. Konfigurasi `.env`

Copy file contoh:

```bash
cp .env.example .env
```

Lalu isi semua variabel di `.env`:

```env
# Nama pacar kamu
VITE_PARTNER_NAME=Sayang

# Nama kamu
VITE_YOUR_NAME=Kamu

# Umur yang dirayakan
VITE_PARTNER_AGE=23

# Tanggal ulang tahun (teks bebas)
VITE_BIRTHDAY_DATE=21 Juni 2003

# Tanggal jadian — dipakai untuk hitung hari bersama (format YYYY-MM-DD)
VITE_RELATIONSHIP_START_DATE=2024-01-01

# Pesan di hero section beranda
VITE_MAIN_MESSAGE=Selamat Ulang Tahun, Sayangku!

# Isi surat cinta — pisahkan tiap paragraf dengan |||
VITE_LOVE_LETTER=Paragraf pertama...|||Paragraf kedua...|||Paragraf ketiga...

# Jumlah foto di folder public/images/
VITE_TOTAL_IMAGES=9

# Kota/tempat spesial kalian
VITE_SPECIAL_PLACE=Jakarta

# Soal kuis — format: pertanyaan|jawaban_benar|salah1|salah2|salah3
# Pisahkan tiap soal dengan |||
VITE_QUIZ_QUESTIONS=Warna favoritku apa?|Pink|Biru|Hijau|Kuning|||Makanan favoritku apa?|Sushi|Pizza|Ramen|Pasta
```

### 3. Tambah Foto

Taruh foto di folder `public/images/` dengan penamaan:

```
public/images/image1.jpg
public/images/image2.jpg
...
public/images/image9.jpg
```

- Rasio ideal: **9:16** (portrait/vertikal)
- Format: JPG, PNG, atau WebP
- Update `VITE_TOTAL_IMAGES` sesuai jumlah foto yang ditaruh

### 4. Edit Timeline

Buka `src/views/TimelineView.vue` dan edit array `events` dengan kisah nyata kalian:

```js
const events = ref([
  {
    id: 1,
    emoji: '💫',
    title: 'Pertama Kali Ketemu',
    desc: 'Cerita kalian di sini...',
    date: 'Tanggal atau keterangan waktu',
    color: '#FF9A9E',
  },
  // tambah event lain...
])
```

### 5. Jalankan

```bash
npm run dev      # development — buka http://localhost:3000
npm run build    # build production ke folder dist/
npm run preview  # preview hasil build secara lokal
```

---

## Deploy ke Vercel

> **Penting:** Jangan commit file `.env` ke repository. File `.gitignore` sudah mengecualikannya.

### Langkah

1. Push repo ke GitHub
2. Buka [vercel.com](https://vercel.com) → **New Project** → import repo
3. Di **Settings → Environment Variables**, tambahkan semua `VITE_*` dari `.env` kamu secara manual
4. Build settings (Vercel biasanya auto-detect, tapi kalau perlu):
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Deploy

File `vercel.json` sudah dikonfigurasi untuk SPA routing (semua path diarahkan ke `index.html`).

---

## Struktur Folder

```
BirthdayWeb/
├── public/
│   └── images/
│       ├── image1.jpg     ← ganti dengan foto asli
│       └── ...
├── src/
│   ├── views/
│   │   ├── SplashView.vue
│   │   ├── HomeView.vue
│   │   ├── GalleryView.vue
│   │   ├── QuizView.vue
│   │   ├── GameView.vue
│   │   ├── TimelineView.vue
│   │   ├── LetterView.vue
│   │   └── SurpriseView.vue
│   ├── components/
│   │   ├── BottomNav.vue
│   │   └── FloatingHearts.vue
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   ├── main.js
│   └── style.css          ← design tokens (warna, font, dll)
├── .env                   ← data personal (JANGAN di-commit)
├── .env.example           ← template kosong
├── vercel.json            ← SPA routing config
├── CLAUDE.md              ← referensi untuk Claude Code
└── README.md
```

---

## Kustomisasi Lanjutan

### Ganti Warna

Edit CSS variables di `src/style.css`:

```css
:root {
  --pink: #FF6B9D;
  --hot-pink: #FF1493;
  --purple: #C471ED;
  --gradient-main: linear-gradient(135deg, #FF6B9D 0%, #C471ED 50%, #9B59B6 100%);
}
```

### Tambah Halaman Baru

1. Buat file baru di `src/views/NamaView.vue`
2. Daftarkan di `src/router/index.js`
3. Tambahkan ke `navItems` di `src/components/BottomNav.vue` jika ingin muncul di tab bawah

### Tambah/Kurangi Soal Kuis

Edit `VITE_QUIZ_QUESTIONS` di `.env`. Format per soal:

```
pertanyaan|jawaban_benar|pilihan_salah_1|pilihan_salah_2|pilihan_salah_3
```

Pisahkan antar soal dengan `|||`.

---

## Lisensi

Bebas dipakai untuk keperluan pribadi. Dibuat dengan ❤️
