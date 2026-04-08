import StatCard from "@/components/dashboard/StatCard";
import BahanTable from "@/components/dashboard/BahanTable";
import StockSummary from "@/components/dashboard/StockSummary";
import PatientChart from "@/components/ui/PatientChart";


import {
  Users,
  Utensils,
  AlertTriangle,
  ShoppingCart,
} from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-400">
          Ringkasan operasional instalasi gizi hari ini
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pasien Hari Ini"
          value="40"
          subtitle="+2.5% dari kemarin"
          color="border-blue-500"
          icon={<Users className="text-gray-500" />}
        />

        <StatCard
          title="Menu Aktif"
          value="Paket 2"
          subtitle="Menu hari ini"
          color="border-green-500"
          icon={<Utensils className="text-gray-500" />}
        />

        <StatCard
          title="Stok Kritis"
          value="3"
          subtitle="Butuh restock"
          color="border-red-500"
          icon={<AlertTriangle className="text-gray-500" />}
        />

        <StatCard
          title="SPK Belanja"
          value="12"
          subtitle="Rekomendasi sistem"
          color="border-yellow-500"
          icon={<ShoppingCart className="text-gray-500" />}
        />
      </div>

      {/* TABLE + CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <BahanTable />

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">
            Tren Pasien 7 Hari
          </h3>

          <PatientChart />

          <div className="flex justify-between text-sm text-gray-400 mt-3">
            <span>Rata-rata: 30</span>
            <span>Tertinggi: 55</span>
            <span>Terendah: 15</span>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StockSummary />
      </div>

    </div>
  );
}