"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";
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

type IngredientRow = {
  localId: number;
  compositionId?: number;
  item_id: number | null;
  qty_per_patient: string;
  unit?: string;
};

type FoodMenu = {
  id: number;
  name: string;
  description: string;
  ingredients: IngredientRow[];
};

type ModalMode = "create" | "detail" | "edit" | "delete" | null;

type SuccessState = {
  headline: string;
  message: string;
} | null;

type ItemRecord = Awaited<ReturnType<typeof sdk.items.list>>["data"][number];

export default function Page() {
  const router = useRouter();
  const [menus, setMenus] = useState<FoodMenu[]>([]);
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedMenu, setSelectedMenu] = useState<FoodMenu | null>(null);
  const [menuName, setMenuName] = useState("");
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { localId: 1, item_id: null, qty_per_patient: "0" },
  ]);
  const [successState, setSuccessState] = useState<SuccessState>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadMenus();
  }, []);

  async function loadMenus() {
    setLoading(true);
    setError(null);

    try {
      const [dishesResponse, firstCompositionResponse, itemsResponse] = await Promise.all([
        sdk.dishes.list({ perPage: 100, sortBy: "name", sortDir: "ASC" }),
        sdk.dishCompositions.list({ perPage: 100, sortBy: "id", sortDir: "ASC" }),
        sdk.items.list({ perPage: 100, sortBy: "name", sortDir: "ASC", is_active: true }),
      ]);

      const allCompositions = [...(firstCompositionResponse.data ?? [])];
      const totalPages = firstCompositionResponse.meta?.totalPages ?? 1;

      if (totalPages > 1) {
        const remainingPages = Array.from({ length: totalPages - 1 }, (_, index) => index + 2);
        const remainingResponses = await Promise.all(
          remainingPages.map((page) =>
            sdk.dishCompositions.list({ page, perPage: 100, sortBy: "id", sortDir: "ASC" }),
          ),
        );

        for (const response of remainingResponses) {
          allCompositions.push(...(response.data ?? []));
        }
      }

      const itemMap = new Map((itemsResponse.data ?? []).map((item) => [Number(item.id), item]));
      const compositionMap = new Map<number, IngredientRow[]>();

      for (const composition of allCompositions) {
        const dishId = Number(composition.dish_id);
        const itemId = Number(composition.item_id);
        const group = compositionMap.get(dishId) ?? [];
        const relatedItem = itemMap.get(itemId);
        group.push({
          localId: composition.id,
          compositionId: composition.id,
          item_id: itemId,
          qty_per_patient: composition.qty_per_patient,
          unit: relatedItem?.unit_base ?? composition.item?.unit_base ?? undefined,
        });
        compositionMap.set(dishId, group);
      }

      const nextMenus = (dishesResponse.data ?? []).map((dish) => {
        const dishId = Number(dish.id);
        const menuIngredients = compositionMap.get(dishId) ?? [];

        return {
          id: dishId,
          name: dish.name,
          description: buildCompositionSummary(menuIngredients, itemMap),
          ingredients: menuIngredients,
        };
      });

      setItems(itemsResponse.data ?? []);
      setMenus(nextMenus);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Gagal memuat menu makanan."));
    } finally {
      setLoading(false);
    }
  }

  const itemOptions = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        label: item.name,
        unit: item.unit_base,
      })),
    [items],
  );

  function openCreateModal() {
    setModalMode("create");
    setSelectedMenu(null);
    setMenuName("");
    setIngredients([{ localId: Date.now(), item_id: null, qty_per_patient: "0" }]);
  }

  function openDetailModal(menu: FoodMenu) {
    setSelectedMenu(menu);
    setModalMode("detail");
  }

  function openEditModal(menu: FoodMenu) {
    setSelectedMenu(menu);
    setMenuName(menu.name);
    setIngredients(
      menu.ingredients.length > 0
        ? menu.ingredients.map((item, index) => ({ ...item, localId: item.localId || index + 1 }))
        : [{ localId: Date.now(), item_id: null, qty_per_patient: "0" }],
    );
    setModalMode("edit");
  }

  function openDeleteModal(menu: FoodMenu) {
    setSelectedMenu(menu);
    setModalMode("delete");
  }

  function closeModal() {
    if (saving) return;
    setModalMode(null);
    setSelectedMenu(null);
  }

  function addIngredientRow() {
    setIngredients((current) => [
      ...current,
      { localId: Date.now(), item_id: null, qty_per_patient: "0" },
    ]);
  }

  function removeIngredientRow(localId: number) {
    setIngredients((current) =>
      current.length === 1 ? current : current.filter((row) => row.localId !== localId),
    );
  }

  async function saveMenu() {
    setSaving(true);
    setError(null);
    const previousMenus = menus;

    try {
      const validRows = ingredients.filter(
        (row) => row.item_id !== null && Number(row.qty_per_patient) > 0,
      );
      if (menuName.trim() === "") throw new Error("Nama menu wajib diisi.");
      if (validRows.length === 0) throw new Error("Minimal satu komposisi bahan harus diisi.");
      const itemMap = new Map(items.map((item) => [Number(item.id), item]));

      if (modalMode === "create") {
        setMenus((current) => [
          ...current,
          {
            id: Date.now(),
            name: menuName.trim(),
            description: buildCompositionSummary(validRows, itemMap),
            ingredients: validRows,
          },
        ]);
        const createdDish = await sdk.dishes.create({ name: menuName.trim() });
        const dishId = createdDish.data.id;

        await Promise.all(
          validRows.map((row) =>
            sdk.dishCompositions.create({
              dish_id: dishId,
              item_id: row.item_id as number,
              qty_per_patient: row.qty_per_patient,
            }),
          ),
        );

        setSuccessState({
          headline: "Menu Makanan Berhasil Ditambahkan",
          message: `Menu ${menuName.trim()} berhasil ditambahkan.`,
        });
      }

      if (modalMode === "edit" && selectedMenu) {
        setMenus((current) =>
          current.map((menu) =>
            menu.id === selectedMenu.id
              ? {
                  ...menu,
                  name: menuName.trim(),
                  description: buildCompositionSummary(validRows, itemMap),
                  ingredients: validRows,
                }
              : menu,
          ),
        );
        await sdk.dishes.update(selectedMenu.id, { name: menuName.trim() });

        const existing = menus.find((menu) => menu.id === selectedMenu.id)?.ingredients ?? [];
        const existingIds = new Set(existing.map((row) => row.compositionId).filter(Boolean) as number[]);
        const nextIds = new Set(validRows.map((row) => row.compositionId).filter(Boolean) as number[]);

        const toDelete = [...existingIds].filter((id) => !nextIds.has(id));
        await Promise.all(toDelete.map((id) => sdk.dishCompositions.delete(id)));

        for (const row of validRows) {
          if (row.compositionId) {
            await sdk.dishCompositions.update(row.compositionId, {
              dish_id: selectedMenu.id,
              item_id: row.item_id as number,
              qty_per_patient: row.qty_per_patient,
            });
          } else {
            await sdk.dishCompositions.create({
              dish_id: selectedMenu.id,
              item_id: row.item_id as number,
              qty_per_patient: row.qty_per_patient,
            });
          }
        }

        setSuccessState({
          headline: "Menu Makanan Berhasil Diedit",
          message: `Menu ${menuName.trim()} berhasil diperbarui.`,
        });
      }

      await loadMenus();
      router.refresh();
      closeModal();
    } catch (saveError) {
      setMenus(previousMenus);
      setError(getErrorMessage(saveError, "Gagal menyimpan menu makanan."));
    } finally {
      setSaving(false);
    }
  }

  async function deleteMenu() {
    if (!selectedMenu) return;

    setSaving(true);
    setError(null);
    const previousMenus = menus;
    setMenus((current) => current.filter((menu) => menu.id !== selectedMenu.id));
    try {
      for (const ingredient of selectedMenu.ingredients) {
        if (ingredient.compositionId) {
          await sdk.dishCompositions.delete(ingredient.compositionId);
        }
      }

      await sdk.client.request({
        method: "DELETE",
        path: `/dishes/${selectedMenu.id}`,
      });

      setSuccessState({
        headline: "Menu Makanan Berhasil Dihapus",
        message: `Menu ${selectedMenu.name} dihapus dari sistem.`,
      });
      await loadMenus();
      router.refresh();
      closeModal();
    } catch (deleteError) {
      setMenus(previousMenus);
      setError(getErrorMessage(deleteError, "Gagal menghapus menu makanan."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="space-y-5">
        <AdminPageHeading
          title="Menu Makanan"
          subtitle="Kelola daftar menu makanan"
          action={<PrimaryAction onClick={openCreateModal}>Tambah Menu Makanan</PrimaryAction>}
        />

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <SurfaceCard className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 border-b bg-[#F8FAFC] px-5 py-4">
            <div className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-400 lg:w-[240px]">
              Cari nama menu
            </div>
            <span className="ml-auto text-xs text-[#94A3B8]">{menus.length} menu</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-[#F1F5F9] text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Nama Menu</th>
                  <th className="px-4 py-3">Deskripsi</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white text-sm text-gray-700">
                {menus.map((menu) => (
                  <tr key={menu.id} className="border-t border-gray-200 transition hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{menu.name}</td>
                    <td className="px-6 py-4 text-gray-700">{menu.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <MiniActionButton onClick={() => openDetailModal(menu)}>Detail</MiniActionButton>
                        <MiniActionButton onClick={() => openEditModal(menu)}>Edit</MiniActionButton>
                        <MiniActionButton tone="danger" onClick={() => openDeleteModal(menu)}>
                          Hapus
                        </MiniActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && menus.length === 0 ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-gray-400" colSpan={3}>
                      Belum ada menu makanan.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t bg-[#F8FAFC] px-6 py-3 text-xs text-gray-400">
            <span>
              {menus.length === 0 ? 0 : 1}-{menus.length} dari {menus.length}
            </span>
          </div>
        </SurfaceCard>
      </div>

      {(modalMode === "create" || modalMode === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]" onClick={closeModal} />
          <div className="animate-modal-enter relative flex max-h-[calc(100vh-3rem)] w-full max-w-[620px] flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-[22px] font-semibold text-slate-900">
                  {modalMode === "create" ? "Tambah Menu Makanan" : "Edit Menu Makanan"}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {modalMode === "create"
                    ? "Isi detail menu dan komposisi bahan"
                    : "Ubah nama dan komposisi bahan"}
                </p>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-400" onClick={closeModal} type="button">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Nama Menu <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={menuName}
                    onChange={(event) => setMenuName(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-700 outline-none"
                    placeholder="Masukkan nama menu"
                  />
                </div>

                <div className="rounded-[12px] bg-[#EDF4FF] px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#2155CD]">Deskripsi</p>
                  <p className="mt-1 text-sm text-slate-700">
                    Deskripsi menu dibentuk otomatis dari komposisi bahan yang tersimpan di backend.
                  </p>
                </div>

                <div className="overflow-hidden rounded-[14px] border border-[#D9E3F2]">
                  <div className="border-b border-[#D9E3F2] bg-[#EDF4FF] px-4 py-3">
                    <h3 className="text-base font-semibold text-[#475569]">KOMPOSISI BAHAN</h3>
                    <p className="mt-1 text-sm text-[#94A3B8]">Pilih bahan dari stok yang tersedia</p>
                  </div>

                  <div className="space-y-4 p-4">
                    {ingredients.map((row) => (
                      <div key={row.localId} className="rounded-[12px] border border-[#D9E3F2] bg-[#F8FAFC] p-4">
                        <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_auto] md:items-end">
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Nama Bahan</label>
                            <select
                              value={row.item_id ?? ""}
                              onChange={(event) => {
                                const nextItemId = Number(event.target.value) || null;
                                const nextItem = itemOptions.find((item) => item.id === nextItemId);
                                setIngredients((current) =>
                                  current.map((item) =>
                                    item.localId === row.localId
                                      ? { ...item, item_id: nextItemId, unit: nextItem?.unit }
                                      : item,
                                  ),
                                );
                              }}
                              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
                            >
                              <option value="">Pilih Bahan</option>
                              {itemOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Standar Porsi</label>
                            <div className="flex items-center gap-2">
                              <input
                                value={row.qty_per_patient}
                                onChange={(event) =>
                                  setIngredients((current) =>
                                    current.map((item) =>
                                      item.localId === row.localId
                                        ? { ...item, qty_per_patient: event.target.value }
                                        : item,
                                    ),
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
                              />
                              <span className="text-sm text-slate-400">{row.unit ?? "-"}</span>
                            </div>
                          </div>

                          <button
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            onClick={() => removeIngredientRow(row.localId)}
                            type="button"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#2155CD] px-4 py-3 text-sm font-semibold text-[#2155CD] transition hover:bg-[#EEF4FF]"
                      onClick={addIngredientRow}
                      type="button"
                    >
                      <Plus size={16} />
                      Tambah Baris Bahan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
              <button className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600" onClick={closeModal} type="button">
                Batal
              </button>
              <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white" onClick={saveMenu} type="button" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalMode === "detail" && selectedMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]" onClick={closeModal} />
          <div className="animate-modal-enter relative flex max-h-[calc(100vh-3rem)] w-full max-w-[520px] flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-[22px] font-semibold text-slate-900">{selectedMenu.name}</h2>
              <button className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-400" onClick={closeModal} type="button">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-4">
                <div className="rounded-[12px] bg-[#EDF4FF] px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#2155CD]">Deskripsi</p>
                  <p className="mt-1 text-sm text-slate-700">{selectedMenu.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Komposisi Bahan</h3>
                  <div className="mt-2 overflow-hidden rounded-[12px] border border-[#E2E8F0]">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#F1F5F9] text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        <tr>
                          <th className="px-4 py-3">#</th>
                          <th className="px-4 py-3">Nama Bahan</th>
                          <th className="px-4 py-3">Standar Porsi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedMenu.ingredients.map((item, index) => {
                          const relatedItem = itemOptions.find((option) => option.id === item.item_id);
                          return (
                            <tr key={`${item.localId}-${index}`} className="border-t border-gray-200">
                              <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                              <td className="px-4 py-3 font-medium text-gray-900">{relatedItem?.label ?? "-"}</td>
                              <td className="px-4 py-3 text-slate-600">
                                {item.qty_per_patient} {item.unit ?? relatedItem?.unit ?? ""}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 px-5 py-4">
              <button className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600" onClick={closeModal} type="button">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        open={modalMode === "delete"}
        headline="Hapus menu makanan ini?"
        description={`Menu ${selectedMenu?.name ?? ""} akan dihapus permanen dari sistem.`}
        onClose={closeModal}
        onConfirm={deleteMenu}
      />

      <SuccessModal
        open={successState !== null}
        title="Berhasil"
        headline={successState?.headline ?? ""}
        message={successState?.message ?? ""}
        onClose={() => setSuccessState(null)}
      />
    </>
  );
}

function buildCompositionSummary(
  rows: IngredientRow[],
  itemMap: Map<number, ItemRecord>,
) {
  if (rows.length === 0) {
    return "Belum ada komposisi bahan.";
  }

  const names = rows
    .map((row) => (row.item_id !== null ? itemMap.get(row.item_id)?.name ?? null : null))
    .filter((name): name is string => Boolean(name));

  if (names.length === 0) {
    return "Belum ada komposisi bahan.";
  }

  if (names.length <= 3) {
    return names.join(", ");
  }

  return `${names.slice(0, 3).join(", ")} +${names.length - 3} lagi`;
}
