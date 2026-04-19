"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import sdk from "@/lib";
import { getErrorMessage } from "@/lib/admin-utils";
import SuccessModal from "@/components/feedback/SuccessModal";

type Row = { id: number; item_id: number | null; qty: string; unit: string };

export default function BarangMasukPage() {
  const [items, setItems] = useState<Awaited<ReturnType<typeof sdk.items.list>>["data"]>([]);
  const [rows, setRows] = useState<Row[]>([{ id: 1, item_id: null, qty: "0", unit: "-" }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    void sdk.items
      .list({ perPage: 100, sortBy: "name", sortDir: "ASC", is_active: true })
      .then((response) => setItems(response.data ?? []))
      .catch((loadError) => setError(getErrorMessage(loadError, "Gagal memuat daftar barang.")));
  }, []);

  const itemMap = useMemo(() => new Map((items ?? []).map((item) => [item.id, item])), [items]);

  function resetForm() {
    setRows([{ id: Date.now(), item_id: null, qty: "0", unit: "-" }]);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const details = rows
        .filter((row) => row.item_id !== null && Number(row.qty) > 0)
        .map((row) => ({ item_id: row.item_id as number, qty: Number(row.qty), input_unit: "base" as const }));

      if (details.length === 0) {
        throw new Error("Minimal satu barang masuk harus diisi.");
      }

      await sdk.stockTransactions.create({
        type_name: "IN",
        transaction_date: new Date().toISOString().slice(0, 10),
        details,
      });

      setSuccessOpen(true);
      resetForm();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Gagal menyimpan barang masuk."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Barang Masuk</h1>
          <p className="text-sm text-gray-400">
            Setiap transaksi hanya boleh 1 jenis bahan dan bisa memuat banyak bahan sekaligus.
          </p>
        </div>

        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900">Input Barang Masuk</h2>
            <p className="text-xs text-gray-400">Pilih barang dan jumlah yang akan ditambahkan</p>
          </div>

          <div className="p-5 space-y-6">
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="bg-[#F1F5F9] px-4 py-2 text-xs font-bold text-gray-500">DAFTAR BARANG</div>
              <div className="grid grid-cols-12 border-t border-gray-300 bg-[#F1F5F9] px-4 py-2 text-xs font-semibold text-gray-500">
                <div className="col-span-5">NAMA BAHAN</div>
                <div className="col-span-3">JUMLAH</div>
                <div className="col-span-3">SATUAN</div>
                <div className="col-span-1" />
              </div>

              {rows.map((row) => (
                <div key={row.id} className="grid grid-cols-12 items-center gap-3 border-t px-4 py-3">
                  <select
                    value={row.item_id ?? ""}
                    onChange={(event) => {
                      const nextId = Number(event.target.value) || null;
                      const related = nextId ? itemMap.get(nextId) : null;
                      setRows((current) =>
                        current.map((item) =>
                          item.id === row.id ? { ...item, item_id: nextId, unit: related?.unit_base ?? "-" } : item,
                        ),
                      );
                    }}
                    className="col-span-5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600"
                  >
                    <option value="">Pilih Nama Bahan</option>
                    {(items ?? []).map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={row.qty}
                    onChange={(event) =>
                      setRows((current) =>
                        current.map((item) => (item.id === row.id ? { ...item, qty: event.target.value } : item)),
                      )
                    }
                    className="col-span-3 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    placeholder="0"
                  />

                  <input disabled className="col-span-3 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm" value={row.unit} />

                  <button
                    className="col-span-1 flex justify-center text-gray-400 hover:text-red-500"
                    onClick={() => setRows((current) => (current.length === 1 ? current : current.filter((item) => item.id !== row.id)))}
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <div className="border-t p-3">
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-400 py-2 text-sm text-blue-600 transition hover:bg-blue-50"
                  onClick={() => setRows((current) => [...current, { id: Date.now(), item_id: null, qty: "0", unit: "-" }])}
                  type="button"
                >
                  <Plus size={16} />
                  Tambah Baris Bahan
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 bg-[#F9FAFB] p-5">
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100" onClick={resetForm} type="button">
              Batal
            </button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700" onClick={handleSave} type="button" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>

      <SuccessModal
        open={successOpen}
        title="Berhasil"
        headline="Barang Masuk Berhasil Ditambahkan"
        message="Transaksi barang masuk telah tersimpan ke backend."
        onClose={() => setSuccessOpen(false)}
      />
    </>
  );
}
