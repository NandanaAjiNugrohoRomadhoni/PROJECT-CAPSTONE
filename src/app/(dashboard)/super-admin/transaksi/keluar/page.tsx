"use client";

import { useState } from "react";

export default function BarangKeluarPage() {
  const [activeTab, setActiveTab] = useState("basah");

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-[22px] font-semibold text-gray-900">
          Barang Keluar
        </h1>
        <p className="text-sm text-gray-400">
          Input barang keluar khusus jenis bahan kering & pengemas. Barang basah diinput saat menginput pasien harian
        </p>
      </div>

      {/* ================= TAB ================= */}
      <div className="border-b border-gray-200 flex gap-10">
        
        <button
          onClick={() => setActiveTab("basah")}
          className={`relative pb-3 text-sm font-medium ${
            activeTab === "basah"
              ? "text-blue-600"
              : "text-gray-400"
          }`}
        >
          Input Bahan Basah

          {activeTab === "basah" && (
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("kering")}
          className={`relative pb-3 text-sm font-medium ${
            activeTab === "kering"
              ? "text-blue-600"
              : "text-gray-400"
          }`}
        >
          Input Bahan Kering & Pengemas

          {activeTab === "kering" && (
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-full" />
          )}
        </button>

      </div>

      {/* ================= BASAH ================= */}
      {activeTab === "basah" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">

          {/* TITLE */}
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              Input Pasien Hari Ini
            </h2>
            <p className="text-xs text-gray-400">
              Masukkan jumlah pasien hari ini
            </p>
          </div>

          {/* FORM */}
          <div className="p-5">
            <label className="text-sm font-medium text-gray-700">
              Jumlah Pasien Total <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              placeholder="0"
              className="mt-3 w-full border border-gray-200 rounded-xl px-4 py-5 text-center text-xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-[#F9FAFB]">
            <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-100">
              Batal
            </button>

            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
              Simpan
            </button>
          </div>

        </div>
      )}

      {/* ================= KERING ================= */}
      {activeTab === "kering" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">

          {/* TITLE */}
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              Input Bahan Kering & Pengemas
            </h2>
            <p className="text-xs text-gray-400">
              Tambahkan bahan yang akan dikeluarkan
            </p>
          </div>

          {/* FORM */}
          <div className="p-5">

            <div className="border border-gray-200 rounded-xl overflow-hidden">

              {/* HEADER */}
              <div className="bg-[#F1F5F9] px-4 py-3 text-xs font-semibold text-gray-500">
                DAFTAR BARANG
              </div>

              {/* COLUMN */}
              <div className="grid grid-cols-12 px-4 py-2 text-xs text-gray-400 border-t">
                <div className="col-span-5">Nama Bahan</div>
                <div className="col-span-3">Jumlah</div>
                <div className="col-span-3">Satuan</div>
                <div className="col-span-1"></div>
              </div>

              {/* ROW */}
              <div className="grid grid-cols-12 gap-3 px-4 py-3 border-t items-center">

                <select className="col-span-5 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option>Pilih Nama Bahan</option>
                </select>

                <input
                  type="number"
                  className="col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="0"
                />

                <input
                  disabled
                  className="col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-100"
                  placeholder="-"
                />

                <button className="col-span-1 text-gray-400 hover:text-red-500 text-lg">
                  ✕
                </button>

              </div>

              {/* ADD */}
              <div className="p-3 border-t">
                <button className="w-full border border-dashed border-blue-400 text-blue-600 text-sm py-2 rounded-lg hover:bg-blue-50 transition">
                  + Tambah Baris Bahan
                </button>
              </div>

            </div>

          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-[#F9FAFB]">
            <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-100">
              Batal
            </button>

            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
              Simpan
            </button>
          </div>

        </div>
      )}

    </div>
  );
}