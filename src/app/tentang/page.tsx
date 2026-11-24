import type { Metadata } from "next";
import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  ChevronDown,
  Coins,
  Eye,
  EyeOff,
  Handshake,
  HelpCircle,
  Landmark,
  MessagesSquare,
  Scale,
  Send,
  ShieldCheck,
  UserX,
  Users,
  Vote,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  ButtonLink,
  Callout,
  Chevron,
  Container,
  Hl,
  IconRow,
  KeyTakeaway,
  LabelBar,
  PageHeader,
  Section,
  SidePanel,
  Subheading,
  TintBox,
  cn,
} from "@/components/ui";
import { MECHANISMS, type MechanismKey } from "@/content/mechanisms";
import { SITE, SUPPORT_THRESHOLD } from "@/content/site";

export const metadata: Metadata = { title: "Tentang Platform" };

/* ---------- Ringkasan eksekutif: Masalah → Peluang → Pertanyaan kunci → Strategi → Dampak ---------- */

const PROBLEMS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: UserX,
    title: "Defisit partisipasi",
    text: "Musrenbang didominasi tokoh dan pengurus. Bagaimana pelajar, lansia, dan penyandang disabilitas bisa ikut bersuara?",
  },
  {
    icon: MessagesSquare,
    title: "Defisit deliberasi",
    text: "Kanal aspirasi bersifat satu arah: warga mengeluh tanpa menimbang argumen. Bagaimana keputusan diambil lewat pertukaran alasan?",
  },
  {
    icon: EyeOff,
    title: "Defisit transparansi",
    text: "Warga tidak tahu apakah aspirasinya dibaca dan ditindaklanjuti. Bagaimana setiap masukan bisa dilacak sampai ada keputusan?",
  },
];

const MECHANISM_ICONS: Record<MechanismKey, LucideIcon> = {
  usulan: Send,
  diskusi: MessagesSquare,
  voting: Vote,
  anggaran: Coins,
  konsensus: Scale,
};

const STRATEGY_IMPACT = [
  {
    strategy: "Usulan + voting dengan ambang dukungan yang jelas.",
    impact: `Usulan dengan ${SUPPORT_THRESHOLD} dukungan wajib ditanggapi, sehingga suara warga berujung pada keputusan.`,
  },
  {
    strategy: "Forum pro–kontra dan Rembug Konsensus ala vTaiwan.",
    impact: "Keputusan berbasis alasan, dengan peta titik temu dan titik beda antarkelompok warga.",
  },
  {
    strategy: "Anggaran partisipatif dan halaman hasil yang terbuka real-time.",
    impact: "Prioritas anggaran ditentukan warga dan setiap suara serta tindakan moderasi bisa diperiksa publik.",
  },
];

/* ---------- Gambaran umum (setara slide "Company Overview") ---------- */

const VALUES = [
  { icon: Handshake, label: "Musyawarah" },
  { icon: Eye, label: "Keterbukaan" },
  { icon: Accessibility, label: "Inklusif" },
];

const FOCUS = [
  { icon: MessagesSquare, title: "Dari keluhan ke usulan", text: "Warga mengusulkan solusi atas masalah kota, bukan hanya mengeluh." },
  { icon: Scale, title: "Deliberasi", text: "Keputusan diambil setelah argumen pro dan kontra ditimbang bersama." },
  { icon: Wallet, title: "Prioritas anggaran", text: "Warga ikut menentukan prioritas lewat simulasi anggaran partisipatif." },
  { icon: ShieldCheck, title: "Transparansi", text: "Setiap masukan tercatat, terlihat, dan mendapat tanggapan." },
];

const USERS = [
  { title: "Pelajar & mahasiswa", text: "Pengguna utama angkutan umum dan ruang belajar publik." },
  { title: "Warga kampung & RT/RW", text: "Paling dekat dengan persoalan sampah sehari-hari." },
  { title: "Kelompok rentan", text: "Lansia dan penyandang disabilitas yang sering luput dari perencanaan." },
  { title: "Pengambil kebijakan (simulasi)", text: "Membaca hasil rembug dan memberi tanggapan resmi." },
];

/* ---------- SWOT ---------- */

const STRENGTHS = [
  "Tanpa login: ikut berpartisipasi dalam hitungan detik",
  "Alur terpandu 1 menit dan bahasa sederhana bagi warga yang belum terbiasa teknologi",
  "Lima mekanisme partisipasi yang saling terhubung",
  "Hasil & log moderasi terbuka real-time",
  "Aturan keputusan yang jelas (ambang dukungan & tanggapan wajib)",
];

const WEAKNESSES = [
  "Verifikasi identitas lemah: satu perangkat satu suara masih bisa diakali",
  "Tanggapan resmi masih disimulasikan oleh tim",
  "Pemetaan konsensus disederhanakan per kategori warga",
];

const OPPORTUNITIES = [
  "Tradisi rembug dan musrenbang yang sudah dikenal warga",
  "Warga muda terbiasa berinteraksi lewat HP",
  "Praktik dunia (Decidim, Decide Madrid, vTaiwan) bisa diadaptasi",
];

const THREATS = [
  "Partisipasi menjadi simbolis jika tak ada komitmen tindak lanjut",
  "Kesenjangan digital: warga tanpa gawai/internet tertinggal",
  "Hoaks, ujaran kebencian, dan manipulasi suara",
];

const CROSS = [
  { title: "S–O", text: "Bawa tradisi rembug ke HP: proses cepat tanpa login menarik warga muda untuk ikut musyawarah." },
  { title: "S–T", text: "Log moderasi terbuka dan ambang tanggapan wajib menjaga kepercayaan dan mencegah partisipasi simbolis." },
  { title: "W–O", text: "Adopsi praktik Decidim/vTaiwan secara bertahap: verifikasi OTP/NIK dan pengelompokan opini otomatis." },
  { title: "W–T", text: "Lengkapi dengan kanal luring (balai RW, pendamping booth) agar kelompok tanpa gawai tetap terwakili." },
];

/* ---------- Landasan konsep (setara tabel 7Ps: label kiri, isi kanan) ---------- */

const CONCEPTS = [
  { term: "Demokrasi digital", text: "Teknologi digital dipakai untuk memperluas dan memperdalam keterlibatan warga dalam urusan publik." },
  { term: "E-participation", text: "Partisipasi warga lewat kanal daring: mengusulkan, berdiskusi, dan memberi suara." },
  { term: "Demokrasi deliberatif", text: "Kualitas keputusan bergantung pada pertukaran alasan yang setara, bukan hanya jumlah suara. Diwujudkan lewat forum pro–kontra dan Rembug Konsensus." },
  { term: "Demokrasi partisipatoris", text: "Warga terlibat langsung dalam keputusan, misalnya lewat anggaran partisipatif dan usulan warga." },
  { term: "Kesenjangan digital", text: "Tidak semua warga punya gawai, kuota, atau literasi digital. Karena itu halaman warga memakai bahasa sederhana dan ikon besar, alur terpandu 3 langkah (Coba Sekarang), umpan balik visual alih-alih penjelasan panjang, teks besar & kontras tinggi, tampilan ramah HP, serta pendampingan di booth. Penjelasan akademik dipisahkan ke halaman ini agar tidak membebani warga." },
];

const INSPIRATIONS = [
  { name: "Decidim Barcelona", lesson: "Proses partisipasi bertahap dan tindak lanjut usulan yang terbuka." },
  { name: "Decide Madrid", lesson: "Usulan warga dengan ambang dukungan dan anggaran partisipatif." },
  { name: "vTaiwan / Pol.is", lesson: "Memetakan titik temu dan titik beda, bukan sekadar menghitung mayoritas." },
];

export default function TentangPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tentang platform"
        title="Rembug Warga membawa tradisi musyawarah kampung ke"
        accent="ruang digital"
        description={
          <>
            <em>Rembug</em> berarti bermusyawarah, sebuah tradisi warga Jawa untuk duduk bersama dan memutuskan urusan kampung.
            Platform ini membawanya ke ruang digital agar lebih banyak warga {SITE.city} bisa ikut menentukan arah kotanya.
          </>
        }
      >
        <p className="text-base text-slate-600">
          Halaman ini berisi kerangka lengkap untuk juri & dosen.{" "}
          <Link href="/coba" className="font-bold text-brand-700 hover:underline">
            Mau langsung ikut? Coba Sekarang →
          </Link>
        </p>
      </PageHeader>
      <Container>
        {/* Ringkasan eksekutif (dipindah dari beranda agar beranda fokus pada aksi warga) */}
        <Section
          id="ringkasan"
          title="Ringkasan eksekutif"
          takeaway={
            <>
              Rembug Warga menjawab <Hl>tiga defisit demokrasi kota</Hl>: partisipasi, deliberasi, dan transparansi. Caranya
              dengan <Hl>lima mekanisme</Hl> yang saling terhubung, dari usulan hingga <Hl>tanggapan resmi yang wajib</Hl>,
              sehingga suara warga tidak berhenti sebagai keluhan.
            </>
          }
        >
          <div className="grid gap-10 lg:grid-cols-[1.15fr_auto_1fr]">
            <div>
              <Subheading>Masalah</Subheading>
              <ul className="mt-5 space-y-5">
                {PROBLEMS.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <p className="text-slate-700">
                      <strong className="text-slate-900">{title}.</strong> {text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden items-center lg:flex">
              <div className="h-full w-px bg-brand-200" />
              <Chevron className="-ml-3 bg-white" />
            </div>

            <div>
              <Subheading>Peluang: lima mekanisme partisipasi</Subheading>
              <ul className="mt-5 grid grid-cols-2 gap-3">
                {MECHANISMS.map((m, i) => {
                  const Icon = MECHANISM_ICONS[m.key];
                  return (
                    <li key={m.key} className={cn(i === 0 && "col-span-2")}>
                      <a
                        href={`#mekanisme-${m.key}`}
                        className={cn(
                          "flex h-full items-center justify-between gap-3 rounded-md p-4 font-bold transition",
                          i === 0
                            ? "bg-brand-600 text-white hover:bg-brand-700"
                            : i % 2 === 1
                              ? "bg-slate-100 text-slate-900 hover:bg-brand-50"
                              : "border border-slate-900 bg-white text-slate-900 hover:border-brand-600",
                        )}
                      >
                        {m.formalName}
                        <Icon className={cn("h-6 w-6 shrink-0", i === 0 ? "text-brand-100" : "text-brand-600")} aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <Callout icon={HelpCircle} className="mt-10 items-center">
            <p className="text-lg font-bold text-slate-900">
              Bagaimana warga {SITE.city} bisa ikut menentukan solusi kota secara bermakna, bukan sekadar simbolis?
            </p>
          </Callout>

          {/* Strategi → Dampak */}
          <div className="mt-8 grid gap-x-4 gap-y-3 md:grid-cols-[8rem_repeat(3,1fr)]">
            <span className="hidden items-center md:flex">
              <span className="w-full rounded-full bg-brand-600 py-2 text-center font-bold text-white">Strategi</span>
            </span>
            {STRATEGY_IMPACT.map((s) => (
              <TintBox key={s.strategy} className="text-sm font-semibold text-slate-800">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-700 md:hidden">Strategi</span>
                {s.strategy}
              </TintBox>
            ))}
            <span className="hidden md:block" />
            {STRATEGY_IMPACT.map((s) => (
              <span key={`c-${s.strategy}`} className="hidden justify-center md:flex">
                <ChevronDown className="h-5 w-5 text-brand-500" aria-hidden />
              </span>
            ))}
            <span className="hidden items-center md:flex">
              <span className="w-full rounded-full bg-brand-600 py-2 text-center font-bold text-white">Dampak</span>
            </span>
            {STRATEGY_IMPACT.map((s) => (
              <TintBox key={`i-${s.strategy}`} className="text-sm">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-700 md:hidden">Dampak</span>
                {s.impact}
              </TintBox>
            ))}
          </div>
        </Section>

        {/* Gambaran umum */}
        <Section title="Gambaran umum platform">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr_0.9fr]">
            <div className="space-y-6">
              <div>
                <LabelBar>Apa yang dilakukan Rembug Warga?</LabelBar>
                <Callout className="mt-3">
                  <p className="text-sm">
                    <strong className="text-slate-900">Ruang musyawarah digital</strong> tempat warga mengusulkan, merembugkan,
                    memutuskan, dan memantau solusi untuk <Hl>tiga isu kota</Hl>: sampah, transportasi umum, dan perpustakaan publik.
                  </p>
                </Callout>
              </div>
              <div>
                <LabelBar>Nilai inti</LabelBar>
                <ul className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {VALUES.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex flex-col items-center gap-2">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-200">
                        <Icon className="h-7 w-7" aria-hidden />
                      </span>
                      <span className="text-sm font-bold text-slate-900">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <LabelBar>Apa fokus utamanya?</LabelBar>
              <div className="mt-4 space-y-5">
                {FOCUS.map((f) => (
                  <IconRow key={f.title} icon={f.icon} title={f.title}>
                    {f.text}
                  </IconRow>
                ))}
              </div>
            </div>

            <SidePanel title="Sasaran pengguna">
              <ul className="space-y-4">
                {USERS.map((u) => (
                  <li key={u.title} className="flex gap-3">
                    <Users className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden />
                    <span>
                      <span className="block font-bold text-slate-900">{u.title}</span>
                      <span className="text-sm text-slate-600">{u.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </SidePanel>
          </div>
        </Section>

        {/* Latar belakang */}
        <Section title="Kanal aspirasi yang ada masih satu arah, sehingga muncul tiga defisit demokrasi">
          <div className="grid gap-6 leading-relaxed text-slate-700 md:grid-cols-2">
            <p>
              Kanal aspirasi yang ada umumnya bersifat <strong>satu arah</strong>: warga mengirim keluhan, tetapi tidak tahu apakah
              aspirasinya dibaca, dibahas, atau ditindaklanjuti. Musrenbang (musyawarah perencanaan pembangunan) masih didominasi
              tokoh dan pengurus, sementara pelajar, lansia, dan penyandang disabilitas jarang terlibat.
            </p>
            <p>
              Akibatnya muncul <Hl>defisit partisipasi</Hl> (sedikit warga yang terlibat), <Hl>defisit deliberasi</Hl> (keputusan
              tanpa pertukaran argumen), dan <Hl>defisit transparansi</Hl> (tindak lanjut tidak jelas). Rembug Warga dirancang
              untuk menjawab ketiganya.
            </p>
          </div>
        </Section>

        {/* Lima mekanisme: Tujuan / Cara kerja / Dampak (teks yang sama dengan toggle "Kenapa ini penting?") */}
        <Section
          id="mekanisme"
          title="Lima mekanisme partisipasi, masing-masing dengan tujuan dan dampak yang jelas"
          description="Di halaman warga, penjelasan ini dilipat di balik tombol “Kenapa ini penting?” agar warga langsung bisa beraksi."
        >
          <div className="hidden grid-cols-[15rem_1fr_1fr_1fr] gap-3 pb-2 text-sm font-bold text-slate-500 lg:grid">
            <span>Mekanisme</span>
            <span>Tujuan</span>
            <span>Cara kerja</span>
            <span>Dampak</span>
          </div>
          <ul className="space-y-3">
            {MECHANISMS.map((m) => {
              const Icon = MECHANISM_ICONS[m.key];
              return (
                <li key={m.key} id={`mekanisme-${m.key}`} className="grid scroll-mt-28 gap-3 lg:grid-cols-[15rem_1fr_1fr_1fr]">
                  <Link href={m.href} className="group flex items-center gap-3 rounded-md bg-brand-600 p-3 text-white transition hover:bg-brand-700">
                    <Icon className="h-6 w-6 shrink-0 text-brand-100" aria-hidden />
                    <span className="min-w-0">
                      <span className="block font-bold leading-snug">{m.formalName}</span>
                      <span className="block text-sm text-brand-100">
                        “{m.title}” <ArrowRight className="inline h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                      </span>
                    </span>
                  </Link>
                  {[
                    { label: "Tujuan", body: m.objective },
                    { label: "Cara kerja", body: m.how },
                    { label: "Dampak", body: m.impact },
                  ].map((c) => (
                    <TintBox key={c.label} className="text-sm">
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-700 lg:hidden">{c.label}</span>
                      {c.body}
                    </TintBox>
                  ))}
                </li>
              );
            })}
          </ul>
          <div className="mt-6">
            <ButtonLink href="/panduan#keputusan" variant="outline">
              Lihat aturan keputusan & tata kelola
            </ButtonLink>
          </div>
        </Section>

        {/* SWOT */}
        <Section
          id="refleksi"
          title="Refleksi kritis: partisipasi bermakna atau sekadar simbolis?"
          description="Kami menilai platform ini dengan analisis SWOT, lalu menurunkannya menjadi strategi perbaikan."
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_0.95fr]">
            {/* Baris 1 */}
            <div className="flex flex-col justify-center rounded-md bg-brand-600 p-5 text-white">
              <span className="w-fit rounded-sm bg-white px-3 py-1 text-sm font-black text-brand-700">Analisis SWOT</span>
              <span className="mt-3 flex items-center gap-2 text-xl font-black">
                <Landmark className="h-7 w-7" aria-hidden /> Rembug Warga
              </span>
            </div>
            <SwotBox title="Peluang (O)" items={OPPORTUNITIES} />
            <SwotBox title="Ancaman (T)" items={THREATS} />
            <aside className="row-span-3 hidden overflow-hidden rounded-md bg-slate-100 lg:block">
              <LabelBar as="h3" align="left" className="rounded-none px-4 py-3">Ringkasan SWOT</LabelBar>
              <p className="p-5 leading-relaxed text-slate-800">
                Rembug Warga punya <Hl>proses yang cepat</Hl> dan <Hl>hasil yang terbuka</Hl>, tetapi masih lemah dalam{" "}
                <Hl>verifikasi identitas</Hl> dan <Hl>tindak lanjut nyata</Hl>. Agar tidak menjadi partisipasi simbolis, platform
                perlu <Hl>komitmen tanggapan</Hl> dari pengambil kebijakan dan <Hl>kanal luring</Hl> bagi warga tanpa gawai.
              </p>
            </aside>

            {/* Baris 2 */}
            <SwotBox title="Kekuatan (S)" items={STRENGTHS} />
            <CrossBox {...CROSS[0]} />
            <CrossBox {...CROSS[1]} />

            {/* Baris 3 */}
            <SwotBox title="Kelemahan (W)" items={WEAKNESSES} />
            <CrossBox {...CROSS[2]} />
            <CrossBox {...CROSS[3]} />
          </div>

          <KeyTakeaway className="mt-8 lg:hidden">
            Rembug Warga punya <Hl>proses yang cepat</Hl> dan <Hl>hasil yang terbuka</Hl>, tetapi masih lemah dalam verifikasi
            identitas dan tindak lanjut nyata. Platform perlu <Hl>komitmen tanggapan</Hl> dan <Hl>kanal luring</Hl>.
          </KeyTakeaway>
        </Section>

        {/* Landasan konsep */}
        <Section title="Landasan konsep yang dipakai dalam rancangan platform">
          <ul className="space-y-3">
            {CONCEPTS.map((c) => (
              <li key={c.term} className="grid gap-3 md:grid-cols-[15rem_1fr]">
                <span className="flex items-center rounded-md bg-brand-600 px-4 py-3 font-bold text-white">{c.term}</span>
                <span className="flex items-center rounded-md bg-brand-50 px-4 py-3 text-sm text-slate-700">{c.text}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Terinspirasi dari praktik dunia"
          description="Kami mengadaptasi praktik terbaik platform demokrasi digital ke konteks kampung kota."
          takeaway={
            <>
              Rembug Warga adalah <Hl>simulasi platform partisipasi warga</Hl> yang menggabungkan tradisi musyawarah dengan praktik
              demokrasi digital dunia. Tantangan utamanya adalah memastikan suara warga <Hl>benar-benar memengaruhi keputusan</Hl>,
              lewat aturan tanggapan yang wajib, hasil yang terbuka, dan jangkauan yang inklusif.
            </>
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            {INSPIRATIONS.map((i) => (
              <div key={i.name}>
                <LabelBar>{i.name}</LabelBar>
                <p className="mt-2 rounded-md border border-slate-200 p-4 text-sm text-slate-700">{i.lesson}</p>
              </div>
            ))}
          </div>
        </Section>
      </Container>
    </>
  );
}

function SwotBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border-2 border-brand-500 bg-white p-4">
      <h3 className="text-lg font-black text-brand-700">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function CrossBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-md bg-brand-50 p-4">
      <h3 className="font-black text-slate-900">Strategi {title}</h3>
      <p className="mt-1 text-sm text-slate-700">{text}</p>
    </div>
  );
}
