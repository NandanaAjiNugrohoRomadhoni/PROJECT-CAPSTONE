"use client";

import type { ReactNode } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
} from "lucide-react";

export function AdminPageHeading({
  title,
  subtitle,
  action,
}: Readonly<{
  title: string;
  subtitle: string;
  action?: ReactNode;
}>) {
  return (
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h2 className="text-[22px] font-semibold text-[#16213E]">{title}</h2>
        <p className="mt-1 text-base text-[#94A3B8]">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function PrimaryAction({
  children,
  onClick,
  type = "button",
  className = "",
}: Readonly<{
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}>) {
  return (
    <button
      className={`rounded-lg bg-[#2155CD] px-4 py-2.5 text-base font-medium text-white shadow-[0_10px_24px_rgba(33,85,205,0.24)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(33,85,205,0.28)] ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export function OutlineAction({
  children,
  onClick,
}: Readonly<{
  children: ReactNode;
  onClick?: () => void;
}>) {
  return (
    <button
      className="rounded-lg border border-[#2155CD] bg-white px-4 py-2.5 text-base font-medium text-[#2155CD] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#EEF4FF]"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function SurfaceCard({
  children,
  className = "",
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={`rounded-[18px] border border-[#D7E0EE] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

export function FilterSearch({
  placeholder,
}: Readonly<{
  placeholder: string;
}>) {
  return (
    <div className="flex h-10 items-center gap-2 rounded-[9px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[#94A3B8]">
      <Search size={14} />
      <input
        className="w-full bg-transparent text-base text-[#334155] outline-none placeholder:text-[#94A3B8]"
        placeholder={placeholder}
        readOnly
      />
    </div>
  );
}

export function FilterSelect({
  label,
}: Readonly<{
  label: string;
}>) {
  return (
    <button
      className="flex h-10 min-w-[124px] items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-base text-[#334155] transition-colors duration-200 hover:bg-white"
      type="button"
    >
      <span>{label}</span>
      <ChevronRight size={14} className="rotate-90 text-[#64748B]" />
    </button>
  );
}

export function FilterDate() {
  return (
    <button
      className="flex h-10 min-w-[140px] items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-base text-[#94A3B8] transition-colors duration-200 hover:bg-white"
      type="button"
    >
      <span>dd/mm/yyyy</span>
      <CalendarDays size={14} className="text-[#64748B]" />
    </button>
  );
}

export function ExportButton({
  children = "Export Data",
}: Readonly<{
  children?: ReactNode;
}>) {
  return (
    <button
      className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#2155CD] bg-white px-4 text-base font-medium text-[#2155CD] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#EEF4FF]"
      type="button"
    >
      <Download size={14} />
      {children}
    </button>
  );
}

export function MiniActionButton({
  children,
  tone = "neutral",
  onClick,
  type = "button",
}: Readonly<{
  children: ReactNode;
  tone?: "neutral" | "danger";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}>) {
  const toneClass =
    tone === "danger"
      ? "bg-[#FFF1F2] text-[#EF4444] hover:bg-[#FFE4E6]"
      : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]";

  return (
    <button
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 ${toneClass}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export function StatusPill({
  children,
  tone = "safe",
}: Readonly<{
  children: ReactNode;
  tone?: "safe" | "warning" | "critical" | "danger";
}>) {
  const palette: Record<string, string> = {
    safe: "bg-[#DCFCE7] text-[#16A34A]",
    warning: "bg-[#FEF3C7] text-[#F59E0B]",
    critical: "bg-[#FEE2E2] text-[#EF4444]",
    danger: "bg-[#E2E8F0] text-[#334155]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${palette[tone]}`}
    >
      {children}
    </span>
  );
}

export function Pagination({
  totalLabel,
}: Readonly<{
  totalLabel: string;
}>) {
  return (
    <div className="flex items-center justify-between border-t bg-[#F8FAFC] px-6 py-3 text-xs text-gray-400">
      <span>{totalLabel}</span>
      <div className="flex items-center gap-2">
        <button
          className="rounded-lg bg-gray-100 px-2 py-1 text-gray-600"
          type="button"
        >
          <ChevronLeft size={12} />
        </button>
        <button
          className="rounded-lg bg-blue-600 px-3 py-1 text-white"
          type="button"
        >
          1
        </button>
        <button
          className="rounded-lg bg-gray-100 px-2 py-1 text-gray-600"
          type="button"
        >
          2
        </button>
        <button
          className="rounded-lg bg-gray-100 px-2 py-1 text-gray-600"
          type="button"
        >
          3
        </button>
        <button
          className="rounded-lg bg-gray-100 px-2 py-1 text-gray-600"
          type="button"
        >
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}
