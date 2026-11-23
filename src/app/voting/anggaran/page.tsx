import type { Metadata } from "next";
import { getMyBallot } from "@/lib/data";
import { getDeviceId } from "@/lib/participant";
import { BudgetPicker } from "@/components/BudgetPicker";
import { ButtonLink, Container, ObjectiveStrip, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Anggaran Partisipatif" };
export const dynamic = "force-dynamic";

export default async function AnggaranPage() {
  const ballot = await getDeviceId().then(getMyBallot);

  return (
    <>
      <PageHeader
        eyebrow="Mekanisme 4 · Anggaran partisipatif"
        title="Kamu pegang Rp 10 miliar."
        accent="Mau dipakai untuk apa?"
        description={
          <>
            Total semua program bernilai <strong>Rp 19,2 miliar</strong>, jauh di atas pagu. Pilih program yang menurutmu
            paling penting tanpa melebihi <strong>Rp 10 miliar</strong>. Program dengan suara terbanyak didanai berurutan
            sampai anggaran habis. Angka anggaran bersifat simulasi.
          </>
        }
      >
        <ButtonLink href="/hasil#anggaran" variant="outline">
          Lihat hasil sementara
        </ButtonLink>
      </PageHeader>
      <Container className="py-8">
        <ObjectiveStrip
          objective="Melibatkan warga langsung dalam menentukan prioritas belanja kota."
          how="Pilih program tanpa melebihi pagu. Program dengan suara terbanyak didanai berurutan sampai anggaran habis."
          impact="Warga merasakan trade-off nyata: tidak semua program bisa didanai, sehingga prioritas harus dipilih."
        />
        <div className="mt-10" />
        <BudgetPicker initial={ballot} />
      </Container>
    </>
  );
}
