"use client";

import { useEffect, useMemo, useState } from "react";
import sdk from "@/lib";
import { formatDate } from "@/lib/admin-utils";
import {
  ExportButton,
  FilterDate,
  FilterSearch,
  FilterSelect,
  MiniActionButton,
  Pagination,
  StatusPill,
  SurfaceCard,
} from "@/components/admin/ui";

type TransactionRow = Awaited<ReturnType<typeof sdk.stockTransactions.list>>["data"][number];
type LookupRow = Awaited<ReturnType<typeof sdk.transactionTypes.list>>["data"][number];

export default function Page() {
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [types, setTypes] = useState<LookupRow[]>([]);
  const [statuses, setStatuses] = useState<LookupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [transactionResponse, typeResponse, statusResponse] = await Promise.all([
          sdk.stockTransactions.list({ perPage: 100, sortBy: "transaction_date", sortDir: "DESC" }),
          sdk.transactionTypes.list({ paginate: false }),
          sdk.approvalStatuses.list({ paginate: false }),
        ]);

        if (cancelled) return;

        setTransactions(transactionResponse.data ?? []);
        setTypes(typeResponse.data ?? []);
        setStatuses(statusResponse.data ?? []);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat riwayat transaksi.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const typeMap = useMemo(() => new Map(types.map((type) => [type.id, type.name])), [types]);
  const statusMap = useMemo(() => new Map(statuses.map((status) => [status.id, status.name])), [statuses]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-semibold text-gray-900">Riwayat Transaksi Barang</h1>
        <p className="text-sm text-gray-400">Riwayat transaksi barang masuk & keluar</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <SurfaceCard className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-[#F8FAFC] p-4">
          <div className="flex flex-wrap gap-3">
            <div className="w-[200px]">
              <FilterSearch placeholder="Cari Bahan" />
            </div>
            <FilterDate />
            <FilterSelect label="Semua Jenis" />
            <FilterSelect label="Semua Status" />
          </div>
          <div className="ml-auto">
            <ExportButton>Export Riwayat</ExportButton>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F1F5F9] text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3">ID Transaksi</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Tipe</th>
                <th className="px-6 py-3">Approval</th>
                <th className="px-6 py-3">SPK</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white text-sm text-gray-700">
              {transactions.map((item) => {
                const typeLabel = typeMap.get(item.type_id) ?? `Tipe #${item.type_id}`;
                const statusLabel = statusMap.get(item.approval_status_id) ?? `Status #${item.approval_status_id}`;
                const tone =
                  statusLabel.toLowerCase().includes("approve")
                    ? "safe"
                    : statusLabel.toLowerCase().includes("reject")
                      ? "critical"
                      : "warning";

                return (
                  <tr key={item.id} className="border-t border-gray-200 transition hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">TR-{String(item.id).padStart(4, "0")}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(item.transaction_date)}</td>
                    <td className="px-6 py-4 text-gray-600">{typeLabel}</td>
                    <td className="px-6 py-4">
                      <StatusPill tone={tone}>{statusLabel}</StatusPill>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.spk_id ? `SPK-${item.spk_id}` : "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <MiniActionButton>Detail</MiniActionButton>
                        <MiniActionButton>Edit</MiniActionButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && transactions.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-400" colSpan={6}>
                    Belum ada riwayat transaksi.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <Pagination totalLabel={`${transactions.length === 0 ? 0 : 1}-${transactions.length} dari ${transactions.length} item`} />
      </SurfaceCard>
    </div>
  );
}
