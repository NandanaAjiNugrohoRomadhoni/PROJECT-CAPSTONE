"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Settings,
  Package,
  ClipboardList,
  Utensils,
  ChevronDown,
} from "lucide-react";

type SubMenu = {
  name: string;
  path: string;
};

type MenuItem = {
  name: string;
  path?: string;
  icon: LucideIcon;
  children?: SubMenu[];
};

const menuConfig: Record<string, MenuItem[]> = {
  super_admin: [
    { name: "Dashboard", path: "/super-admin", icon: LayoutDashboard },

    { name: "Manajemen Pengguna", path: "/super-admin/users", icon: Users },

    {
      name: "Konfigurasi Master Data",
      icon: Settings,
      children: [
        {
          name: "Data Jenis Bahan",
          path: "/super-admin/master-data/jenis",
        },
        {
          name: "Data Satuan",
          path: "/super-admin/master-data/satuan",
        },
      ],
    },

    {
      name: "Manajemen Transaksi",
      icon: Package,
      children: [
        {
          name: "Barang Masuk",
          path: "/super-admin/transaksi/masuk",
        },
        {
          name: "Barang Keluar",
          path: "/super-admin/transaksi/keluar",
        },
        {
          name: "Riwayat Transaksi Barang",
          path: "/super-admin/transaksi/riwayat",
        },
      ],
    },
  ],

  gudang: [
    { name: "Dashboard", path: "/gudang", icon: LayoutDashboard },
    { name: "Transaksi", path: "/gudang/transaksi", icon: ClipboardList },
  ],

  gizi: [
    { name: "Dashboard", path: "/gizi", icon: LayoutDashboard },
    { name: "Menu", path: "/gizi/menu", icon: Utensils },
  ],
};

export default function Sidebar({ open, setOpen }: any) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // 🔥 ROLE HANDLER
  const validRoles = ["super_admin", "gudang", "gizi"];

  let role = "super_admin";

  if (validRoles.includes(user?.role)) {
    role = user.role;
  } else {
    if (pathname.startsWith("/gudang")) role = "gudang";
    if (pathname.startsWith("/gizi")) role = "gizi";
  }

  const menus = menuConfig[role];

  return (
    <>
      {/* OVERLAY MOBILE */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 w-64 h-screen bg-[#0F172A] text-white p-5 flex flex-col overflow-y-auto transform transition-transform z-50
        ${open ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        {/* LOGO */}
        <div className="mb-6">
          {/* kalau pakai logo */}
          {/* <img src="/logo.png" className="w-10 mb-2" /> */}
          <h1 className="text-lg font-bold">RSD Balung</h1>
        </div>

        {/* MENU TITLE */}
        <p className="text-xs text-gray-400 mb-2">MENU</p>

        {/* MENU LIST */}
        <ul className="space-y-1">
          {menus.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.path && pathname === item.path;

            const isChildActive =
              item.children?.some((sub) =>
                pathname.startsWith(sub.path)
              ) || false;

            const isOpen =
              openMenu === item.name || isChildActive;

            // =========================
            // 🔥 MENU TANPA CHILD
            // =========================
            if (!item.children) {
              return (
                <li key={item.name}>
                  <Link
                    href={item.path!}
                    className={`flex items-center gap-3 p-2 rounded-xl text-sm transition
                    ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-blue-900"
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                </li>
              );
            }

            // =========================
            // 🔥 MENU DENGAN CHILD
            // =========================
            return (
              <li key={item.name}>
                <button
                  onClick={() =>
                    setOpenMenu(isOpen ? null : item.name)
                  }
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-sm transition
                  ${
                    isChildActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-blue-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    {item.name}
                  </div>

                  <ChevronDown
                    size={16}
                    className={`transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* SUBMENU */}
                {isOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((sub) => {
                      const activeSub =
                        pathname === sub.path;

                      return (
                        <Link
                          key={sub.path}
                          href={sub.path}
                          className={`block text-sm px-2 py-1 rounded transition
                          ${
                            activeSub
                              ? "text-white font-medium"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* USER INFO */}
        <div className="mt-auto pt-6 border-t border-gray-700">
          <div className="flex items-center gap-2 mt-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm">
              {user?.name?.charAt(0) || "S"}
            </div>

            <div>
              <p className="text-sm font-semibold">
                {user?.name || "Super Admin"}
              </p>

              <p className="text-xs text-gray-400 capitalize">
                {role.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}