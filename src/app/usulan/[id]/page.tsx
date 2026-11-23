import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Landmark, MapPin, Share2 } from "lucide-react";
import { getComments, getMyVotes, getProposal, type Comment } from "@/lib/data";
import { getDeviceId } from "@/lib/participant";
import { formatDate, pct, timeAgo } from "@/lib/format";
import { getSiteUrl } from "@/lib/site-url";
import { GROUP_LABEL, SUPPORT_THRESHOLD } from "@/content/site";
import { CommentForm, ReportButton, VoteButtons } from "@/components/participation";
import { Container, IssueBadge, SimBadge, StatusBadge, ThresholdMeter, cn } from "@/components/ui";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({ params }: PageProps<"/usulan/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = UUID_RE.test(id) ? await getProposal(id) : null;
  return { title: p?.title ?? "Usulan" };
}

const STEPS = [
  { key: "diajukan", label: "Diajukan" },
  { key: "dipertimbangkan", label: `Dapat ${SUPPORT_THRESHOLD} 👍, ditimbang pemerintah` },
  { key: "final", label: "Dijawab pemerintah" },
];

export default async function ProposalDetailPage({ params, searchParams }: PageProps<"/usulan/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  if (!UUID_RE.test(id)) notFound();
  const [p, comments, deviceId, siteUrl] = await Promise.all([getProposal(id), getComments(id), getDeviceId(), getSiteUrl()]);
  if (!p) notFound();
  const myVotes = await getMyVotes(deviceId);

  const stepIndex = p.status === "diajukan" ? 0 : p.status === "dipertimbangkan" ? 1 : 2;
  const totalVotes = p.support + p.oppose;
  const byStance = (s: Comment["stance"]) => comments.filter((c) => c.stance === s);
  const shareText = `Dukung usulan warga ini di Rembug Warga: "${p.title}" ${siteUrl}/usulan/${p.id}`;

  return (
    <Container className="py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/usulan" className="hover:underline">
          Usulan
        </Link>{" "}
        / <span className="text-slate-700">Detail</span>
      </nav>

      {sp.baru === "1" && (
        <div role="status" className="mt-4 flex animate-rise flex-wrap items-center gap-4 rounded-lg border-l-4 border-brand-600 bg-brand-50 p-4 text-brand-900">
          <CheckCircle2 className="h-10 w-10 shrink-0 animate-check text-brand-600" aria-hidden />
          <p className="min-w-0 flex-1 text-base">
            <strong className="block text-lg">Usulanmu sudah terbit!</strong>
            Ajak teman mendukung. {SUPPORT_THRESHOLD} 👍 = pemerintah wajib menjawab.
          </p>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-base font-bold text-white hover:bg-emerald-700"
          >
            <Share2 className="h-5 w-5" aria-hidden /> Bagikan ke WhatsApp
          </a>
        </div>
      )}

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_320px]">
        <article>
          <div className="flex flex-wrap items-center gap-2">
            <IssueBadge slug={p.issue_slug} />
            <StatusBadge status={p.status} />
            {p.is_seed && <SimBadge />}
          </div>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-900">{p.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span>
              oleh <strong className="text-slate-700">{p.author_name ?? "Anonim"}</strong> · {GROUP_LABEL[p.author_group] ?? p.author_group}
            </span>
            {p.kecamatan && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" aria-hidden /> {p.kecamatan}
              </span>
            )}
            <time dateTime={p.created_at}>{formatDate(p.created_at)}</time>
          </div>
          <p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-slate-800">{p.body}</p>
          <div className="mt-3">
            <ReportButton type="proposal" id={p.id} />
          </div>

          {p.official_response && (
            <div className="relative mt-8 rounded-lg border-2 border-brand-500 bg-white px-5 pb-5 pt-7">
              <h2 className="absolute -top-3.5 left-5 flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-1 text-sm font-bold text-white">
                <Landmark className="h-4 w-4" aria-hidden /> Tanggapan resmi (simulasi)
              </h2>
              <p className="mt-2 whitespace-pre-line text-slate-700">{p.official_response}</p>
              {p.responded_at && <p className="mt-2 text-xs text-slate-500">Ditanggapi {formatDate(p.responded_at)}</p>}
            </div>
          )}

          {/* Forum diskusi */}
          <section id="diskusi" className="mt-10 scroll-mt-28">
            <h2 className="border-b-2 border-slate-900 pb-2 text-2xl font-black text-slate-900">Pendapat warga</h2>
            <p className="mt-1 text-base text-slate-600">
              Baca alasan dari dua sisi. {comments.length} komentar sejauh ini.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <ArgumentColumn title="👍 Setuju" items={byStance("pro")} tone="pro" />
              <ArgumentColumn title="👎 Tidak setuju" items={byStance("kontra")} tone="kontra" />
            </div>
            {byStance("netral").length > 0 && (
              <div className="mt-4">
                <ArgumentColumn title="❓ Pertanyaan & catatan" items={byStance("netral")} tone="netral" />
              </div>
            )}
            <div className="mt-6">
              <CommentForm proposalId={p.id} />
            </div>
          </section>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <h2 className="bg-brand-600 px-5 py-2 font-bold text-white">Berikan suaramu</h2>
            <div className="p-5 pt-4">
            <div className="mt-3">
              <VoteButtons proposalId={p.id} support={p.support} oppose={p.oppose} myVote={myVotes[p.id]} />
            </div>
            <ThresholdMeter support={p.support} status={p.status} className="mt-5" />
            {totalVotes > 0 && (
              <p className="mt-2 text-sm text-slate-600">
                {pct(p.support, totalVotes)}% mendukung dari {totalVotes} suara
              </p>
            )}
            </div>
          </div>

          <div className="rounded-lg bg-slate-100 p-5">
            <h2 className="font-bold text-slate-900">Perjalanan usulan</h2>
            <ol className="mt-3 space-y-3">
              {STEPS.map((s, i) => (
                <li key={s.key} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      i <= stepIndex ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-400",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className={cn("text-sm", i <= stepIndex ? "font-bold text-slate-900" : "text-slate-500")}>
                    {i === 2 && stepIndex === 2 ? (p.status === "ditolak" ? "Tidak dilanjutkan" : "Ditindaklanjuti") : s.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </Container>
  );
}

function ArgumentColumn({ title, items, tone }: { title: string; items: Comment[]; tone: "pro" | "kontra" | "netral" }) {
  const head = { pro: "bg-brand-600 text-white", kontra: "bg-rose-600 text-white", netral: "bg-slate-200 text-slate-900" }[tone];
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <h3 className={cn("rounded-md px-3 py-2 font-bold", head)}>
        {title} <span className="font-normal opacity-80">({items.length})</span>
      </h3>
      {items.length === 0 ? (
        <p className="mt-2 text-base text-slate-500">Belum ada. Tulis pendapatmu di bawah.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((c) => (
            <li key={c.id} className="rounded-md bg-white p-3 ring-1 ring-slate-200">
              <p className="whitespace-pre-line text-base text-slate-800">{c.body}</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
                <span>
                  <strong className="text-slate-700">{c.author_name ?? "Anonim"}</strong> · {GROUP_LABEL[c.author_group] ?? c.author_group} · {timeAgo(c.created_at)}
                </span>
                {!c.is_seed && <ReportButton type="comment" id={c.id} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
