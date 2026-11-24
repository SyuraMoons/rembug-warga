import Link from "next/link";
import { ISSUES } from "@/content/issues";
import { IssueIcon, cn } from "./ui";

export const SORTS = [
  { value: "terbaru", label: "Terbaru" },
  { value: "populer", label: "Dukungan terbanyak" },
  { value: "diskusi", label: "Paling ramai dibahas" },
] as const;

export type SortValue = (typeof SORTS)[number]["value"];

function chip(active: boolean) {
  return cn(
    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-bold transition",
    active ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-700",
  );
}

/** Filter isu + urutan berbasis URL (?isu=…&urut=…), bekerja tanpa JavaScript. */
export function FilterBar({ basePath, issue, sort }: { basePath: string; issue?: string; sort: SortValue }) {
  const href = (i?: string, s?: string) => {
    const q = new URLSearchParams();
    if (i) q.set("isu", i);
    if (s && s !== "terbaru") q.set("urut", s);
    const qs = q.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <nav aria-label="Filter isu" className="flex flex-wrap gap-2">
        <Link href={href(undefined, sort)} className={chip(!issue)} aria-current={!issue ? "true" : undefined}>
          Semua isu
        </Link>
        {ISSUES.map((i) => (
          <Link key={i.slug} href={href(i.slug, sort)} className={chip(issue === i.slug)} aria-current={issue === i.slug ? "true" : undefined}>
            <IssueIcon slug={i.slug} /> {i.shortTitle}
          </Link>
        ))}
      </nav>
      <nav aria-label="Urutkan" className="flex flex-wrap gap-2">
        {SORTS.map((s) => (
          <Link key={s.value} href={href(issue, s.value)} className={chip(sort === s.value)} aria-current={sort === s.value ? "true" : undefined}>
            {s.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function parseSort(value: unknown): SortValue {
  return SORTS.some((s) => s.value === value) ? (value as SortValue) : "terbaru";
}
