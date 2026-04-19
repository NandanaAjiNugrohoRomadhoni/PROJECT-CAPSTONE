"use client";

import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Settings, Search, ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import { getRoleLabel, useAuthStore } from "@/store/authStore";

export default function Navbar({
  setOpen,
}: Readonly<{
  setOpen: Dispatch<SetStateAction<boolean>>;
}>) {
  const [openNotif, setOpenNotif] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const notifMenuRef = useRef<HTMLDivElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const pageTitle = useMemo(() => {
    const titleMap: Record<string, string> = {
      "/super-admin": "Dashboard",
      "/super-admin/users": "Manajemen Pengguna",
      "/super-admin/master-data/jenis": "Data Jenis Bahan",
      "/super-admin/master-data/satuan": "Data Satuan",
      "/super-admin/transaksi/masuk": "Barang Masuk",
      "/super-admin/transaksi/keluar": "Barang Keluar",
      "/super-admin/transaksi/riwayat": "Riwayat Transaksi Barang",
      "/super-admin/stok/basah": "Stok Bahan",
      "/super-admin/stok/riwayat": "Penyesuaian Stok",
      "/super-admin/menu": "Menu Makanan",
      "/super-admin/menu/paket": "Paket Menu",
      "/super-admin/menu/kalender": "Kalender Menu",
      "/super-admin/spk/basah": "Belanja Basah",
      "/super-admin/spk/kering": "Belanja Kering & Pengemas",
      "/super-admin/spk/riwayat": "Riwayat SPK",
      "/super-admin/laporan": "Laporan",
      "/gizi": "Dashboard",
      "/gizi/menu": "Menu Makanan",
      "/gizi/menu/paket": "Paket Menu",
      "/gizi/menu/kalender": "Kalender Menu",
      "/gizi/stok": "Manajemen Stok",
      "/gizi/spk": "SPK Perencanaan",
      "/gizi/laporan": "Laporan",
      "/profil": "Profil",
    };

    if (titleMap[pathname]) {
      return titleMap[pathname];
    }

    const parts = pathname.split("/").filter(Boolean);
    const lastPart = parts.at(-1);

    if (!lastPart) {
      return "Dashboard";
    }

    return lastPart
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }, [pathname]);

  const breadcrumb =
    pathname === "/profil"
      ? "Pengaturan / Profil"
      : `${user?.role?.name ? getRoleLabel(user.role.name) : "Dashboard"} / ${pageTitle}`;
  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SA";

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  function handleOpenProfile() {
    setOpenProfileMenu(false);
    router.push("/profil");
  }

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        event.target instanceof Node &&
        openProfileMenu &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setOpenProfileMenu(false);
      }

      if (
        event.target instanceof Node &&
        openNotif &&
        notifMenuRef.current &&
        !notifMenuRef.current.contains(event.target)
      ) {
        setOpenNotif(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [openNotif, openProfileMenu]);

  return (
    <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6">
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={() => setOpen(true)} type="button">
          Menu
        </button>

        <div>
          <p className="text-xs text-gray-400">{breadcrumb}</p>
          <h1 className="font-semibold text-gray-900">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center rounded-lg bg-gray-100 px-3 py-2 md:flex">
          <Search size={16} className="mr-2 text-gray-400" />
          <input placeholder="Cari..." className="bg-transparent text-sm outline-none" />
        </div>

        <p className="hidden text-sm text-gray-400 md:block">
          {new Intl.DateTimeFormat("id-ID", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date())}
        </p>

        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => {
              setOpenNotif((current) => !current);
              setOpenProfileMenu(false);
            }}
            className="rounded-lg bg-gray-100 p-2"
            type="button"
          >
            <Bell size={18} />
          </button>

          {openNotif && (
            <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
              <p className="mb-2 text-sm font-semibold">Notifikasi</p>

              <div className="space-y-2 text-sm">
                <div className="rounded p-2 hover:bg-gray-50">Permintaan Barang Keluar</div>
                <div className="rounded p-2 hover:bg-gray-50">Stok Hampir Habis</div>
              </div>
            </div>
          )}
        </div>

        <button className="rounded-lg bg-gray-100 p-2 text-gray-700" type="button">
          <Settings size={18} />
        </button>

        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => {
              setOpenProfileMenu((current) => !current);
              setOpenNotif(false);
            }}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
              openProfileMenu ? "bg-[#EEF4FF] text-[#2155CD]" : "bg-gray-100 text-gray-700"
            }`}
            type="button"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              {initials}
            </div>
            <ChevronDown size={16} />
          </button>

          {openProfileMenu && (
            <div className="absolute right-0 mt-2 w-[220px] overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="border-b border-[#E2E8F0] px-4 py-3">
                <p className="text-sm font-semibold text-[#64748B]">{user?.name ?? "Pengguna"}</p>
                <p className="mt-1 text-xs text-[#94A3B8]">{getRoleLabel(user?.role?.name)}</p>
              </div>

              <div className="p-2">
                <button
                  onClick={handleOpenProfile}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-[#16213E] transition hover:bg-[#F8FAFC]"
                  type="button"
                >
                  <UserCircle2 size={18} className="text-[#64748B]" />
                  Profil
                </button>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-[#16213E] transition hover:bg-[#F8FAFC]"
                  type="button"
                >
                  <LogOut size={18} className="text-[#64748B]" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
