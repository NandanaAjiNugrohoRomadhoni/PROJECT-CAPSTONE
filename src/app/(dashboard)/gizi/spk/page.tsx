import { ExportButton, OutlineAction, SurfaceCard } from "@/components/admin/ui";

const wetRows = [
  ["Ayam", "Beli 42 kg"],
  ["Wortel", "Beli 16 kg"],
  ["Kentang", "Beli 14 kg"],
];

const dryRows = [
  ["Beras", "Beli 224 kg"],
  ["Susu UHT", "Beli 1.154 pcs"],
  ["Sendok Plastik", "Beli 1.124 pcs"],
];

export default function Page() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[22px] font-semibold text-[#16213E]">SPK Perencanaan</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Rekomendasi kebutuhan bahan untuk operasional gizi
        </p>
      </div>

      <SurfaceCard className="overflow-hidden">
        <div className="border-b bg-[#EDF4FF] px-5 py-4">
          <h3 className="text-base font-semibold text-[#16213E]">Rumus SPK Bahan Basah</h3>
          <p className="mt-1 text-sm text-[#475569]">
            (Jumlah Pasien Terakhir x 5%) x Komposisi per Paket Menu - Sisa Stok
          </p>
        </div>
        <div className="grid gap-4 border-b px-5 py-4 md:grid-cols-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">Tanggal Belanja</p>
            <p className="mt-1 text-lg font-semibold text-[#16213E]">13-14 Mar 2026</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">Pasien Terakhir</p>
            <p className="mt-1 text-lg font-semibold text-[#16213E]">40 orang</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">Setelah Buffer +5%</p>
            <p className="mt-1 text-lg font-semibold text-[#16213E]">42 orang (acuan)</p>
          </div>
        </div>
        <div className="px-5 py-4">
          <OutlineAction>Generate</OutlineAction>
        </div>
      </SurfaceCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <SurfaceCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b bg-white px-5 py-4">
            <div>
              <h3 className="text-base font-semibold text-[#16213E]">Belanja Basah</h3>
              <p className="mt-1 text-xs text-[#94A3B8]">13-14 Mar 2026 - 42 pasien acuan</p>
            </div>
            <ExportButton>Export Rekomendasi</ExportButton>
          </div>
          <div className="space-y-2 p-4">
            {wetRows.map((row) => (
              <div key={row[0]} className="flex items-center justify-between rounded-[10px] bg-[#EEF4FF] px-4 py-2">
                <span className="text-sm font-medium text-[#16213E]">{row[0]}</span>
                <span className="text-sm font-semibold text-[#16213E]">{row[1]}</span>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b bg-white px-5 py-4">
            <div>
              <h3 className="text-base font-semibold text-[#16213E]">Belanja Kering & Pengemas</h3>
              <p className="mt-1 text-xs text-[#94A3B8]">Pengeluaran Mar x 10% - Stok</p>
            </div>
            <ExportButton>Export Rekomendasi</ExportButton>
          </div>
          <div className="space-y-2 p-4">
            {dryRows.map((row) => (
              <div key={row[0]} className="flex items-center justify-between rounded-[10px] bg-[#EEF4FF] px-4 py-2">
                <span className="text-sm font-medium text-[#16213E]">{row[0]}</span>
                <span className="text-sm font-semibold text-[#16213E]">{row[1]}</span>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
