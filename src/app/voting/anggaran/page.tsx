import type { Metadata } from "next";
import { getMyBallot } from "@/lib/data";
import { getDeviceId } from "@/lib/participant";
import { BudgetPicker } from "@/components/BudgetPicker";
import { ButtonLink, Container, PageHeader, Why } from "@/components/ui";

export const metadata: Metadata = { title: "Bagi Uang Kota" };
export const dynamic = "force-dynamic";

export default async function AnggaranPage() {
  const ballot = await getDeviceId().then(getMyBallot);

  return (
    <>
      <PageHeader
        title="Kamu pegang Rp 10 miliar."
        accent="Mau dipakai untuk apa?"
        description="Ketuk program yang paling penting sampai uangnya habis. Uangnya tidak cukup untuk semua."
      >
        <ButtonLink href="/hasil#anggaran" variant="outline">
          Lihat pilihan warga lain
        </ButtonLink>
      </PageHeader>
      <Container className="py-8">
        <Why mechanism="anggaran" />
        <div className="mt-8" />
        <BudgetPicker initial={ballot} />
      </Container>
    </>
  );
}
