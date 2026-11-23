import type { Metadata } from "next";
import { Accessibility, Database, Gavel, Mail, ShieldAlert, ShieldCheck, Users } from "lucide-react";
import { SITE, SUPPORT_THRESHOLD } from "@/content/site";
import { CONSENSUS_MIN_VOTES } from "@/lib/data";
import { Card, Container, Hl, LabelBar, NumberCircle, PageHeader, Section, cn } from "@/components/ui";

export const metadata: Metadata = { title: "Kontak & Panduan" };

const STEPS = [
  { title: "Isi profil singkat", text: "Nama panggilan (opsional), kategori warga, dan setujui aturan. Tanpa login, tanpa NIK atau nomor HP." },
  { title: "Pelajari isu", text: "Baca masalah, kelompok terdampak, dan alternatif solusi di halaman Isu Publik." },
  { title: "Usulkan & rembugkan", text: "Ajukan usulan, atau beri argumen pro/kontra pada usulan warga lain." },
  { title: "Beri suara", text: "Dukung atau tolak usulan, alokasikan anggaran simulasi, dan tanggapi pernyataan konsensus." },
  { title: "Pantau hasil", text: "Lihat hasil real-time dan tanggapan resmi di halaman Hasil & Transparansi." },
];

const RIGHTS = [
  "Menyampaikan usulan dan pendapat secara bebas dan setara, tanpa memandang latar belakang.",
  "Berpartisipasi secara anonim (nama panggilan bersifat opsional).",
  "Mengubah atau menarik suaramu kapan saja selama periode simulasi.",
  "Mendapat penjelasan atas setiap usulan yang mencapai ambang dukungan.",
  "Melihat seluruh hasil partisipasi dan log moderasi secara terbuka.",
  "Melaporkan konten yang melanggar aturan.",
];

const RULES = [
  "Gunakan bahasa yang santun. Kata kasar, SARA, ujaran kebencian, dan serangan pribadi dilarang.",
  "Jangan mencantumkan data pribadi milikmu atau orang lain (NIK, nomor HP, alamat rumah).",
  "Satu orang memakai satu perangkat. Dilarang memakai bot, skrip, atau banyak perangkat untuk menggandakan suara.",
  "Sampaikan informasi yang benar. Hoaks dan disinformasi akan disembunyikan.",
  "Tetap pada topik: usulan dan argumen harus berkaitan dengan isu yang dibahas.",
];

const GOVERNANCE = [
  {
    icon: ShieldAlert,
    title: "Moderasi diskusi",
    points: [
      "Penyaring otomatis menolak kata kasar (bahasa Indonesia & Jawa Suroboyoan) sebelum konten terbit.",
      "Warga bisa menekan tombol \"Laporkan\". Moderator meninjau setiap laporan.",
      "Konten yang melanggar disembunyikan, tidak dihapus. Jumlah dan alasannya dicatat publik di log moderasi.",
      "Moderator tidak menyembunyikan konten hanya karena berbeda pendapat.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Pencegahan manipulasi voting",
    points: [
      "Satu perangkat satu suara, dijamin oleh batasan unik di basis data (bukan sekadar tampilan).",
      "Pembatasan laju (rate limit) per perangkat mencegah spam usulan, argumen, dan laporan.",
      "Hasil Rembug Konsensus baru tampil setelah kamu memilih, untuk mengurangi efek ikut-ikutan.",
      "Tim tidak memasukkan suara palsu. Data contoh hanya berupa usulan dan argumen yang ditandai \"Contoh dari tim\".",
      "Keterbatasan: menghapus data browser atau berganti perangkat masih bisa menggandakan suara. Implementasi nyata membutuhkan verifikasi OTP/NIK.",
    ],
  },
  {
    icon: Database,
    title: "Perlindungan data",
    points: [
      "Tidak ada login, email, NIK, atau nomor HP yang dikumpulkan.",
      "Identitas perangkat berupa kode acak di cookie dan tidak bisa dipakai untuk melacak orang.",
      "Kategori warga hanya dipakai untuk analisis keterwakilan secara agregat.",
      "Data hanya dipakai untuk simulasi akademik dan dihapus setelah penilaian project selesai.",
    ],
  },
  {
    icon: Accessibility,
    title: "Aksesibilitas",
    points: [
      "Tombol A− / A+ untuk memperbesar teks dan mode kontras tinggi di bagian atas setiap halaman.",
      "Tampilan ramah HP, bisa dinavigasi dengan keyboard, dan ramah pembaca layar.",
      "Bahasa Indonesia sederhana, tanpa istilah teknis.",
      "Pendampingan langsung di booth bagi warga yang belum terbiasa memakai teknologi digital.",
    ],
  },
];

/** Risiko & mitigasi (setara tabel "Risks and Mitigations" pada referensi). */
const RISKS: { risk: string; detail: string; mitigation: string; direct: boolean }[] = [
  { risk: "Ujaran kasar", detail: "& serangan pribadi", mitigation: "Penyaring kata kasar otomatis + tombol Laporkan", direct: true },
  { risk: "Manipulasi suara", detail: "lewat bot / banyak akun", mitigation: "Satu perangkat satu suara di basis data + rate limit", direct: true },
  { risk: "Efek ikut-ikutan", detail: "pada voting konsensus", mitigation: "Hasil baru tampil setelah kamu memilih", direct: true },
  { risk: "Moderasi sewenang-wenang", detail: "", mitigation: "Konten disembunyikan, bukan dihapus; alasan dicatat publik", direct: true },
  { risk: "Kebocoran data pribadi", detail: "", mitigation: "Tanpa login, NIK, atau nomor HP; ID perangkat acak", direct: true },
  { risk: "Warga tanpa gawai", detail: "tertinggal", mitigation: "Teks besar, kontras tinggi, dan pendampingan di booth", direct: false },
];

const DECISION_RULES = [
  `Usulan yang mencapai ${SUPPORT_THRESHOLD} dukungan otomatis berstatus "Dipertimbangkan".`,
  `Setiap usulan berstatus "Dipertimbangkan" wajib mendapat tanggapan resmi: "Ditindaklanjuti" beserta rencana aksinya, atau "Tidak Dilanjutkan" beserta alasannya.`,
  "Anggaran partisipatif: program diurutkan berdasarkan jumlah suara, lalu didanai berurutan sampai pagu Rp 10 miliar habis. Program yang tidak muat dilewati.",
  `Rembug Konsensus: pernyataan dengan ≥70% suara searah tanpa kelompok yang berlawanan menjadi "titik temu" dan direkomendasikan sebagai dasar kebijakan. Pernyataan yang terbelah menjadi agenda rembug lanjutan. Minimal ${CONSENSUS_MIN_VOTES} suara.`,
];

export default function PanduanPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kontak & panduan"
        title="Aturan yang jelas membuat rembug tetap adil, aman, dan"
        accent="bermakna"
        description="Semua yang perlu kamu ketahui sebelum ikut rembug: cara berpartisipasi, hak, aturan, dan bagaimana platform ini dijaga."
      />
      <Container>
        <Section title="Lima langkah untuk ikut rembug">
          <ol className="grid gap-6 md:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative">
                {i < STEPS.length - 1 && <span className="absolute left-12 right-0 top-[1.35rem] hidden h-0.5 bg-brand-200 md:block" aria-hidden />}
                <NumberCircle n={i + 1} className="relative" />
                <h3 className="mt-3 font-bold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </Section>

        <div className="grid gap-6 md:grid-cols-2">
          <Section title="Hak pengguna">
            <Card className="border-t-4 border-t-brand-600">
              <ul className="list-disc space-y-1.5 pl-5 text-slate-700">
                {RIGHTS.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </Card>
          </Section>
          <Section id="aturan" title="Aturan partisipasi" className="scroll-mt-28">
            <Card className="border-t-4 border-t-brand-600">
              <ol className="list-decimal space-y-1.5 pl-5 text-slate-700">
                {RULES.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ol>
              <p className="mt-3 text-sm text-slate-500">Konten yang melanggar akan disembunyikan oleh moderator, dan tindakannya dicatat di log moderasi publik.</p>
            </Card>
          </Section>
        </div>

        <Section id="keputusan" title="Setiap masukan punya jalur yang jelas menuju keputusan">
          <ul className="space-y-3">
            {DECISION_RULES.map((r, i) => (
              <li key={r} className="flex items-center gap-4 rounded-md bg-brand-50 p-4 text-slate-700">
                <Gavel className="h-5 w-5 shrink-0 text-brand-700" aria-hidden />
                <span>
                  <span className="mr-2 font-black text-brand-700">{String(i + 1).padStart(2, "0")}</span>
                  {r}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="tata-kelola"
          title="Setiap risiko tata kelola punya mitigasi yang konkret"
          description="Risiko utama partisipasi digital dan cara platform ini menanganinya."
        >
          <div className="mx-auto max-w-3xl">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-x-3 pb-2 text-center font-black text-slate-900">
              <span>Risiko</span>
              <span className="w-6" />
              <span>Mitigasi</span>
            </div>
            <ul className="space-y-2.5">
              {RISKS.map((r) => (
                <li key={r.risk} className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-x-3">
                  <span className="rounded-md bg-slate-100 px-4 py-3 text-sm text-slate-700 shadow-sm">
                    <strong className="text-slate-900">{r.risk}</strong> {r.detail}
                  </span>
                  <span className="flex items-center">
                    <span
                      className={cn("h-6 w-6 rounded-full border-2 border-slate-400", r.direct ? "bg-white" : "bg-brand-600")}
                      aria-label={r.direct ? "Dimitigasi langsung" : "Dimitigasi tidak langsung"}
                      role="img"
                    />
                  </span>
                  <span className="rounded-md bg-brand-50 px-4 py-3 text-sm text-slate-800 shadow-sm">{r.mitigation}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-slate-400 bg-white" aria-hidden /> Dimitigasi langsung oleh sistem
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-slate-400 bg-brand-600" aria-hidden /> Dimitigasi tidak langsung (butuh dukungan luring)
              </span>
            </p>
          </div>

          <h3 className="mt-12 text-lg font-black text-slate-900">Detail tata kelola & perlindungan pengguna</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {GOVERNANCE.map(({ icon: Icon, title, points }) => (
              <div key={title}>
                <LabelBar align="left" className="flex items-center gap-2">
                  <Icon className="h-5 w-5" aria-hidden /> {title}
                </LabelBar>
                <ul className="mt-2 list-disc space-y-1 rounded-md border border-slate-200 p-4 pl-9 text-sm text-slate-600">
                  {points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="kontak"
          title="Kontak & tim"
          takeaway={
            <>
              Ikut rembug itu mudah: <Hl>isi profil, pelajari isu, usulkan, beri suara, lalu pantau hasilnya</Hl>. Aturan yang jelas,
              moderasi yang terbuka, dan perlindungan data membuat setiap warga bisa bersuara dengan <Hl>aman dan setara</Hl>.
            </>
          }
        >
          <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
            <Card>
              <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <Users className="h-5 w-5 text-brand-700" aria-hidden /> Tim pengembang
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {SITE.team.map((m) => (
                  <li key={m.role} className="flex justify-between gap-3">
                    <span className="font-semibold text-slate-800">{m.name}</span>
                    <span className="text-right text-slate-500">{m.role}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <Mail className="h-5 w-5 text-brand-700" aria-hidden /> Hubungi kami
              </h3>
              <div className="mt-3 space-y-1.5 text-sm text-slate-700">
                {SITE.contactEmail && (
                  <p>
                    Email:{" "}
                    <a href={`mailto:${SITE.contactEmail}`} className="font-bold text-brand-800 underline">
                      {SITE.contactEmail}
                    </a>
                  </p>
                )}
                {SITE.instagram && <p>Instagram: <strong>{SITE.instagram}</strong></p>}
                <p>
                  Temui kami di booth pameran: <strong>Jumat, 27 November 2026</strong>, Taman FISIP Universitas Airlangga.
                </p>
                <p className="pt-2 text-xs text-slate-500">{SITE.course}. {SITE.disclaimer}</p>
                <p className="text-xs text-slate-500">
                  Alat bantu AI dipakai dalam pengembangan website ini; seluruh isi ditinjau dan menjadi tanggung jawab tim.
                </p>
              </div>
            </Card>
          </div>
        </Section>
      </Container>
    </>
  );
}
