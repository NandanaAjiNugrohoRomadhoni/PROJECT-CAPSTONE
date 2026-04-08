"use client";

import { Plus } from "lucide-react";

export default function BarangMasukPage() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Barang Masuk
        </h1>
        <p className="text-sm text-gray-400">
          Setiap transaksi hanya boleh 1 jenis bahan (Basah, Kering, atau Pengemas). Bisa memuat banyak bahan sekaligus
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* TITLE */}
        <div className="p-5 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            Input Barang Masuk
          </h2>
          <p className="text-xs text-gray-400">
            Pilih jenis bahan terlebih dahulu
          </p>
        </div>

        {/* FORM */}
        <div className="p-5 space-y-6">

          {/* JENIS BAHAN */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Jenis Bahan <span className="text-red-500">*</span>
            </label>

            <select className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white">
              <option>Pilih Jenis Bahan</option>
            </select>
          </div>

          {/* DAFTAR BARANG */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">

            {/* HEADER */}
            <div className="bg-[#F1F5F9] px-4 py-2 text-xs font-bold text-gray-500">
              DAFTAR BARANG
            </div>

            {/* COLUMN */}
            <div className="bg-[#F1F5F9] grid grid-cols-12 px-4 py-2 text-xs font-semibold text-gray-500 border-t border-gray-300">
              <div className="col-span-5">NAMA BAHAN</div>
              <div className="col-span-3">JUMLAH</div>
              <div className="col-span-3">SATUAN</div>
              <div className="col-span-1"></div>
            </div>

            {/* ROW */}
            <div className="grid grid-cols-12 gap-3 px-4 py-3 border-t items-center">

              {/* NAMA */}
              <select className="col-span-5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
                <option>Pilih Nama Bahan</option>
              </select>

              {/* JUMLAH */}
              <input
                type="number"
                className="col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="0"
              />

              {/* SATUAN */}
              <input
                disabled
                className="col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-100"
                placeholder="-"
              />

              {/* DELETE */}
              <button className="col-span-1 text-gray-400 hover:text-red-500">
                ✕
              </button>

            </div>

            {/* ADD ROW */}
            <div className="p-3 border-t">
              <button className="w-full border border-dashed border-blue-400 text-blue-600 text-sm py-2 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2">
                <Plus size={16} />
                Tambah Baris Bahan
              </button>
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-5 border-t border-gray-200 bg-[#F9FAFB]">
          
          <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-100">
            Batal
          </button>

          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
            Simpan
          </button>

        </div>

      </div>
    </div>
  );
}