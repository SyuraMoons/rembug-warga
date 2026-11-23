// Identitas platform & data referensi. Ubah slogan/kontak tim di sini.

export const SITE = {
  name: "Rembug Warga",
  slogan: "Rembugan Bareng, Kota Makin Apik",
  description:
    "Platform partisipasi warga untuk tata kelola kota yang lebih baik: usulkan, diskusikan, putuskan, dan pantau bersama.",
  city: "Kota Surabaya",
  course: "Mata Kuliah Demokrasi Digital, FISIP Universitas Airlangga",
  disclaimer:
    "Simulasi akademik. Bukan kanal resmi Pemerintah Kota Surabaya. Semua data adalah data simulasi untuk keperluan pembelajaran.",
  // TODO: isi dengan kontak kelompok. Dibiarkan kosong = tidak ditampilkan.
  contactEmail: "",
  instagram: "",
  /** Nama anggota & peran (tampil di halaman Kontak & Panduan). */
  team: [
    { name: "Anggota 1", role: "Project Coordinator / Governance" },
    { name: "Anggota 2", role: "Policy & Issue Researcher" },
    { name: "Anggota 3", role: "Participation & Deliberation Designer" },
    { name: "Anggota 4", role: "Website / Platform Developer" },
    { name: "Anggota 5", role: "UX & Creative Designer" },
  ],
};

/** Jumlah dukungan yang membuat usulan otomatis berstatus "Dipertimbangkan". */
export const SUPPORT_THRESHOLD = 15;

export const CITIZEN_GROUPS = [
  { value: "pelajar", label: "Pelajar / Mahasiswa" },
  { value: "pekerja", label: "Pekerja / Wirausaha" },
  { value: "rumah_tangga", label: "Ibu / Bapak Rumah Tangga" },
  { value: "lansia", label: "Lansia (60+)" },
  { value: "disabilitas", label: "Penyandang Disabilitas" },
  { value: "lainnya", label: "Lainnya" },
] as const;

export type CitizenGroup = (typeof CITIZEN_GROUPS)[number]["value"];

export const GROUP_LABEL = Object.fromEntries(CITIZEN_GROUPS.map((g) => [g.value, g.label])) as Record<
  string,
  string
>;

export const KECAMATAN_SURABAYA = [
  "Asemrowo", "Benowo", "Bubutan", "Bulak", "Dukuh Pakis", "Gayungan", "Genteng", "Gubeng",
  "Gunung Anyar", "Jambangan", "Karang Pilang", "Kenjeran", "Krembangan", "Lakarsantri", "Mulyorejo",
  "Pabean Cantian", "Pakal", "Rungkut", "Sambikerep", "Sawahan", "Semampir", "Simokerto", "Sukolilo",
  "Sukomanunggal", "Tambaksari", "Tandes", "Tegalsari", "Tenggilis Mejoyo", "Wiyung", "Wonocolo", "Wonokromo",
];

export const PROPOSAL_STATUS = {
  diajukan: { label: "Diajukan", className: "bg-slate-100 text-slate-700 border-slate-300" },
  dipertimbangkan: { label: "Dipertimbangkan", className: "bg-brand-50 text-brand-800 border-brand-300" },
  ditindaklanjuti: { label: "Ditindaklanjuti", className: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  ditolak: { label: "Tidak Dilanjutkan", className: "bg-rose-100 text-rose-800 border-rose-300" },
} as const;

export type ProposalStatus = keyof typeof PROPOSAL_STATUS;
