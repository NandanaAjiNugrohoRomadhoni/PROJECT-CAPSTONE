"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import sdk from "@/lib";
import { getErrorMessage } from "@/lib/admin-utils";
import DeleteConfirmModal from "@/components/feedback/DeleteConfirmModal";
import SuccessModal from "@/components/feedback/SuccessModal";
import {
  AdminPageHeading,
  MiniActionButton,
  PrimaryAction,
  SurfaceCard,
} from "@/components/admin/ui";

type ModalMode = "create" | "edit" | "delete" | null;

type NoticeState = {
  title: string;
  headline: string;
  message: string;
} | null;

type DishOption = {
  id: number;
  name: string;
};

type MealKey = "siang" | "sore" | "pagi";

type PackageCard = {
  id: number;
  title: string;
  active: boolean;
  meals: Record<MealKey, string | null>;
};

type SlotState = {
  mealTimeId: number | null;
  dishId: number | null;
  dishName: string | null;
};

const mealTone: Record<MealKey, string> = {
  siang: "bg-[#DCEAFE] text-[#0A6DDE]",
  sore: "bg-[#ECE8FF] text-[#7C3AED]",
  pagi: "bg-[#FFF4C7] text-[#D97706]",
};

const mealLabel: Record<MealKey, string> = {
  siang: "SIANG",
  sore: "SORE",
  pagi: "PAGI",
};

const mealOrder: MealKey[] = ["siang", "sore", "pagi"];

function normalizeMealKey(name: string | null | undefined): MealKey | null {
  const normalized = (name ?? "").trim().toLowerCase();

  if (normalized === "siang") {
    return "siang";
  }

  if (normalized === "sore") {
    return "sore";
  }

  if (normalized === "pagi") {
    return "pagi";
  }

  return null;
}

function buildPackageCards(
  menus: Array<{ id: number; name: string }>,
  slots: Array<{
    menu_id: number;
    dish_id: number;
    menu?: { id: number; name: string };
    meal_time?: { id: number; name: string | null };
    dish?: { id: number; name: string | null };
  }>,
): PackageCard[] {
  const groupedSlots = new Map<number, Record<MealKey, string | null>>();

  for (const slot of slots) {
    const mealKey = normalizeMealKey(slot.meal_time?.name);
    if (!mealKey) {
      continue;
    }

    const current = groupedSlots.get(slot.menu_id) ?? {
      siang: null,
      sore: null,
      pagi: null,
    };

    current[mealKey] = slot.dish?.name ?? null;
    groupedSlots.set(slot.menu_id, current);
  }

  return [...menus]
    .sort((left, right) => left.id - right.id)
    .map((menu) => ({
      id: menu.id,
      title: menu.name,
      active: menu.id === 2,
      meals:
        groupedSlots.get(menu.id) ?? {
          siang: null,
          sore: null,
          pagi: null,
        },
    }));
}

export default function PackagesManagerPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<PackageCard[]>([]);
  const [menuOptions, setMenuOptions] = useState<DishOption[]>([]);
  const [menuSlots, setMenuSlots] = useState<
    Array<{
      id: number;
      menu_id: number;
      meal_time_id: number;
      dish_id: number;
      menu?: { id: number; name: string };
      meal_time?: { id: number; name: string | null };
      dish?: { id: number; name: string | null };
    }>
  >([]);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageCard | null>(null);
  const [mealValues, setMealValues] = useState<Record<MealKey, string>>({
    siang: "",
    sore: "",
    pagi: "",
  });
  const [successState, setSuccessState] = useState<NoticeState>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const menuNameToId = useMemo(
    () => new Map(menuOptions.map((option) => [option.name, option.id])),
    [menuOptions],
  );

  async function loadPackages() {
    const [menusResponse, slotsResponse, dishesResponse] = await Promise.all([
      sdk.menus.list(),
      sdk.menus.slots(),
      sdk.dishes.list({
        perPage: 100,
        sortBy: "name",
        sortDir: "ASC",
      }),
    ]);

    const nextPackages = buildPackageCards(
      menusResponse.data ?? [],
      slotsResponse.data ?? [],
    );

    setPackages(nextPackages);
    setMenuSlots(slotsResponse.data ?? []);
    setMenuOptions(
      (dishesResponse.data ?? [])
        .map((dish) => ({
          id: Number(dish.id),
          name: dish.name,
        }))
        .sort((left, right) => left.name.localeCompare(right.name)),
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        await loadPackages();
      } catch (loadError) {
        if (!cancelled) {
          setError(getErrorMessage(loadError, "Gagal memuat data paket menu."));
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  function closeModal() {
    setModalMode(null);
    setSelectedPackage(null);
    setSelectedPackageId(null);
    setIsSubmitting(false);
  }

  function openCreateModal() {
    const firstPackage = packages[0] ?? null;
    setSelectedPackage(firstPackage);
    setSelectedPackageId(firstPackage?.id ?? null);
    setMealValues({
      siang: firstPackage?.meals.siang ?? "",
      sore: firstPackage?.meals.sore ?? "",
      pagi: firstPackage?.meals.pagi ?? "",
    });
    setModalMode("create");
  }

  function openEditModal(item: PackageCard) {
    setSelectedPackage(item);
    setSelectedPackageId(item.id);
    setMealValues({
      siang: item.meals.siang ?? "",
      sore: item.meals.sore ?? "",
      pagi: item.meals.pagi ?? "",
    });
    setModalMode("edit");
  }

  function openDeleteModal(item: PackageCard) {
    setSelectedPackage(item);
    setSelectedPackageId(item.id);
    setModalMode("delete");
  }

  function updateSelectedPackage(packageId: number) {
    const nextPackage = packages.find((item) => item.id === packageId) ?? null;
    setSelectedPackageId(packageId);
    setSelectedPackage(nextPackage);
    setMealValues({
      siang: nextPackage?.meals.siang ?? "",
      sore: nextPackage?.meals.sore ?? "",
      pagi: nextPackage?.meals.pagi ?? "",
    });
  }

  function getSlotState(menuId: number, mealKey: MealKey): SlotState {
    const slot = menuSlots.find(
      (item) =>
        item.menu_id === menuId && normalizeMealKey(item.meal_time?.name) === mealKey,
    );

    return {
      mealTimeId: slot?.meal_time_id ?? null,
      dishId: slot?.dish_id ?? null,
      dishName: slot?.dish?.name ?? null,
    };
  }

  async function savePackage() {
    if (!selectedPackageId) {
      setSuccessState({
        title: "Informasi",
        headline: "Pilih paket terlebih dahulu",
        message: "Backend saat ini hanya mendukung pengaturan paket yang sudah ada.",
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const previousPackages = packages;

    try {
      const conflicts: string[] = [];
      const requests: Promise<unknown>[] = [];

      for (const mealKey of mealOrder) {
        const selectedDishName = mealValues[mealKey];
        if (!selectedDishName) {
          continue;
        }

        const selectedDishId = menuNameToId.get(selectedDishName);
        if (!selectedDishId) {
          continue;
        }

        const slot = getSlotState(selectedPackageId, mealKey);

        if (!slot.mealTimeId) {
          conflicts.push(`${mealLabel[mealKey]} belum memiliki meal time di backend.`);
          continue;
        }

        if (!slot.dishId) {
          setPackages((current) =>
            current.map((item) =>
              item.id === selectedPackageId
                ? {
                    ...item,
                    meals: {
                      ...item.meals,
                      [mealKey]: selectedDishName,
                    },
                  }
                : item,
            ),
          );
          requests.push(
            sdk.menus.assignSlot({
              menu_id: selectedPackageId,
              meal_time_id: slot.mealTimeId,
              dish_id: selectedDishId,
            }),
          );
          continue;
        }

        if (slot.dishId !== selectedDishId) {
          conflicts.push(
            `${mealLabel[mealKey]} sudah terisi ${slot.dishName ?? "menu lain"} dan API backend belum menyediakan update slot.`,
          );
        }
      }

      if (requests.length > 0) {
        await Promise.all(requests);
      }

      await loadPackages();
      router.refresh();

      if (requests.length > 0 && conflicts.length === 0) {
        setSuccessState({
          title: "Berhasil",
          headline:
            modalMode === "create"
              ? "Paket Menu Berhasil Disinkronkan"
              : "Paket Menu Berhasil Diperbarui",
          message:
            modalMode === "create"
              ? `Slot kosong pada ${selectedPackage?.title ?? "paket menu"} berhasil diisi dari backend.`
              : `Perubahan yang didukung backend pada ${selectedPackage?.title ?? "paket menu"} berhasil disimpan.`,
        });
        closeModal();
        return;
      }

      if (requests.length > 0 && conflicts.length > 0) {
        setSuccessState({
          title: "Informasi",
          headline: "Paket menu tersinkron sebagian",
          message: conflicts.join(" "),
        });
        closeModal();
        return;
      }

      setSuccessState({
        title: "Informasi",
        headline: "Belum ada perubahan yang bisa dikirim",
        message:
          conflicts[0] ??
          "Backend saat ini hanya mendukung pengisian slot kosong pada paket menu yang sudah ada.",
      });
      closeModal();
    } catch (saveError) {
      setPackages(previousPackages);
      setError(getErrorMessage(saveError, "Gagal menyimpan paket menu."));
    } finally {
      setIsSubmitting(false);
    }
  }

  function deletePackage() {
    setSuccessState({
      title: "Informasi",
      headline: "Hapus paket menu belum didukung API",
      message:
        "Backend saat ini belum menyediakan endpoint untuk menghapus paket menu, jadi tombol ini belum bisa disinkronkan.",
    });
    closeModal();
  }

  return (
    <>
      <div className="space-y-5">
        <AdminPageHeading
          title="Paket Menu"
          subtitle="Kombinasi menu untuk Siang, Sore, dan Pagi dalam 1 hari"
          action={<PrimaryAction onClick={openCreateModal}>Input Paket Menu</PrimaryAction>}
        />

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {packages.map((item) => (
            <SurfaceCard
              key={item.id}
              className={`overflow-hidden p-0 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.09)] ${
                item.active ? "border-[#3B82F6] shadow-[0_0_0_1px_rgba(59,130,246,0.2)]" : ""
              }`}
            >
              <div className="flex items-center justify-between border-b bg-[#F8FAFC] px-5 py-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-[#16213E]">{item.title}</h3>
                  {item.active ? (
                    <span className="rounded-full bg-[#2155CD] px-2 py-0.5 text-[9px] font-bold text-white">
                      AKTIF
                    </span>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <MiniActionButton onClick={() => openEditModal(item)}>Edit</MiniActionButton>
                  <MiniActionButton tone="danger" onClick={() => openDeleteModal(item)}>
                    Hapus
                  </MiniActionButton>
                </div>
              </div>
              <div className="space-y-2 p-5">
                {mealOrder.map((mealKey) => (
                  <div
                    key={`${item.id}-${mealKey}`}
                    className={`rounded-[8px] px-3 py-2 ${mealTone[mealKey]}`}
                  >
                    <p className="text-[10px] font-bold">{mealLabel[mealKey]}</p>
                    <p className="mt-1 text-sm font-medium text-[#16213E]">
                      {item.meals[mealKey] ?? "Belum diatur"}
                    </p>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          ))}
        </div>
      </div>

      {(modalMode === "create" || modalMode === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"
            onClick={closeModal}
          />

          <div className="animate-modal-enter relative flex max-h-[calc(100vh-3rem)] w-full max-w-[550px] flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.22)]">
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-[22px] font-semibold leading-none text-slate-900">
                  {modalMode === "create" ? "Input Paket Menu" : "Edit Paket Menu"}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Backend saat ini menyinkronkan paket menu melalui slot yang tersedia.
                </p>
              </div>

              <button
                className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-400 transition-all duration-300 ease-out hover:scale-105 hover:bg-slate-200 hover:text-slate-500"
                onClick={closeModal}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-5">
                {modalMode === "create" ? (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Pilih Paket <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-2">
                      <select
                        value={selectedPackageId ?? ""}
                        onChange={(event) => updateSelectedPackage(Number(event.target.value))}
                        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
                      >
                        {packages.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Nama Paket
                    </label>
                    <input
                      value={selectedPackage?.title ?? ""}
                      readOnly
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none"
                    />
                    <p className="mt-2 text-xs text-slate-400">
                      Nama paket mengikuti data backend dan belum bisa diubah lewat API saat ini.
                    </p>
                  </div>
                )}

                <div className="overflow-hidden rounded-[14px] border border-[#D9E3F2]">
                  <div className="border-b border-[#D9E3F2] bg-[#EDF4FF] px-4 py-3">
                    <h3 className="text-base font-semibold text-[#475569]">
                      KOMPOSISI MENU PER SESI
                    </h3>
                    <p className="mt-1 text-sm text-[#94A3B8]">
                      Slot yang masih kosong dapat langsung disinkronkan ke backend.
                    </p>
                  </div>

                  <div className="space-y-4 p-4">
                    {mealOrder.map((mealKey) => {
                      const slotState = selectedPackageId
                        ? getSlotState(selectedPackageId, mealKey)
                        : { dishId: null, dishName: null };

                      return (
                        <div key={mealKey}>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            {mealLabel[mealKey]}
                          </label>
                          <div className="relative">
                            <select
                              value={mealValues[mealKey]}
                              onChange={(event) =>
                                setMealValues((current) => ({
                                  ...current,
                                  [mealKey]: event.target.value,
                                }))
                              }
                              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
                            >
                              <option value="">
                                {slotState.dishName ?? `Pilih menu ${mealLabel[mealKey].toLowerCase()}`}
                              </option>
                              {menuOptions.map((option) => (
                                <option key={`${mealKey}-${option.id}`} value={option.name}>
                                  {option.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={16}
                              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                            />
                          </div>
                          {slotState.dishId ? (
                            <p className="mt-2 text-xs text-amber-600">
                              Slot ini sudah terisi di backend. Pilihan baru hanya bisa disimpan
                              jika backend nanti menyediakan update slot.
                            </p>
                          ) : (
                            <p className="mt-2 text-xs text-emerald-600">
                              Slot ini masih kosong dan bisa langsung disinkronkan.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
              <button
                className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-blue-50"
                onClick={closeModal}
                type="button"
              >
                Batal
              </button>
              <button
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_14px_30px_rgba(37,99,235,0.28)] disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none"
                disabled={isSubmitting}
                onClick={savePackage}
                type="button"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        open={modalMode === "delete"}
        headline="Hapus paket menu ini?"
        description={`Paket menu ${selectedPackage?.title ?? ""} belum bisa dihapus karena backend belum menyediakan endpoint hapus paket menu.`}
        onClose={closeModal}
        onConfirm={deletePackage}
      />

      <SuccessModal
        open={successState !== null}
        title={successState?.title ?? "Informasi"}
        headline={successState?.headline ?? ""}
        message={successState?.message ?? ""}
        onClose={() => setSuccessState(null)}
      />
    </>
  );
}
