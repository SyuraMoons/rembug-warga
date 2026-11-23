// =============================================================
// Katalog program Anggaran Partisipatif (simulasi).
// Total pagu Rp 10 miliar, total semua program Rp 19,2 miliar,
// jadi warga harus memilih prioritas — tidak semua bisa didanai.
// =============================================================
import type { IssueSlug } from "./issues";

export const BUDGET_LIMIT = 10_000_000_000;

export type BudgetProject = {
  id: string;
  issue: IssueSlug;
  title: string;
  description: string;
  cost: number;
};

export const BUDGET_PROJECTS: BudgetProject[] = [
  {
    id: "S1",
    issue: "sampah",
    title: "Bank Sampah Digital di 50 RW",
    description: "Timbangan digital, aplikasi pencatatan, dan pelatihan pengelola bank sampah di 50 RW prioritas.",
    cost: 1_500_000_000,
  },
  {
    id: "S2",
    issue: "sampah",
    title: "20 TPS 3R & Rumah Kompos Baru",
    description: "Tempat olah sampah Reduce–Reuse–Recycle dan pengomposan di kecamatan yang belum terlayani.",
    cost: 3_000_000_000,
  },
  {
    id: "S3",
    issue: "sampah",
    title: "Armada Angkut Terjadwal + Kanal Lapor Sampah Liar",
    description: "Penambahan armada kecil untuk gang sempit, jadwal angkut terbuka, dan kanal lapor berbasis foto & lokasi.",
    cost: 2_000_000_000,
  },
  {
    id: "T1",
    issue: "transportasi",
    title: "Renovasi 40 Halte Ramah Semua",
    description: "Atap, kursi, lampu, ramp kursi roda, guiding block, dan papan info rute.",
    cost: 2_500_000_000,
  },
  {
    id: "T2",
    issue: "transportasi",
    title: "10 Rute Feeder Baru ke Sekolah & Kampus",
    description: "Operasional satu tahun angkutan pengumpan yang menghubungkan permukiman dan kawasan pendidikan.",
    cost: 3_500_000_000,
  },
  {
    id: "T3",
    issue: "transportasi",
    title: "Layar Info Bus Real-time di Halte",
    description: "Layar kedatangan bus di 30 halte utama dan integrasi data ke aplikasi publik.",
    cost: 1_500_000_000,
  },
  {
    id: "P1",
    issue: "perpustakaan",
    title: "Co-learning Space 24 Jam di 5 Kecamatan",
    description: "Ruang belajar ber-Wi-Fi dengan colokan, ruang diskusi, dan petugas jaga malam.",
    cost: 3_000_000_000,
  },
  {
    id: "P2",
    issue: "perpustakaan",
    title: "Perpustakaan Keliling & Pojok Baca RW",
    description: "Dua mobil perpustakaan terjadwal dan rak buku di 100 balai RW serta taman kota.",
    cost: 1_000_000_000,
  },
  {
    id: "P3",
    issue: "perpustakaan",
    title: "E-library Gratis untuk Pelajar",
    description: "Digitalisasi koleksi dan lisensi buku elektronik yang bisa diakses dengan kartu pelajar.",
    cost: 1_200_000_000,
  },
];

export const BUDGET_PROJECT_BY_ID = Object.fromEntries(BUDGET_PROJECTS.map((p) => [p.id, p])) as Record<
  string,
  BudgetProject
>;
