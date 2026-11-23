import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BookOpen, Bus, ChevronDown, ChevronRight, HelpCircle, Recycle, ThumbsUp, type LucideIcon } from "lucide-react";
import { ISSUE_BY_SLUG, type IssueSlug } from "@/content/issues";
import { MECHANISM_BY_KEY, type MechanismKey } from "@/content/mechanisms";
import { PROPOSAL_STATUS, SUPPORT_THRESHOLD, type ProposalStatus } from "@/content/site";

/*
 * Kit UI bergaya deck konsultan (lihat reference/ halaman 16, "style guide"):
 * - Action title: judul berupa kesimpulan, bukan sekadar label.
 * - Subheading bergaris bawah, LabelBar biru solid, Callout bergaris putus,
 *   TintBox biru muda, NumberCircle "01", SidePanel abu-abu, dan KeyTakeaway.
 * Semua halaman memakai komponen ini agar alur & tampilannya konsisten.
 */

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</div>;
}

/** Teks penting yang disorot biru, seperti kata kunci pada panel "Quick Overview". */
export function Hl({ children }: { children: ReactNode }) {
  return <strong className="font-bold text-brand-700">{children}</strong>;
}

/**
 * Header halaman. `title` adalah action title; `accent` (opsional) adalah kata
 * yang diwarnai biru, seperti "Company **Overview**" pada referensi.
 */
export function PageHeader({
  eyebrow,
  title,
  accent,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <Container className="py-10 sm:py-12">
        {eyebrow && (
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
            <span className="h-0.5 w-6 bg-brand-600" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-[2.6rem]">
          {title}
          {accent && <span className="text-brand-600"> {accent}</span>}
        </h1>
        {description && <div className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">{description}</div>}
        {children && <div className="mt-6">{children}</div>}
      </Container>
    </header>
  );
}

/** Subheading bergaris bawah ("Problems", "Opportunities" pada referensi). */
export function Subheading({ children, className, as: Tag = "h3" }: { children: ReactNode; className?: string; as?: "h2" | "h3" | "h4" }) {
  return <Tag className={cn("border-b-2 border-slate-900 pb-2 text-lg font-bold text-slate-900", className)}>{children}</Tag>;
}

/** Bagian halaman: judul action title + deskripsi + isi + Poin Kunci opsional. */
export function Section({
  title,
  description,
  children,
  id,
  className,
  takeaway,
}: {
  title?: string;
  description?: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
  takeaway?: ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-28 py-10", className)}>
      {title && <h2 className="max-w-4xl text-2xl font-black leading-snug tracking-tight text-slate-900 sm:text-[1.75rem]">{title}</h2>}
      {description && <div className="mt-2 max-w-3xl text-slate-600">{description}</div>}
      <div className={title || description ? "mt-6" : ""}>{children}</div>
      {takeaway && <KeyTakeaway className="mt-8">{takeaway}</KeyTakeaway>}
    </section>
  );
}

/** Label-bar biru solid ("unedge rectangle" pada style guide). */
export function LabelBar({ children, className, as: Tag = "h3", align = "center" }: { children: ReactNode; className?: string; as?: "h2" | "h3" | "h4" | "p"; align?: "center" | "left" }) {
  return (
    <Tag className={cn("rounded-sm bg-brand-600 px-3 py-1.5 text-[0.95rem] font-bold text-white", align === "center" ? "text-center" : "text-left", className)}>
      {children}
    </Tag>
  );
}

/** Kotak bergaris putus untuk pertanyaan kunci, ringkasan, atau catatan. */
export function Callout({ children, className, icon: Icon }: { children: ReactNode; className?: string; icon?: LucideIcon }) {
  return (
    <div className={cn("flex items-start gap-3 rounded-xl border-2 border-dashed border-brand-300 bg-white p-4 text-slate-700", className)}>
      {Icon && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      )}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** Kotak biru muda untuk baris isi (setara kotak hijau muda pada referensi). */
export function TintBox({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-lg bg-brand-50 p-4 text-slate-700", className)}>{children}</div>;
}

/** Panel abu-abu di samping ("Quick Overview", "Business Analysis"). */
export function SidePanel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <aside className={cn("overflow-hidden rounded-lg bg-slate-100", className)}>
      {title && <LabelBar as="h3">{title}</LabelBar>}
      <div className="p-5">{children}</div>
    </aside>
  );
}

/** Kotak "Poin Kunci" dengan label berbentuk pil di sudut kiri atas. */
export function KeyTakeaway({ children, label = "Poin Kunci", className }: { children: ReactNode; label?: string; className?: string }) {
  return (
    <div className={cn("relative rounded-lg border-2 border-brand-500 bg-white px-5 pb-4 pt-6", className)}>
      <span className="absolute -top-3.5 left-5 rounded-full bg-brand-600 px-4 py-1 text-sm font-bold text-white">{label}</span>
      <div className="text-slate-700">{children}</div>
    </div>
  );
}

/** Lingkaran nomor "01", "02" … */
export function NumberCircle({ n, className, size = "md" }: { n: number | string; className?: string; size?: "sm" | "md" | "lg" }) {
  const label = typeof n === "number" ? String(n).padStart(2, "0") : n;
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-11 w-11 text-base", lg: "h-14 w-14 text-xl" };
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-full bg-brand-600 font-black tabular-nums text-white", sizes[size], className)} aria-hidden>
      {label}
    </span>
  );
}

/** Baris ikon + judul tebal + isi ("Lato Bold 10 / Lato 10" pada style guide). */
export function IconRow({ icon: Icon, title, children, className }: { icon: LucideIcon; title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="font-bold text-slate-900">{title}</p>
        {children && <div className="mt-0.5 text-sm text-slate-600">{children}</div>}
      </div>
    </div>
  );
}

/** Panah kecil antar kolom (penanda alur ">"). */
export function Chevron({ className }: { className?: string }) {
  return <ChevronRight className={cn("h-6 w-6 shrink-0 text-brand-500", className)} aria-hidden />;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-lg border border-slate-200 bg-white p-5", className)}>{children}</div>;
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50";

export const buttonStyles = {
  primary: cn(buttonBase, "bg-brand-600 text-white hover:bg-brand-700"),
  accent: cn(buttonBase, "bg-brand-600 text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700"),
  outline: cn(buttonBase, "border border-brand-200 bg-white text-brand-700 hover:border-brand-400 hover:bg-brand-50"),
  ghost: cn(buttonBase, "text-brand-700 hover:bg-brand-50"),
};

export function ButtonLink({ href, children, variant = "primary", className }: { href: string; children: ReactNode; variant?: keyof typeof buttonStyles; className?: string }) {
  return (
    <Link href={href} className={cn(buttonStyles[variant], className)}>
      {children}
    </Link>
  );
}

export function StatusBadge({ status }: { status: ProposalStatus }) {
  const s = PROPOSAL_STATUS[status];
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold", s.className)}>{s.label}</span>;
}

/** Ikon isu (menggantikan emoji agar tampil rapi seperti ikon pada deck). */
export const ISSUE_ICONS: Record<IssueSlug, LucideIcon> = {
  sampah: Recycle,
  transportasi: Bus,
  perpustakaan: BookOpen,
};

export function IssueIcon({ slug, className = "h-4 w-4" }: { slug: IssueSlug; className?: string }) {
  const Icon = ISSUE_ICONS[slug];
  return <Icon className={className} aria-hidden />;
}

export function IssueBadge({ slug }: { slug: IssueSlug }) {
  const issue = ISSUE_BY_SLUG[slug];
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-800">
      <IssueIcon slug={slug} className="h-3.5 w-3.5" /> {issue.shortTitle}
    </span>
  );
}

export function SimBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-dashed border-slate-400 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
      Contoh dari tim
    </span>
  );
}

/** Batang horizontal sederhana yang aksesibel (nilai juga ditulis sebagai teks). */
export function Bar({ value, max, className = "bg-brand-600", label }: { value: number; max: number; className?: string; label?: string }) {
  const width = max === 0 ? 0 : Math.max(value > 0 ? 2 : 0, Math.round((value / max) * 100));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-sm bg-slate-100" role="img" aria-label={label ?? `${value} dari ${max}`}>
      <div className={cn("h-full animate-grow-x rounded-sm transition-[width] duration-700", className)} style={{ width: `${width}%` }} />
    </div>
  );
}

/* ---------- Komponen ramah warga (bahasa sederhana, ikon besar, umpan balik visual) ---------- */

/** Tombol aksi besar: ikon + judul ≤4 kata + satu baris penjelasan. */
export function ActionTile({
  href,
  icon: Icon,
  title,
  text,
  primary = false,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  text: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex min-h-24 items-center gap-4 rounded-xl border-2 p-5 transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]",
        primary
          ? "border-brand-600 bg-brand-600 text-white shadow-brand-600/20 hover:bg-brand-700"
          : "border-slate-200 bg-white text-slate-900 shadow-brand-600/10 hover:border-brand-400",
      )}
    >
      <span
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
          primary ? "bg-white/15 text-white" : "bg-brand-50 text-brand-600",
        )}
      >
        <Icon className="h-7 w-7" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-xl font-black leading-tight">{title}</span>
        <span className={cn("mt-1 block text-base", primary ? "text-brand-50" : "text-slate-600")}>{text}</span>
      </span>
      <ArrowRight className="ml-auto h-6 w-6 shrink-0 transition group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}

/**
 * Penjelasan mekanisme yang dilipat: warga langsung melihat tombol aksi, sementara
 * Tujuan / Cara kerja / Dampak tetap tersedia bagi yang ingin tahu (dan bagi juri).
 */
export function Why({ mechanism, className }: { mechanism: MechanismKey; className?: string }) {
  const m = MECHANISM_BY_KEY[mechanism];
  const rows = [
    { label: "Tujuan", body: m.objective },
    { label: "Cara kerja", body: m.how },
    { label: "Dampaknya", body: m.impact },
  ];
  return (
    <details className={cn("group rounded-lg border border-slate-200 bg-white", className)}>
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-4 py-3 font-bold text-brand-800 hover:bg-brand-50 [&::-webkit-details-marker]:hidden">
        <HelpCircle className="h-5 w-5 shrink-0" aria-hidden />
        Kenapa ini penting?
        <ChevronDown className="ml-auto h-5 w-5 shrink-0 transition group-open:rotate-180" aria-hidden />
      </summary>
      <dl className="grid animate-rise gap-4 border-t border-slate-200 px-4 py-4 md:grid-cols-3">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-sm font-black uppercase tracking-wide text-brand-700">{r.label}</dt>
            <dd className="mt-1 text-base leading-relaxed text-slate-700">{r.body}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

/**
 * Meteran menuju ambang dukungan. Menggantikan penjelasan "ambang" dengan gambar:
 * bar terisi sampai 15 dukungan, lalu berubah hijau ketika usulan wajib dijawab.
 */
export function ThresholdMeter({ support, status, className }: { support: number; status: ProposalStatus; className?: string }) {
  const answered = status === "ditindaklanjuti" || status === "ditolak";
  const reached = status !== "diajukan" || support >= SUPPORT_THRESHOLD;
  const shown = Math.min(support, SUPPORT_THRESHOLD);
  const pct = reached ? 100 : Math.round((shown / SUPPORT_THRESHOLD) * 100);
  const left = SUPPORT_THRESHOLD - shown;

  const note = answered
    ? "Sudah dijawab pemerintah ✓"
    : reached
      ? "Wajib dijawab ✓ Sedang ditimbang"
      : `Butuh ${left} dukungan lagi supaya wajib dijawab`;

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className={cn("font-bold", reached ? "text-emerald-700" : "text-slate-700")}>{note}</span>
        {!answered && (
          <span className="inline-flex shrink-0 items-center gap-1 font-black tabular-nums text-slate-900">
            {shown}/{SUPPORT_THRESHOLD} <ThumbsUp className="h-4 w-4 text-brand-600" aria-hidden />
          </span>
        )}
      </div>
      <div
        className="mt-1.5 h-3 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={SUPPORT_THRESHOLD}
        aria-valuenow={shown}
        aria-label={`${shown} dari ${SUPPORT_THRESHOLD} dukungan`}
      >
        <div
          className={cn(
            "h-full animate-grow-x rounded-full transition-[width,background-color] duration-700",
            answered && status === "ditolak" ? "bg-slate-400" : reached ? "bg-emerald-500" : "bg-brand-600",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Penanda langkah untuk alur terpandu: titik-titik + "Langkah 2 dari 4". */
export function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      <ol className="flex items-center gap-1.5" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <li
            key={i}
            className={cn(
              "h-2.5 rounded-full transition-all duration-500",
              i + 1 === current ? "w-8 bg-brand-600" : i + 1 < current ? "w-2.5 bg-brand-600" : "w-2.5 bg-slate-200",
            )}
          />
        ))}
      </ol>
      <span className="text-sm font-bold text-slate-600">
        Langkah {current} dari {total}
      </span>
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 border-t-4 border-t-brand-600 bg-white p-4">
      <div className="text-3xl font-black tabular-nums text-slate-900">{value}</div>
      <div className="mt-1 text-sm font-bold text-slate-700">{label}</div>
      {hint && <div className="mt-0.5 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-500">{children}</div>;
}
