# Rembug Warga

**Rembugan Bareng, Kota Makin Apik**

🌐 **Coba langsung:** <https://rembug-warga.vercel.app>

Rembug Warga adalah website tempat warga Surabaya **mengusulkan, mendiskusikan, dan memutuskan** solusi untuk masalah kota secara bersama-sama, lalu **memantau hasilnya secara terbuka**.

Project ini adalah **simulasi akademik** untuk Project Akhir Mata Kuliah Demokrasi Digital, FISIP Universitas Airlangga, dengan tema *Digital Citizen Participation Platform for Better Urban Governance*.

> ⚠️ Bukan kanal resmi Pemerintah Kota Surabaya. Semua data adalah data simulasi.

---

## Masalah yang ingin dijawab

Warga sering hanya bisa **mengeluh** soal masalah kota, tanpa jalur yang jelas untuk **ikut menentukan solusinya**. Rembug Warga mengubah keluhan menjadi usulan, usulan menjadi diskusi, dan diskusi menjadi keputusan yang bisa dilihat semua orang.

## Tiga isu yang dibahas

| Isu | Contoh solusi yang ditawarkan |
|---|---|
| 🗑️ **Pengelolaan sampah** | Bank sampah digital per RW, TPS 3R & kompos komunal |
| 🚌 **Transportasi umum & halte** | Halte ramah semua, rute feeder ke kampus & sekolah |
| 📚 **Perpustakaan publik bagi pelajar** | Ruang belajar 24 jam, perpustakaan keliling & pojok baca RW |

## Cara kerjanya (alur warga)

```
1. Isi profil singkat  →  2. Pelajari isu  →  3. Usulkan & diskusikan  →  4. Beri suara  →  5. Pantau hasil
   (tanpa login/NIK)        (masalah & solusi)    (argumen pro/kontra)       (dukung/tolak)     (real-time)
```

Tidak perlu daftar akun. Cukup pilih kategori warga (pelajar, pekerja, lansia, disabilitas, dll.) agar hasilnya bisa dianalisis per kelompok.

**Coba Sekarang (`/coba`)**: alur terpandu 4 langkah untuk warga yang belum terbiasa teknologi dan pengunjung booth (kode QR di beranda mengarah ke sini): pilih isu → dukung satu usulan → jawab satu pernyataan "setuju atau tidak?" → selesai. Satu layar satu tugas, tombol besar, sekitar 1 menit.

## Ramah untuk semua warga

- **Bahasa sederhana di halaman warga.** Kerangka akademik (ringkasan eksekutif, defisit demokrasi, Tujuan/Cara kerja/Dampak tiap mekanisme, SWOT) dikumpulkan di `/tentang`. Di halaman aksi, penjelasan itu dilipat di balik tombol "Kenapa ini penting?". Teksnya diambil dari satu sumber: `src/content/mechanisms.ts`.
- **Gambar, bukan paragraf.** Meteran "x/15 dukungan" menggantikan penjelasan ambang dukungan; ikon dan tombol besar (≥44px) di setiap aksi.
- **Animasi umpan balik yang halus**: angka "pop" saat memberi suara, bar yang terisi, hasil konsensus yang muncul setelah memilih, dan geser antar-langkah di `/coba` (React `<ViewTransition>`). Semua animasi mati jika perangkat meminta *reduced motion*.

## Lima cara warga berpartisipasi

| Mekanisme | Apa yang dilakukan warga | Halaman |
|---|---|---|
| **Usulan Publik** | Menulis usulan solusi untuk salah satu isu | `/usulan/baru` |
| **Forum Diskusi** | Memberi argumen **pro / kontra / netral** pada usulan warga lain | `/usulan/[id]` |
| **Voting Online** | Mendukung atau menolak usulan. Usulan dengan ≥ 15 dukungan otomatis berstatus *Dipertimbangkan* | `/voting` |
| **Anggaran Partisipatif** | Membagi anggaran simulasi **Rp 10 miliar** ke program-program pilihan (total program Rp 19,2 M, jadi harus memilih) | `/voting/anggaran` |
| **Membangun Konsensus** | Menjawab *setuju / tidak / ragu* pada pernyataan singkat (terinspirasi vTaiwan & Pol.is) untuk menemukan titik temu | `/diskusi/konsensus` |

Semua hasil tampil **langsung (real-time)** di halaman **Hasil & Transparansi** (`/hasil`), termasuk log moderasi, supaya tidak ada yang disembunyikan.

## Peta halaman

| Halaman | Alamat |
|---|---|
| Beranda | `/` |
| Coba Sekarang (alur terpandu) | `/coba` |
| Tentang platform | `/tentang` |
| Isu publik | `/isu`, `/isu/sampah`, `/isu/transportasi`, `/isu/perpustakaan` |
| Usulan warga | `/usulan`, `/usulan/baru`, `/usulan/[id]` |
| Diskusi & konsensus | `/diskusi`, `/diskusi/konsensus` |
| Voting & anggaran | `/voting`, `/voting/anggaran` |
| Hasil & transparansi | `/hasil` |
| Panduan, aturan & kontak | `/panduan` |
| Panel moderator | `/admin` (butuh `ADMIN_PASSCODE`) |

## Etika & aturan main

- **Satu perangkat, satu suara.** Dilarang memakai bot atau banyak perangkat.
- **Tidak ada suara palsu.** Data contoh hanya berisi usulan, argumen & pernyataan; semua angka voting berasal dari peserta nyata.
- **Data minim.** Tidak meminta NIK, nomor HP, atau alamat; nama panggilan bersifat opsional.
- **Moderasi terbuka.** Setiap konten yang disembunyikan moderator tercatat di log publik.

---

## Untuk tim: ubah konten tanpa coding

| Mau mengubah… | Edit file |
|---|---|
| Teks 3 isu (masalah, fakta, kelompok terdampak, solusi) | `src/content/issues.ts` |
| Program & biaya anggaran partisipatif | `src/content/budget.ts` |
| Slogan, nama anggota tim, kontak, ambang dukungan | `src/content/site.ts` |
| Pernyataan konsensus & usulan contoh | `supabase/seed.sql` |

> **Policy Researcher:** bagian `facts` di `issues.ts` masih ditulis umum. Tambahkan angka yang sudah diverifikasi **beserta sumbernya** (field `source`).

## Menjalankan project

**Teknologi:** Next.js 16 (App Router), Tailwind CSS 4, Supabase (Postgres + Realtime), Vercel.

### 1. Siapkan database (Supabase)
1. Buat project di <https://supabase.com> (region Singapore).
2. Buka **SQL Editor**, jalankan isi `supabase/migrations/20261123000000_init.sql`, lalu jalankan `supabase/seed.sql`.
3. Buka **Project Settings → API Keys** dan salin *Project URL*, *publishable key*, dan *secret key*.

### 2. Jalankan di komputer sendiri
```bash
cp .env.example .env.local   # lalu isi nilainya (lihat tabel di bawah)
npm install
npm run dev                  # buka http://localhost:3000
```

| Variabel | Isi |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL dari Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key (`sb_publishable_…`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key (`sb_secret_…`). **Rahasia, jangan dibagikan** |
| `ADMIN_PASSCODE` | Kode masuk panel `/admin`, buat sendiri (min. 10 karakter) |
| `NEXT_PUBLIC_SITE_URL` | Opsional: URL publik untuk kode QR |

### 3. Deploy ke Vercel
1. Di Vercel pilih **Add New → Project** dan impor repo ini.
2. Isi **Environment Variables** sama seperti `.env.local`.
3. Deploy. Kode QR di beranda otomatis mengarah ke URL Vercel.

### Database lokal (opsional, butuh Docker)
```bash
npx supabase start       # menjalankan Postgres + API + Realtime lokal
npx supabase db reset    # menerapkan ulang skema + data contoh
```

## Checklist sebelum pameran
- [ ] Isi nama anggota & kontak di `src/content/site.ts`
- [ ] Verifikasi fakta isu + tambahkan sumber
- [ ] Ganti `ADMIN_PASSCODE` di Vercel dengan kode yang kuat
- [ ] Uji semua fitur dari HP lewat kode QR
- [ ] Simulasi bersama anggota tim & teman sekelas untuk "bukti simulasi fitur" (screenshot halaman Hasil)
- [ ] Cetak kode QR besar untuk booth
- [ ] Jika ingin mulai dari nol saat pameran: kosongkan tabel `votes`, `consensus_votes`, `budget_ballots` di Supabase

---

*Alat bantu AI dipakai dalam pengembangan; seluruh isi ditinjau dan menjadi tanggung jawab tim.*
