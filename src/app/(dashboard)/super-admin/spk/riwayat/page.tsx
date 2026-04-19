"use client";

import { useEffect, useState } from "react";
import sdk from "@/lib";
import { formatDate, getErrorMessage } from "@/lib/admin-utils";
import {
  AdminPageHeading,
  ExportButton,
  FilterDate,
  FilterSearch,
  FilterSelect,
  MiniActionButton,
  Pagination,
  SurfaceCard,
} from "@/components/admin/ui";

type SpkRow = {
  id: number;
  calculation_date: string;
  names: string;
  category: string;
};

export default function Page() {
  const [rows, setRows] = useState<SpkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [basah, kering] = await Promise.all([sdk.spk.listBasah(), sdk.spk.listKeringPengemas()]);
        if (cancelled) return;

        const basahDetailPromises = (basah.data ?? []).slice(0, 5).map((entry) => sdk.spk.getBasah(entry.id));
        const keringDetailPromises = (kering.data ?? []).slice(0, 5).map((entry) => sdk.spk.getKeringPengemas(entry.id));
        const [basahDetails, keringDetails] = await Promise.all([
          Promise.all(basahDetailPromises),
          Promise.all(keringDetailPromises),
        ]);
        if (cancelled) return;

        const merged: SpkRow[] = [
          ...basahDetails.map((detail) => ({
            id: detail.data.id,
            calculation_date: detail.data.calculation_date,
            names: detail.data.items.slice(0, 3).map((item) => item.item_name).filter(Boolean).join(", "),
            category: "BASAH",
          })),
          ...keringDetails.map((detail) => ({
            id: detail.data.id,
            calculation_date: detail.data.calculation_date,
            names: detail.data.items.slice(0, 3).map((item) => item.item_name).filter(Boolean).join(", "),
            category: "KERING & PENGEMAS",
          })),
        ].sort((a, b) => b.calculation_date.localeCompare(a.calculation_date));

        setRows(merged);
      } catch (loadError) {
        if (!cancelled) setError(getErrorMessage(loadError, "Gagal memuat riwayat SPK."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-5">
      <AdminPageHeading title="Riwayat SPK" subtitle="Riwayat Sistem Pengambilan Keputusan Belanja Basah, Kering & Pengemas" />

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div> : null}

      <SurfaceCard className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b bg-[#F8FAFC] px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="w-full lg:w-[220px]">
              <FilterSearch placeholder="Cari" />
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
                <th className="px-6 py-3">ID SPK</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Nama Bahan</th>
                <th className="px-6 py-3">Jenis Bahan</th>
                <th className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {rows.map((row) => (
                <tr key={`${row.category}-${row.id}`} className="border-t border-gray-200 transition hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">SPK-{String(row.id).padStart(4, "0")}</td>
                  <td className="px-6 py-4">{formatDate(row.calculation_date)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.names || "-"}</td>
                  <td className="px-6 py-4">{row.category}</td>
                  <td className="px-6 py-4">
                    <MiniActionButton>Detail</MiniActionButton>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-400" colSpan={5}>
                    Belum ada riwayat SPK.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <Pagination totalLabel={`${rows.length === 0 ? 0 : 1}-${rows.length} dari ${rows.length} item`} />
      </SurfaceCard>
    </div>
  );
}
