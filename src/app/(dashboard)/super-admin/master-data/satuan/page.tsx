"use client";

import { Search } from "lucide-react";

export default function SatuanPage() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Data Satuan
          </h1>
          <p className="text-sm text-gray-400">
            Untuk melihat dan mengelola data satuan
          </p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm shadow">
          Tambah Satuan
        </button>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* TOP BAR */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-[#F9FAFB]">
          
          {/* SEARCH */}
          <div className="flex items-center bg-white border border-gray-200 px-3 py-2 rounded-lg w-64">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              placeholder="Cari nama satuan"
              className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* INFO */}
          <p className="text-xs text-gray-400">
            4 satuan
          </p>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead>
              <tr className="bg-[#F1F5F9] text-gray-500 text-xs uppercase tracking-wide">
                <th className="text-left px-6 py-3">
                  Nama Satuan
                </th>
                <th className="px-6 text-right">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-700">

              {["kg", "g", "liter", "pcs"].map((item) => (
                <tr
                  key={item}
                  className="border-t border-gray-200 hover:bg-[#F9FAFB] transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item}
                  </td>

                  <td className="px-6">
                    <div className="flex justify-end gap-2">
                      <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-200 transition">
                        Edit
                      </button>
                      <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-200 transition">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center px-6 py-3 text-xs text-gray-400 border-t border-gray-200 bg-[#F9FAFB]">
          
          <span>1–4 dari 4</span>

          <div className="flex gap-2">
            <button className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">
              ‹
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">
              1
            </button>
            <button className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">
              ›
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}