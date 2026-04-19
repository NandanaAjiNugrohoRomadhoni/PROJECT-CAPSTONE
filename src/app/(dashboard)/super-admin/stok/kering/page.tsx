"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, PackageX, Zap } from "lucide-react";
import sdk from "@/lib";
import { formatNumber, formatQuantity, getStockTone } from "@/lib/admin-utils";
import {
  AdminPageHeading,
  ExportButton,
  FilterSearch,
  FilterSelect,
  Pagination,
  PrimaryAction,
  StatusPill,
  SurfaceCard,
} from "@/components/admin/ui";

type ItemRecord = Awaited<ReturnType<typeof sdk.items.list>>["data"][number];

const statCards = [
  {
    key: "warning",
    title: "STOK MENIPIS",
    note: "Bahan kering di bawah minimum",
    accent: "border-[#F59E0B]",
    iconBg: "bg-[#FEF3C7]",
    iconColor: "text-[#B45309]",
    icon: Zap,
  },
  {
    key: "critical",
    title: "STOK KRITIS",
    note: "Bahan kering mendekati habis",
    accent: "border-[#FF6B6B]",
    iconBg: "bg-[#FEE2E2]",
    iconColor: "text-[#DC2626]",
    icon: AlertTriangle,
  },
  {
    key: "danger",
    title: "STOK HABIS",
    note: "Bahan kering habis",
    accent: "border-[#CBD5E1]",
    iconBg: "bg-[#E2E8F0]",
    iconColor: "text-[#334155]",
    icon: PackageX,
  },
] as const;

export default function Page() {
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await sdk.items.list({ perPage: 100, sortBy: "id", sortDir: "ASC" });
        if (!cancelled) {
          setItems(response.data ?? []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat stok kering.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const itemRows = useMemo(() => {
    return items
      .filter((item) => {
        const categoryName = item.category?.name?.toUpperCase() ?? "";
        return categoryName !== "BASAH";
      })
      .map((item) => {
        const minimum = Number(item.conversion_base ?? 0) || 0;
        const qty = Number(item.qty ?? 0);
        const stock = getStockTone(qty, minimum || 1);

        return {
          idLabel: `BR-${String(item.id).padStart(4, "0")}`,
          name: item.name,
          category: item.category?.name ?? "-",
          qtyLabel: formatQuantity(qty, item.unit_base),
          minimumLabel: formatQuantity(minimum, item.unit_base),
          tone: stock.tone,
          label: stock.label,
        };
      });
  }, [items]);

  const counts = useMemo(() => {
    return itemRows.reduce(
      (acc, item) => {
        acc[item.tone] += 1;
        return acc;
      },
      { warning: 0, critical: 0, danger: 0, safe: 0 } as Record<
        "warning" | "critical" | "danger" | "safe",
        number
      >,
    );
  }, [itemRows]);

  return (
    <div className="space-y-5">
      <AdminPageHeading
        title="Stok Kering"
        subtitle="Pantau stok bahan kering dan pengemas dari data backend"
        action={<PrimaryAction>Tambah Master Barang</PrimaryAction>}
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          const count = counts[card.key];

          return (
            <SurfaceCard
              key={card.title}
              className={`border-t-[3px] ${card.accent} p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]`}
            >
              <div
                className={`mb-5 flex h-8 w-8 items-center justify-center rounded-[9px] ${card.iconBg}`}
              >
                <Icon size={14} className={card.iconColor} />
              </div>
              <p className="text-[11px] font-semibold tracking-[0.04em] text-[#94A3B8]">
                {card.title}
              </p>
              <p className="mt-1 text-[18px] font-bold text-[#16213E]">
                {loading ? "..." : formatNumber(count)}
              </p>
              <p className="mt-2 text-[11px] text-[#94A3B8]">{card.note}</p>
            </SurfaceCard>
          );
        })}
      </div>

      <SurfaceCard className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b bg-[#F8FAFC] px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="w-full lg:w-[240px]">
              <FilterSearch placeholder="Cari Bahan Kering" />
            </div>
            <FilterSelect label="Semua Jenis" />
            <FilterSelect label="Semua Status" />
          </div>
          <div className="ml-auto">
            <ExportButton />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F1F5F9] text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3">ID Barang</th>
                <th className="px-6 py-3">Nama Bahan</th>
                <th className="px-6 py-3">Jenis Bahan</th>
                <th className="px-6 py-3">Stok Saat Ini</th>
                <th className="px-6 py-3">Minimal Stok</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white text-sm text-gray-700">
              {itemRows.map((item) => (
                <tr
                  key={item.idLabel}
                  className="border-t border-gray-200 transition hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{item.idLabel}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">{item.qtyLabel}</td>
                  <td className="px-6 py-4">{item.minimumLabel}</td>
                  <td className="px-6 py-4">
                    <StatusPill tone={item.tone}>{item.label}</StatusPill>
                  </td>
                </tr>
              ))}
              {!loading && itemRows.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-400" colSpan={6}>
                    Belum ada data stok kering.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <Pagination
          totalLabel={`${itemRows.length === 0 ? 0 : 1}-${itemRows.length} dari ${itemRows.length} item`}
        />
      </SurfaceCard>
    </div>
  );
}
