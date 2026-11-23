// =============================================================
// Lima mekanisme partisipasi: satu sumber teks untuk
// - halaman /tentang (kerangka lengkap untuk juri & dosen), dan
// - toggle "Kenapa ini penting?" di setiap halaman aksi warga.
// Untuk Participation & Deliberation Designer: ubah teks di sini saja.
// =============================================================

import { SUPPORT_THRESHOLD } from "./site";

export type MechanismKey = "usulan" | "diskusi" | "voting" | "anggaran" | "konsensus";

export type Mechanism = {
  key: MechanismKey;
  /** Nama sederhana yang dilihat warga. */
  title: string;
  /** Nama mekanisme sesuai panduan project (untuk juri). */
  formalName: string;
  href: string;
  objective: string;
  how: string;
  impact: string;
};

export const MECHANISMS: Mechanism[] = [
  {
    key: "usulan",
    title: "Usulkan ide",
    formalName: "Public Proposal",
    href: "/usulan/baru",
    objective: "Mengubah keluhan menjadi usulan solusi yang konkret dan bisa diperjuangkan bersama.",
    how: "Warga menulis usulan untuk salah satu isu; warga lain mendukung, menolak, dan memberi pendapat.",
    impact: `Usulan yang mencapai ${SUPPORT_THRESHOLD} dukungan berstatus Dipertimbangkan dan wajib mendapat tanggapan resmi.`,
  },
  {
    key: "diskusi",
    title: "Beri pendapat",
    formalName: "Discussion Forum",
    href: "/diskusi",
    objective: "Menguji setiap usulan lewat alasan dari dua sisi sebelum diputuskan.",
    how: "Setiap usulan punya kolom pendapat setuju dan tidak setuju, plus kolom untuk bertanya.",
    impact: "Keputusan lebih matang dan berbasis alasan, bukan hanya jumlah suara.",
  },
  {
    key: "voting",
    title: "Dukung usulan",
    formalName: "Online Voting",
    href: "/voting",
    objective: "Mengubah dukungan warga menjadi keputusan yang sah.",
    how: `Satu HP satu suara per usulan, dan suara bisa diubah atau ditarik. ${SUPPORT_THRESHOLD} dukungan membuat usulan Dipertimbangkan.`,
    impact: "Prioritas kota mencerminkan pilihan warga, dan setiap hasil bisa diperiksa di halaman Hasil.",
  },
  {
    key: "anggaran",
    title: "Bagi uang kota",
    formalName: "Participatory Budgeting",
    href: "/voting/anggaran",
    objective: "Melibatkan warga langsung dalam menentukan prioritas belanja kota.",
    how: "Total semua program Rp 19,2 miliar, tetapi uangnya hanya Rp 10 miliar. Program dengan suara terbanyak didanai berurutan sampai uang habis. Angka bersifat simulasi.",
    impact: "Warga merasakan pilihan sulit yang nyata: tidak semua program bisa didanai, jadi prioritas harus dipilih.",
  },
  {
    key: "konsensus",
    title: "Setuju atau tidak?",
    formalName: "Consensus Building",
    href: "/diskusi/konsensus",
    objective: "Menemukan pernyataan yang disetujui lintas kelompok warga, bukan hanya oleh mayoritas.",
    how: "Tanggapi pernyataan dengan Setuju, Tidak setuju, atau Ragu. Hasil baru tampil setelah kamu memilih, agar pilihanmu tidak ikut-ikutan. Terinspirasi vTaiwan & Pol.is.",
    impact: "Titik temu menjadi rekomendasi kebijakan; titik beda menjadi agenda rembug berikutnya.",
  },
];

export const MECHANISM_BY_KEY = Object.fromEntries(MECHANISMS.map((m) => [m.key, m])) as Record<MechanismKey, Mechanism>;
