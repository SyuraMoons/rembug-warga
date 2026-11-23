-- =============================================================
-- Data contoh Rembug Warga (jalankan SETELAH migrations/..._init.sql)
-- Hanya usulan, argumen, dan pernyataan contoh dari tim.
-- SENGAJA tidak ada suara palsu: semua angka voting berasal dari peserta nyata
-- (sesuai etika project: tidak memanipulasi voting / tidak memakai bot).
-- =============================================================

-- device_id khusus untuk konten contoh dari tim
-- 00000000-0000-0000-0000-000000000000

insert into public.consensus_statements (issue_slug, text, is_seed) values
  ('sampah', 'Setiap RW wajib memiliki bank sampah yang aktif minimal sebulan sekali.', true),
  ('sampah', 'Warga yang membuang sampah sembarangan sebaiknya dikenai denda.', true),
  ('sampah', 'Pemilahan sampah organik dan anorganik harus dimulai dari rumah tangga.', true),
  ('sampah', 'Pengelolaan TPS sebaiknya diserahkan kepada kelompok warga, bukan hanya dinas.', true),
  ('transportasi', 'Halte yang ramah disabilitas lebih penting daripada menambah jumlah halte baru.', true),
  ('transportasi', 'Pelajar seharusnya bisa naik bus kota secara gratis.', true),
  ('transportasi', 'Pembayaran bus sebaiknya tetap menerima uang tunai, bukan hanya non-tunai.', true),
  ('transportasi', 'Jalur sepeda motor perlu dikurangi untuk memberi ruang bagi bus dan pejalan kaki.', true),
  ('perpustakaan', 'Perpustakaan umum sebaiknya buka sampai malam pada hari sekolah.', true),
  ('perpustakaan', 'Anggaran perpustakaan lebih baik dipakai untuk ruang belajar daripada menambah buku cetak.', true),
  ('perpustakaan', 'Setiap kelurahan perlu memiliki pojok baca yang dikelola karang taruna.', true),
  ('perpustakaan', 'E-library sudah cukup; perpustakaan fisik tidak perlu ditambah.', true);

with p as (
  insert into public.proposals (id, issue_slug, title, body, kecamatan, author_name, author_group, device_id, is_seed) values
  ('11111111-1111-1111-1111-111111111111', 'sampah',
   'Tong pilah tiga warna di setiap gang',
   'Banyak warga sebenarnya mau memilah sampah, tapi tidak ada wadah terpisah di gang. Saya usul disediakan tong tiga warna (organik, anorganik, residu) di setiap gang beserta stiker panduan sederhana, lalu hasil pilahan organik diolah jadi kompos di tingkat RW.',
   'Tambaksari', 'Tim Rembug Warga (contoh)', 'lainnya', '00000000-0000-0000-0000-000000000000', true),
  ('22222222-2222-2222-2222-222222222222', 'transportasi',
   'Halte depan sekolah diberi atap dan lampu',
   'Siswa yang pulang sore sering menunggu bus di halte tanpa atap dan tanpa penerangan. Saat hujan mereka berteduh di emperan toko dan bisa ketinggalan bus. Usul: prioritaskan renovasi halte yang berada dalam radius 300 meter dari sekolah.',
   'Sukolilo', 'Tim Rembug Warga (contoh)', 'lainnya', '00000000-0000-0000-0000-000000000000', true),
  ('33333333-3333-3333-3333-333333333333', 'perpustakaan',
   'Balai RW jadi ruang belajar malam',
   'Balai RW sering kosong di malam hari. Bagaimana kalau dibuka sebagai ruang belajar pelajar pukul 18.00–22.00 dengan Wi-Fi gratis dan rak buku sumbangan warga, dijaga bergiliran oleh karang taruna?',
   'Wonokromo', 'Tim Rembug Warga (contoh)', 'lainnya', '00000000-0000-0000-0000-000000000000', true)
  returning id
)
select count(*) from p;

insert into public.comments (proposal_id, stance, body, author_name, author_group, device_id, is_seed) values
  ('11111111-1111-1111-1111-111111111111', 'pro', 'Setuju, di kampung saya sudah dicoba dan sampah yang ke TPS berkurang hampir separuh.', 'Contoh', 'lainnya', '00000000-0000-0000-0000-000000000000', true),
  ('11111111-1111-1111-1111-111111111111', 'kontra', 'Percuma kalau truk pengangkut tetap mencampur semua sampah. Harus dibenahi sistem angkutnya dulu.', 'Contoh', 'lainnya', '00000000-0000-0000-0000-000000000000', true),
  ('22222222-2222-2222-2222-222222222222', 'pro', 'Penting untuk keselamatan siswa, apalagi siswi yang pulang sore.', 'Contoh', 'lainnya', '00000000-0000-0000-0000-000000000000', true),
  ('22222222-2222-2222-2222-222222222222', 'netral', 'Perlu dicek juga apakah trotoar menuju halte sudah aman dan tidak dipakai parkir.', 'Contoh', 'lainnya', '00000000-0000-0000-0000-000000000000', true),
  ('33333333-3333-3333-3333-333333333333', 'pro', 'Ide bagus dan murah karena memakai fasilitas yang sudah ada.', 'Contoh', 'lainnya', '00000000-0000-0000-0000-000000000000', true),
  ('33333333-3333-3333-3333-333333333333', 'kontra', 'Siapa yang menanggung listrik dan keamanan? Jangan sampai membebani pengurus RW.', 'Contoh', 'lainnya', '00000000-0000-0000-0000-000000000000', true);
