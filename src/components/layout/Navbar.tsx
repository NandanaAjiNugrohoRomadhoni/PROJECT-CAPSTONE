"use client";

import { useState } from "react";
import {
  Bell,
  Settings,
  Search,
  ChevronDown,
} from "lucide-react";

export default function Navbar({ setOpen }: any) {
  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <div className="sticky top-0 z-40 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        
        {/* MOBILE BUTTON */}
        <button
          className="lg:hidden"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>

        <div>
          <p className="text-xs text-gray-400">
            Super Admin / Dashboard
          </p>
          <h1 className="font-semibold text-gray-900">
            Dashboard
          </h1>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        
        {/* SEARCH */}
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            placeholder="Cari..."
            className="bg-transparent outline-none text-sm"
          />
        </div>

        {/* DATE */}
        <p className="hidden md:block text-sm text-gray-400">
          Kam, 12 Mar 2026
        </p>

        {/* NOTIF */}
        <div className="relative">
          <button
            onClick={() => setOpenNotif(!openNotif)}
            className="p-2 bg-gray-100 rounded-lg"
          >
            <Bell size={18} />
          </button>

          {openNotif && (
            <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-xl border border-gray-100 p-3 z-50">
              
              <p className="text-sm font-semibold mb-2">
                Notifikasi
              </p>

              <div className="space-y-2 text-sm">
                <div className="p-2 rounded hover:bg-gray-50">
                  Permintaan Barang Keluar
                </div>
                <div className="p-2 rounded hover:bg-gray-50">
                  Stok Hampir Habis
                </div>
              </div>

            </div>
          )}
        </div>

        {/* SETTINGS */}
        <button className="p-2 bg-gray-100 rounded-lg">
          <Settings size={18} />
        </button>

        {/* PROFILE */}
        <div className="relative">
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
          >
            <div className="w-6 h-6 bg-blue-500 text-white text-xs flex items-center justify-center rounded-full">
              SA
            </div>
            <ChevronDown size={16} />
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl border border-gray-100 p-2">
              
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                Profile
              </button>

              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}