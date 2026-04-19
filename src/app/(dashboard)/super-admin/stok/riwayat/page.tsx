import {
  AdminPageHeading,
  ExportButton,
  FilterDate,
  FilterSearch,
  FilterSelect,
  Pagination,
  PrimaryAction,
  SurfaceCard,
} from "@/components/admin/ui";

const adjustments = [
  ["PS-0001", "12/03/2026", "Beras", "KERING", "45.5 kg", "46 kg", "+0.5 kg", "text-[#10B981]"],
  ["PS-0002", "10/03/2026", "Ayam", "BASAH", "6.5 kg", "6 kg", "-0.5 kg", "text-[#EF4444]"],
  ["PS-0003", "10/03/2026", "Wortel", "BASAH", "4.2 kg", "4.5 kg", "+0.3 kg", "text-[#10B981]"],
  ["PS-0004", "08/03/2026", "Garam", "KERING", "48 kg", "48 kg", "0 kg", "text-[#475569]"],
  ["PS-0005", "08/03/2026", "Sendok Plastik", "PENGEMAS", "250 pcs", "245 pcs", "-5 pcs", "text-[#EF4444]"],
  ["PS-0006", "08/03/2026", "Gula", "KERING", "45.5 kg", "46 kg", "+0.5 kg", "text-[#10B981]"],
  ["PS-0007", "05/03/2026", "Kentang", "BASAH", "6.5 kg", "6 kg", "-0.5 kg", "text-[#EF4444]"],
  ["PS-0008", "04/03/2026", "Bakso Sapi", "BASAH", "4.2 kg", "4.5 kg", "+0.3 kg", "text-[#10B981]"],
  ["PS-0009", "03/03/2026", "Tepung", "KERING", "48 kg", "48 kg", "0 kg", "text-[#475569]"],
  ["PS-0010", "03/03/2026", "Sterofoam", "PENGEMAS", "250 pcs", "245 pcs", "-5 pcs", "text-[#EF4444]"],
] as const;

export default function Page() {
  return (
    <div className="space-y-5">
      <AdminPageHeading
        title="Penyesuaian Stok"
        subtitle="Untuk melakukan penyesuaian stok antara stok sistem dan stok fisik. Selisih dihitung otomatis oleh sistem"
        action={<PrimaryAction>Input Penyesuaian Stok</PrimaryAction>}
      />

      <SurfaceCard className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b bg-[#F8FAFC] px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="w-full lg:w-[220px]">
              <FilterSearch placeholder="Cari Bahan" />
            </div>
            <FilterDate />
            <FilterSelect label="Semua Jenis" />
          </div>
          <div className="ml-auto">
            <ExportButton>Export Riwayat</ExportButton>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F1F5F9] text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3">ID Penyesuaian Stok</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Nama Bahan</th>
                <th className="px-6 py-3">Jenis Bahan</th>
                <th className="px-6 py-3">Stok Sistem</th>
                <th className="px-6 py-3">Stok Fisik</th>
                <th className="px-6 py-3">Selisih</th>
              </tr>
            </thead>
            <tbody className="bg-white text-sm text-gray-700">
              {adjustments.map((row) => (
                <tr
                  key={row[0]}
                  className="border-t border-gray-200 transition hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{row[0]}</td>
                  <td className="px-6 py-4">{row[1]}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{row[2]}</td>
                  <td className="px-6 py-4">{row[3]}</td>
                  <td className="px-6 py-4">{row[4]}</td>
                  <td className="px-6 py-4">{row[5]}</td>
                  <td className={`px-6 py-4 font-medium ${row[7]}`}>{row[6]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination totalLabel="1-10 dari 15" />
      </SurfaceCard>
    </div>
  );
}
