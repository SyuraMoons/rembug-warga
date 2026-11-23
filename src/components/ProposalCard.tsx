import Link from "next/link";
import { MapPin, MessageSquare } from "lucide-react";
import type { ProposalWithStats } from "@/lib/data";
import { GROUP_LABEL } from "@/content/site";
import { timeAgo } from "@/lib/format";
import { IssueBadge, SimBadge, StatusBadge, ThresholdMeter } from "./ui";
import { VoteButtons } from "./participation";

export function ProposalCard({ p, myVote, showVote = true }: { p: ProposalWithStats; myVote?: 1 | -1; showVote?: boolean }) {
  const args = p.pro + p.kontra + p.netral;
  return (
    <article className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md hover:shadow-brand-600/5">
      <div className="flex flex-wrap items-center gap-2">
        <IssueBadge slug={p.issue_slug} />
        <StatusBadge status={p.status} />
        {p.is_seed && <SimBadge />}
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900">
        <Link href={`/usulan/${p.id}`} className="hover:underline">
          {p.title}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-3 text-base text-slate-600">{p.body}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
        <span>
          oleh <strong className="text-slate-700">{p.author_name ?? "Anonim"}</strong> · {GROUP_LABEL[p.author_group] ?? p.author_group}
        </span>
        {p.kecamatan && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden /> {p.kecamatan}
          </span>
        )}
        <span>{timeAgo(p.created_at)}</span>
      </div>
      <div className="mt-auto space-y-4 pt-4">
        <ThresholdMeter support={p.support} status={p.status} />
        {showVote && <VoteButtons proposalId={p.id} support={p.support} oppose={p.oppose} myVote={myVote} />}
        <Link href={`/usulan/${p.id}#diskusi`} className="inline-flex items-center gap-1.5 text-base font-semibold text-brand-800 hover:underline">
          <MessageSquare className="h-5 w-5" aria-hidden />
          {args ? `${args} komentar · ikut beri pendapat` : "Belum ada komentar · jadi yang pertama"}
        </Link>
      </div>
    </article>
  );
}
