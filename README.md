# Rembug Warga

**Rembugan Bareng, Kota Makin Apik**

Platform partisipasi warga digital (simulasi) untuk tata kelola kota yang lebih baik. Dibuat sebagai Project Akhir Mata Kuliah Demokrasi Digital, FISIP Universitas Airlangga. Tema: *Digital Citizen Participation Platform for Better Urban Governance*.

> ⚠️ Simulasi akademik. Bukan kanal resmi Pemerintah Kota Surabaya.

## Isi platform

| Halaman (panduan project) | Route |
|---|---|
| Home | `/` |
| About Platform | `/tentang` |
| Public Issues (3 isu) | `/isu`, `/isu/sampah`, `/isu/transportasi`, `/isu/perpustakaan` |
| Submit Proposal | `/usulan/baru` (daftar: `/usulan`) |
| Discussion & Deliberation | `/diskusi`, `/usulan/[id]` (forum pro–kontra), `/diskusi/konsensus` |
| Voting & Decision | `/voting`, `/voting/anggaran` |
| Results & Transparency | `/hasil` (live) |
| Contact & Guidelines | `/panduan` |
| Panel moderator | `/admin` (pakai `ADMIN_PASSCODE`) |

**Lima mekanisme partisipasi** (semuanya bisa dicoba saat pameran): Public Proposal, Discussion Forum pro/kontra, Online Voting, Participatory Budgeting (Rp 10 M simulasi), dan Consensus Building ala vTaiwan.

## Untuk tim: edit konten tanpa coding

| Mau mengubah… | Edit file |
|---|---|
| Teks 3 isu (masalah, fakta, terdampak, solusi) | `src/content/issues.ts` |
| Program & biaya anggaran partisipatif | `src/content/budget.ts` |
| Slogan, nama anggota tim, kontak, ambang dukungan | `src/content/site.ts` |
| Pernyataan konsensus & usulan contoh | `supabase/seed.sql` |

> Policy Researcher: bagian `facts` di `issues.ts` sengaja ditulis umum. Tambahkan angka yang sudah diverifikasi **beserta sumbernya** (field `source`).

## Setup (sekali saja)

### 1. Supabase (database, gratis)
1. Buat project di <https://supabase.com> (region Singapore).
2. Buka **SQL Editor**, lalu jalankan isi `supabase/migrations/20261123000000_init.sql`. Setelah itu jalankan `supabase/seed.sql`.
3. Buka **Project Settings → API** dan salin URL, `anon` key, dan `service_role` key.

### 2. Jalankan lokal
```bash
cp .env.example .env.local   # isi nilainya
npm install
npm run dev                  # http://localhost:3000
```

### 3. Deploy ke Vercel
1. Push repo ke GitHub, lalu di Vercel pilih **Add New → Project** dan impor repo ini.
2. Isi **Environment Variables** sama seperti `.env.local`.
3. Deploy. Setelah itu, kode QR di beranda otomatis mengarah ke URL Vercel.

### Database lokal (opsional, butuh Docker)
```bash
npx supabase start       # menjalankan Postgres + API + Realtime lokal
npx supabase db reset    # menerapkan ulang skema + seed
```

## Sebelum pameran (checklist)
- [ ] Isi nama anggota & kontak di `src/content/site.ts`
- [ ] Verifikasi fakta isu + tambahkan sumber
- [ ] Ganti `ADMIN_PASSCODE` di Vercel dengan kode yang kuat
- [ ] Uji semua fitur dari HP lewat kode QR
- [ ] Simulasi oleh anggota tim dan teman sekelas untuk "bukti simulasi fitur" (screenshot halaman Hasil)
- [ ] Cetak kode QR besar untuk booth
- [ ] Jika ingin mulai dari nol saat pameran: kosongkan tabel `votes`, `consensus_votes`, `budget_ballots` di Supabase

## Teknologi
Next.js 16 (App Router), Tailwind CSS 4, Supabase (Postgres + Realtime), Vercel.

## Pengungkapan AI
Kode dan draf awal konten dibuat dengan bantuan asisten AI (Claude). Seluruh isi ditinjau dan menjadi tanggung jawab tim.
