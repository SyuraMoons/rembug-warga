import type { ProposalWithStats } from "./data";
import type { SortValue } from "@/components/FilterBar";

export function sortProposals(list: ProposalWithStats[], sort: SortValue): ProposalWithStats[] {
  const copy = [...list];
  if (sort === "populer") copy.sort((a, b) => b.support - a.support || a.oppose - b.oppose);
  else if (sort === "diskusi") copy.sort((a, b) => b.pro + b.kontra + b.netral - (a.pro + a.kontra + a.netral));
  return copy; // "terbaru" sudah urut dari database
}
