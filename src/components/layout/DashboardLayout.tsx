"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      
      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:ml-64 bg-[#F5F7FB] min-h-screen">
        <Navbar setOpen={setOpen} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}