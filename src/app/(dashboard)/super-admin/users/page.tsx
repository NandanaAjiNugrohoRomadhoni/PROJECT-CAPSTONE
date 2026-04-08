"use client";

import { useState } from "react";
import { Search, X, Eye, EyeOff } from "lucide-react";

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900">
            Manajemen Pengguna
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Untuk melihat dan mengelola informasi pengguna
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-sm transition"
        >
          Buat Akun Pengguna
        </button>
      </div>

      {/* ================= CARD ================= */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* ================= FILTER ================= */}
        <div className="px-5 py-4 border-b bg-[#F8FAFC] flex flex-wrap gap-3 items-center">

          {/* SEARCH */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 h-10 w-[240px]">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              placeholder="Cari Nama / Username"
              className="outline-none text-sm w-full text-gray-700 placeholder-gray-400"
            />
          </div>

          <input
            type="date"
            className="bg-white border border-gray-200 rounded-lg px-3 h-10 text-sm text-gray-600"
          />

          <select className="bg-white border border-gray-200 rounded-lg px-3 h-10 text-sm text-gray-600">
            <option>Semua Role</option>
          </select>

          <select className="bg-white border border-gray-200 rounded-lg px-3 h-10 text-sm text-gray-600">
            <option>Semua Status</option>
          </select>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead>
              <tr className="bg-[#F1F5F9] text-[11px] text-gray-500 uppercase tracking-wide">
                <th className="text-left px-6 py-3">ID Pengguna</th>
                <th className="px-6">Tanggal</th>
                <th className="text-left px-6">Nama Pengguna</th>
                <th className="text-left px-6">Username</th>
                <th className="px-6">Role</th>
                <th className="px-6">Status</th>
                <th className="px-6 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {[
                {
                  id: "PGU-0001",
                  date: "12/03/2026",
                  name: "Muhammad Rizal Satria Prihadi",
                  username: "Rizal Prihadi",
                  role: "Petugas Gudang",
                  status: "Aktif",
                },
                {
                  id: "PGI-0002",
                  date: "10/03/2026",
                  name: "Nandini Putri Hanifa Jannah",
                  username: "Nandini",
                  role: "Petugas Gizi",
                  status: "Nonaktif",
                },
              ].map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {u.id}
                  </td>

                  <td className="px-6 text-center text-gray-600">
                    {u.date}
                  </td>

                  <td className="px-6 font-medium text-gray-900">
                    {u.name}
                  </td>

                  <td className="px-6 text-gray-500">
                    {u.username}
                  </td>

                  <td className="px-6 text-center text-gray-600">
                    {u.role}
                  </td>

                  <td className="px-6 text-center">
                    <span
                      className={`px-3 py-[4px] rounded-full text-xs font-medium ${
                        u.status === "Aktif"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="px-6 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="px-3 py-[6px] rounded-lg text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 transition">
                        Edit
                      </button>
                      <button className="px-3 py-[6px] rounded-lg text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 transition">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex items-center justify-between px-6 py-3 text-xs text-gray-400 border-t bg-[#F8FAFC]">
          <span>1–10 dari 15</span>

          <div className="flex items-center gap-2">
            <button className="px-2 py-1 bg-gray-100 rounded-md">‹</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-100 rounded-md">2</button>
            <button className="px-2 py-1 bg-gray-100 rounded-md">›</button>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* OVERLAY */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* MODAL */}
          <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 animate-[fadeIn_.2s_ease]">

            {/* HEADER */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Buat Akun Pengguna
                </h2>
                <p className="text-sm text-gray-400">
                  Masukkan detail akun pengguna
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* FORM */}
            <div className="space-y-4">

              {/* NAMA */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Masukkan nama lengkap"
                  className="mt-1 w-full h-11 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* USERNAME */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Masukkan username"
                  className="mt-1 w-full h-11 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>

                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    className="w-full h-11 border border-gray-200 rounded-lg px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* ROLE */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Role <span className="text-red-500">*</span>
                </label>
                <select className="mt-1 w-full h-11 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Pilih role pengguna</option>
                  <option>Super Admin</option>
                  <option>Gudang</option>
                  <option>Gizi</option>
                </select>
              </div>

            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                Simpan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

