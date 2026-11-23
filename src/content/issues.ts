// =============================================================
// Konten tiga isu publik.
// Untuk Policy & Issue Researcher: edit teks di file ini saja,
// tidak perlu menyentuh kode lain. Tambahkan data/angka yang sudah
// diverifikasi (sebutkan sumbernya) di bagian `facts`.
// =============================================================

export type IssueSlug = "sampah" | "transportasi" | "perpustakaan";

export type Issue = {
  slug: IssueSlug;
  title: string;
  shortTitle: string;
  tagline: string;
  /** Action title: kesimpulan utama isu dalam satu kalimat (maks. 2 baris). */
  headline: string;
  /** Pertanyaan kunci yang ingin dijawab bersama warga. */
  keyQuestion: string;
  /** Tujuan & dampak yang diharapkan (kolom Objective / Impact). */
  objective: string;
  expectedImpact: string;
  /** Titik masalah, dikelompokkan per akar masalah (kolom Pain Points). */
  painPoints: { title: string; points: string[] }[];
  /** Poin kunci di akhir halaman isu. */
  takeaway: string;
  problem: string[];
  facts: { label: string; source?: string }[];
  affected: { group: string; impact: string }[];
  solutions: { title: string; description: string; pros: string; cons: string }[];
  involvement: string[];
};

export const ISSUES: Issue[] = [
  {
    slug: "sampah",
    title: "Pengelolaan Sampah & Fasilitas Pembuangan",
    shortTitle: "Sampah",
    tagline: "Kota bersih dimulai dari kampung yang terlibat.",
    headline: "Sampah yang dipilah dari rumah dan diangkut dengan jadwal jelas akan membuat kampung lebih bersih dan sehat.",
    keyQuestion: "Bagaimana Surabaya bisa mengurangi sampah tak terpilah dan titik buang liar dengan melibatkan warga sejak dari rumah?",
    objective: "Mengurangi sampah yang tidak terpilah dan titik buang liar di permukiman.",
    expectedImpact: "Lebih sedikit sampah ke TPA, kampung lebih bersih, serta risiko banjir dan penyakit berkurang.",
    painPoints: [
      { title: "Fasilitas & layanan", points: ["Jarak ke TPS jauh di sebagian kampung", "Jadwal pengangkutan tidak menentu", "Titik buang liar di sungai dan lahan kosong"] },
      { title: "Kebiasaan & partisipasi", points: ["Sampah rumah tangga belum dipilah dari sumber", "Partisipasi bank sampah belum merata", "Info lokasi & manfaat TPS 3R belum menjangkau semua warga"] },
    ],
    takeaway:
      "Masalah sampah bukan hanya soal fasilitas, tetapi juga kebiasaan. Solusi terkuat menggabungkan insentif bagi warga (bank sampah) dengan layanan yang transparan (jadwal angkut & kanal lapor).",
    problem: [
      "Volume sampah rumah tangga terus naik seiring pertumbuhan penduduk, sementara sebagian besar masih berakhir di TPA tanpa dipilah dari sumbernya.",
      "Di beberapa kampung, jarak ke TPS jauh dan jadwal pengangkutan tidak menentu, sehingga muncul titik buang sampah liar di sungai, saluran air, dan lahan kosong.",
      "Program bank sampah dan TPS 3R sudah ada, tetapi partisipasi warga belum merata dan informasi soal lokasi serta manfaatnya belum menjangkau semua kalangan.",
    ],
    facts: [
      { label: "Surabaya memiliki TPA Benowo yang juga dilengkapi pembangkit listrik tenaga sampah." },
      { label: "Program bank sampah dan TPS 3R sudah berjalan di banyak kelurahan, namun keaktifannya bervariasi." },
      { label: "Sampah yang tidak terkelola memperparah risiko banjir saat musim hujan." },
    ],
    affected: [
      { group: "Warga kampung padat penduduk", impact: "Paling dekat dengan titik sampah liar, bau, dan risiko penyakit." },
      { group: "Petugas kebersihan & pemulung", impact: "Beban kerja berat dan risiko kesehatan karena sampah tidak terpilah." },
      { group: "Pedagang pasar & UMKM", impact: "Menghasilkan sampah organik besar tanpa fasilitas olah yang memadai." },
      { group: "Anak-anak & lansia", impact: "Rentan terhadap penyakit akibat lingkungan yang kotor." },
    ],
    solutions: [
      {
        title: "Bank Sampah Digital di setiap RW",
        description: "Warga menabung sampah terpilah dan mendapat saldo yang bisa ditukar dengan kebutuhan pokok atau pulsa, dicatat lewat aplikasi.",
        pros: "Memberi insentif ekonomi langsung dan membangun kebiasaan memilah.",
        cons: "Butuh pengelola sukarela yang konsisten di tiap RW.",
      },
      {
        title: "Perluasan TPS 3R & kompos komunal",
        description: "Menambah tempat olah sampah Reduce–Reuse–Recycle dan rumah kompos di kecamatan yang belum terlayani.",
        pros: "Mengurangi sampah yang dikirim ke TPA secara signifikan.",
        cons: "Biaya lahan dan operasional relatif besar.",
      },
      {
        title: "Jadwal angkut terbuka & kanal lapor sampah liar",
        description: "Jadwal pengangkutan dipublikasikan per kelurahan dan warga bisa melapor titik sampah liar dengan foto dan lokasi.",
        pros: "Transparan dan mudah dipantau warga.",
        cons: "Efektif hanya jika laporan benar-benar ditindaklanjuti cepat.",
      },
    ],
    involvement: [
      "Mengajukan usulan perbaikan fasilitas sampah di lingkungan sendiri",
      "Memberi argumen pro/kontra pada usulan warga lain",
      "Menentukan prioritas program sampah lewat anggaran partisipatif",
      "Menyatakan setuju/tidak setuju pada pernyataan kebijakan di Rembug Konsensus",
    ],
  },
  {
    slug: "transportasi",
    title: "Transportasi Umum & Fasilitas Halte",
    shortTitle: "Transportasi",
    tagline: "Naik angkutan umum harus nyaman, aman, dan bisa diandalkan.",
    headline: "Halte yang layak dan rute yang menjangkau permukiman akan membuat warga beralih ke angkutan umum.",
    keyQuestion: "Bagaimana angkutan umum Surabaya bisa menjadi pilihan utama warga, terutama pelajar dan kelompok rentan?",
    objective: "Membuat angkutan umum nyaman, aman, dan bisa diandalkan untuk perjalanan harian.",
    expectedImpact: "Lebih banyak warga naik angkutan umum, biaya transportasi harian turun, dan kemacetan berkurang.",
    painPoints: [
      { title: "Jangkauan & keandalan", points: ["Rute belum menjangkau banyak permukiman", "Frekuensi bus belum memadai", "Info kedatangan real-time belum merata"] },
      { title: "Fasilitas halte", points: ["Banyak halte tanpa atap dan kursi layak", "Akses disabilitas belum lengkap", "Halte gelap dan sepi terasa tidak aman"] },
    ],
    takeaway:
      "Warga tidak beralih ke angkutan umum hanya karena busnya ada. Mereka butuh kepastian (rute & jadwal) dan kenyamanan (halte layak & aman) sekaligus.",
    problem: [
      "Layanan seperti Suroboyo Bus, Trans Semanggi Suroboyo, dan feeder Wira Wiri sudah hadir, namun jangkauan rute dan frekuensinya belum menjangkau banyak kawasan permukiman.",
      "Sebagian halte belum memiliki atap yang layak, tempat duduk, informasi rute, maupun akses ramah disabilitas, sehingga menunggu bus terasa tidak nyaman dan tidak pasti.",
      "Akibatnya banyak warga, termasuk pelajar, tetap bergantung pada kendaraan pribadi atau ojek daring, yang menambah kemacetan dan biaya harian.",
    ],
    facts: [
      { label: "Surabaya mengoperasikan Suroboyo Bus, BRT Trans Semanggi Suroboyo, dan angkutan feeder Wira Wiri Suroboyo." },
      { label: "Pembayaran sudah mulai beralih ke non-tunai, yang bisa menjadi hambatan bagi sebagian warga." },
      { label: "Informasi kedatangan bus real-time belum tersedia merata di halte." },
    ],
    affected: [
      { group: "Pelajar & mahasiswa", impact: "Butuh transportasi murah dan tepat waktu ke sekolah dan kampus." },
      { group: "Pekerja berpenghasilan rendah", impact: "Biaya transportasi pribadi memakan porsi besar dari pendapatan." },
      { group: "Penyandang disabilitas & lansia", impact: "Halte dan armada yang tidak aksesibel menutup akses mereka." },
      { group: "Perempuan", impact: "Halte yang gelap dan sepi menimbulkan rasa tidak aman, terutama malam hari." },
    ],
    solutions: [
      {
        title: "Renovasi halte ramah semua",
        description: "Atap, kursi, penerangan, ramp kursi roda, guiding block, dan papan info rute di halte prioritas.",
        pros: "Langsung terasa oleh pengguna dan meningkatkan rasa aman.",
        cons: "Tidak menambah jumlah rute atau armada.",
      },
      {
        title: "Rute feeder baru ke kampus & sekolah",
        description: "Menambah rute angkutan pengumpan yang menghubungkan permukiman padat dengan kawasan pendidikan.",
        pros: "Memperluas jangkauan layanan bagi pelajar.",
        cons: "Biaya operasional tahunan tinggi.",
      },
      {
        title: "Info kedatangan bus real-time",
        description: "Layar di halte utama dan integrasi ke aplikasi agar warga tahu kapan bus tiba.",
        pros: "Mengurangi waktu tunggu yang tidak pasti dengan biaya relatif rendah.",
        cons: "Bergantung pada akurasi GPS armada dan akses internet.",
      },
    ],
    involvement: [
      "Mengusulkan perbaikan halte atau rute baru di daerahmu",
      "Mendiskusikan usulan rute dan fasilitas dengan warga lain",
      "Memilih program transportasi prioritas dalam simulasi anggaran",
      "Ikut Rembug Konsensus soal kebijakan transportasi",
    ],
  },
  {
    slug: "perpustakaan",
    title: "Ruang Perpustakaan Publik bagi Pelajar",
    shortTitle: "Perpustakaan",
    tagline: "Ruang belajar yang dekat, gratis, dan buka saat pelajar butuh.",
    headline: "Ruang belajar publik yang dekat, gratis, dan buka sampai malam akan memperkecil kesenjangan belajar pelajar.",
    keyQuestion: "Bagaimana pelajar Surabaya, termasuk dari keluarga kurang mampu, bisa mendapat ruang belajar yang layak dan gratis?",
    objective: "Menyediakan ruang belajar publik yang mudah dijangkau dan buka saat pelajar membutuhkannya.",
    expectedImpact: "Pelajar punya pilihan selain kafe berbayar atau rumah sempit, sehingga kesempatan belajar lebih merata.",
    painPoints: [
      { title: "Akses & jam buka", points: ["Perpustakaan umum belum tersebar merata", "Jam buka bertabrakan dengan jam sekolah", "Ruang belajar gratis ber-internet masih terbatas"] },
      { title: "Pemanfaatan", points: ["Koleksi & fasilitas taman baca belum optimal", "Promosi BLC dan taman baca masih kurang", "Pelajar kurang mampu paling dirugikan"] },
    ],
    takeaway:
      "Kebutuhan utama pelajar adalah ruang dan waktu, bukan hanya buku. Solusi fisik (ruang belajar malam) dan digital (e-library) saling melengkapi untuk menutup kesenjangan.",
    problem: [
      "Pelajar membutuhkan ruang belajar yang tenang, gratis, dan memiliki internet, tetapi perpustakaan umum tidak tersebar merata dan jam bukanya terbatas.",
      "Banyak pelajar akhirnya belajar di kafe yang berbayar atau di rumah yang sempit dan bising, sehingga pelajar dari keluarga kurang mampu paling dirugikan.",
      "Taman baca dan Broadband Learning Center sudah ada di sejumlah titik, namun koleksi, fasilitas, dan promosinya belum optimal sehingga belum banyak dimanfaatkan.",
    ],
    facts: [
      { label: "Surabaya memiliki jaringan taman baca masyarakat dan Broadband Learning Center (BLC) di berbagai kelurahan." },
      { label: "Jam operasional perpustakaan umum umumnya mengikuti jam kerja, bertabrakan dengan jam sekolah." },
      { label: "Kebutuhan ruang belajar meningkat menjelang ujian sekolah dan seleksi masuk perguruan tinggi." },
    ],
    affected: [
      { group: "Pelajar SMP/SMA", impact: "Kekurangan ruang belajar dan akses sumber belajar gratis." },
      { group: "Mahasiswa", impact: "Butuh ruang kerja kelompok dan internet stabil di luar kampus." },
      { group: "Keluarga berpenghasilan rendah", impact: "Tidak mampu membiayai les, buku, atau tempat belajar berbayar." },
      { group: "Anak-anak", impact: "Minat baca sulit tumbuh tanpa akses buku yang dekat dan menarik." },
    ],
    solutions: [
      {
        title: "Perpustakaan 24 jam / co-learning space",
        description: "Membuka ruang belajar dengan Wi-Fi, colokan, dan ruang diskusi yang buka hingga malam di beberapa kecamatan.",
        pros: "Menjawab kebutuhan utama pelajar akan ruang belajar.",
        cons: "Butuh biaya keamanan dan petugas malam.",
      },
      {
        title: "Perpustakaan keliling & pojok baca RW",
        description: "Mobil perpustakaan terjadwal dan rak buku di balai RW, taman kota, dan halte.",
        pros: "Murah dan menjangkau kampung yang jauh dari perpustakaan.",
        cons: "Tidak menyediakan ruang belajar yang nyaman.",
      },
      {
        title: "E-library gratis untuk pelajar",
        description: "Digitalisasi koleksi dan akses buku elektronik gratis dengan kartu pelajar.",
        pros: "Bisa diakses dari mana saja kapan saja.",
        cons: "Tidak membantu pelajar tanpa gawai atau internet (kesenjangan digital).",
      },
    ],
    involvement: [
      "Mengusulkan lokasi atau fasilitas perpustakaan yang kamu butuhkan",
      "Berdebat sehat soal usulan perpustakaan warga lain",
      "Mengalokasikan anggaran simulasi untuk program literasi",
      "Ikut Rembug Konsensus soal kebijakan ruang belajar",
    ],
  },
];

export const ISSUE_BY_SLUG = Object.fromEntries(ISSUES.map((i) => [i.slug, i])) as Record<IssueSlug, Issue>;

export const ISSUE_SLUGS = ISSUES.map((i) => i.slug) as [IssueSlug, ...IssueSlug[]];

export function isIssueSlug(value: string): value is IssueSlug {
  return (ISSUE_SLUGS as string[]).includes(value);
}
