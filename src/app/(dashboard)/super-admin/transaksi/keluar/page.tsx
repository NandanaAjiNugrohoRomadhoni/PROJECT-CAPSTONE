"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import sdk from "@/lib";
import { getErrorMessage } from "@/lib/admin-utils";
import SuccessModal from "@/components/feedback/SuccessModal";

type Row = { id: number; item_id: number | null; qty: string; unit: string };

export default function BarangKeluarPage() {
  const [activeTab, setActiveTab] = useState("basah");
  const [items, setItems] = useState<Awaited<ReturnType<typeof sdk.items.list>>["data"]>([]);
  const [patientCount, setPatientCount] = useState("0");
  const [rows, setRows] = useState<Row[]>([{ id: 1, item_id: null, qty: "0", unit: "-" }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<{ headline: string; message: string } | null>(null);

  useEffect(() => {
    void sdk.items
      .list({ perPage: 100, sortBy: "name", sortDir: "ASC", is_active: true })
      .then((response) => setItems(response.data ?? []))
      .catch((loadError) => setError(getErrorMessage(loadError, "Gagal memuat daftar bahan.")));
  }, []);

  const itemMap = useMemo(() => new Map((items ?? []).map((item) => [item.id, item])), [items]);

  async function savePatientCount() {
    setSaving(true);
    setError(null);
    try {
      await sdk.dailyPatients.create({
        service_date: new Date().toISOString().slice(0, 10),
        total_patients: Number(patientCount),
      });
      setSuccessState({
        headline: "Data Pasien Berhasil Disimpan",
        message: "Jumlah pasien harian telah tersimpan ke backend.",
      });
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Gagal menyimpan jumlah pasien."));
    } finally {
      setSaving(false);
    }
  }

  async function saveDryOutput() {
    setSaving(true);
    setError(null);
    try {
      const details = rows
        .filter((row) => row.item_id !== null && Number(row.qty) > 0)
        .map((row) => ({ item_id: row.item_id as number, qty: Number(row.qty), input_unit: "base" as const }));

      if (details.length === 0) throw new Error("Minimal satu bahan harus dipilih.");

      await sdk.stockTransactions.create({
        type_name: "OUT",
        transaction_date: new Date().toISOString().slice(0, 10),
        details,
      });

      setSuccessState({
        headline: "Barang Keluar Berhasil Ditambahkan",
        message: "Transaksi barang keluar telah tersimpan ke backend.",
      });
      setRows([{ id: Date.now(), item_id: null, qty: "0", unit: "-" }]);
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Gagal menyimpan barang keluar."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900">Barang Keluar</h1>
          <p className="text-sm text-gray-400">
            Input barang keluar khusus jenis bahan kering & pengemas. Barang basah diinput saat menginput pasien harian
          </p>
        </div>

        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

        <div className="flex gap-10 border-b border-gray-200">
          <button onClick={() => setActiveTab("basah")} className={`relative pb-3 text-sm font-medium ${activeTab === "basah" ? "text-blue-600" : "text-gray-400"}`} type="button">
            Input Bahan Basah
            {activeTab === "basah" && <div className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-blue-600" />}
          </button>

          <button onClick={() => setActiveTab("kering")} className={`relative pb-3 text-sm font-medium ${activeTab === "kering" ? "text-blue-600" : "text-gray-400"}`} type="button">
            Input Bahan Kering & Pengemas
            {activeTab === "kering" && <div className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-blue-600" />}
          </button>
        </div>

        {activeTab === "basah" && (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900">Input Pasien Hari Ini</h2>
              <p className="text-xs text-gray-400">Masukkan jumlah pasien hari ini</p>
            </div>

            <div className="p-5">
              <label className="text-sm font-medium text-gray-700">
                Jumlah Pasien Total <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                value={patientCount}
                onChange={(event) => setPatientCount(event.target.value)}
                placeholder="0"
                className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-5 text-center text-xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 bg-[#F9FAFB] p-5">
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100" onClick={() => setPatientCount("0")} type="button">
                Batal
              </button>

              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700" onClick={savePatientCount} type="button" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "kering" && (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900">Input Bahan Kering & Pengemas</h2>
              <p className="text-xs text-gray-400">Tambahkan bahan yang akan dikeluarkan</p>
            </div>

            <div className="p-5">
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="bg-[#F1F5F9] px-4 py-3 text-xs font-semibold text-gray-500">DAFTAR BARANG</div>
                <div className="grid grid-cols-12 border-t px-4 py-2 text-xs text-gray-400">
                  <div className="col-span-5">Nama Bahan</div>
                  <div className="col-span-3">Jumlah</div>
                  <div className="col-span-3">Satuan</div>
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
                          current.map((item) => (item.id === row.id ? { ...item, item_id: nextId, unit: related?.unit_base ?? "-" } : item)),
                        );
                      }}
                      className="col-span-5 rounded-lg border border-gray-200 px-3 py-2 text-sm"
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

                    <button className="col-span-1 flex justify-center text-gray-400 hover:text-red-500" onClick={() => setRows((current) => (current.length === 1 ? current : current.filter((item) => item.id !== row.id)))} type="button">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <div className="border-t p-3">
                  <button className="w-full rounded-lg border border-dashed border-blue-400 py-2 text-sm text-blue-600 transition hover:bg-blue-50" onClick={() => setRows((current) => [...current, { id: Date.now(), item_id: null, qty: "0", unit: "-" }])} type="button">
                    <span className="inline-flex items-center gap-2">
                      <Plus size={16} />
                      Tambah Baris Bahan
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 bg-[#F9FAFB] p-5">
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100" onClick={() => setRows([{ id: Date.now(), item_id: null, qty: "0", unit: "-" }])} type="button">
                Batal
              </button>

              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700" onClick={saveDryOutput} type="button" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        )}
      </div>

      <SuccessModal
        open={successState !== null}
        title="Berhasil"
        headline={successState?.headline ?? ""}
        message={successState?.message ?? ""}
        onClose={() => setSuccessState(null)}
      />
    </>
  );
}
