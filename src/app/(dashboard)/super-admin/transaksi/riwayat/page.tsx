"use client";

export default function Page() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-[22px] font-semibold text-gray-900">
          Riwayat Transaksi Barang
        </h1>
        <p className="text-sm text-gray-400">
          Riwayat transaksi barang masuk & keluar
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        {/* FILTER */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-200 bg-[#F9FAFB]">

          <div className="flex flex-wrap gap-3">

            <input
              placeholder="Cari Bahan"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-[200px]"
            />

            <input
              type="date"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />

            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>Semua Jenis</option>
            </select>

            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>Semua Status</option>
            </select>

          </div>

          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm hover:bg-blue-50">
            Export Riwayat
          </button>

        </div>

        {/* TABLE */}
        <div>

          {/* HEADER */}
          <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold text-gray-500 bg-[#F1F5F9]">
            <div className="col-span-2">ID Transaksi</div>
            <div className="col-span-2">Tanggal</div>
            <div className="col-span-3">Nama Bahan</div>
            <div className="col-span-2">Jenis Bahan</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-center">Aksi</div>
          </div>

          {/* ROWS */}
          {data.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-12 px-4 py-3 text-sm border-t items-center hover:bg-gray-50"
            >
              <div className="col-span-2 font-medium text-gray-800">
                {item.id}
              </div>

              <div className="col-span-2 text-gray-600">
                {item.tanggal}
              </div>

              <div className="col-span-3 font-medium text-gray-800">
                {item.nama}
              </div>

              <div className="col-span-2 text-gray-600">
                {item.jenis}
              </div>

              <div className="col-span-1">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    item.status === "Masuk"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="col-span-2 flex justify-center gap-2">
                <button className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                  Detail
                </button>
                <button className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                  Edit
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 text-sm text-gray-400">

          <span>1–10 dari 52 item</span>

          <div className="flex items-center gap-2">

            <button className="px-2 py-1 border rounded">‹</button>

            <button className="px-3 py-1 bg-blue-600 text-white rounded">
              1
            </button>

            <button className="px-3 py-1 border rounded">2</button>
            <button className="px-3 py-1 border rounded">3</button>
            <button className="px-3 py-1 border rounded">4</button>

            <button className="px-2 py-1 border rounded">›</button>

          </div>
        </div>

      </div>
    </div>
  );
}



/* ================= MOCK DATA ================= */

const data = [
  {
    id: "TR-0033",
    tanggal: "10-03-2026",
    nama: "Ayam, Kentang, Timun +5 lagi",
    jenis: "BASAH",
    status: "Keluar",
  },
  {
    id: "TR-0290",
    tanggal: "09-03-2026",
    nama: "Bakso Sapi, Kentang, Timun +5 lagi",
    jenis: "BASAH",
    status: "Masuk",
  },
  {
    id: "TR-0001",
    tanggal: "12-03-2026",
    nama: "Beras, Gula, Garam, Tepung +5 lagi",
    jenis: "KERING",
    status: "Keluar",
  },
];