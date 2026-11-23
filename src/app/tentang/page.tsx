import type { Metadata } from "next";
import { Accessibility, Eye, Handshake, Landmark, MessagesSquare, Scale, ShieldCheck, Users, Wallet } from "lucide-react";
import { Callout, Container, Hl, IconRow, KeyTakeaway, LabelBar, PageHeader, Section, SidePanel } from "@/components/ui";
import { SITE } from "@/content/site";

export const metadata: Metadata = { title: "Tentang Platform" };

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
  { term: "Kesenjangan digital", text: "Tidak semua warga punya gawai, kuota, atau literasi digital. Karena itu kami memakai bahasa sederhana, teks besar & kontras tinggi, tampilan ramah HP, serta pendampingan di booth." },
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
      />
      <Container>
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
