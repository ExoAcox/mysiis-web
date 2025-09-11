import { Kelurahan } from "@api/district/metadata";
import { create } from "zustand";

interface StoreAddress<Value> {
    status: DataStatus;
    error: DataError;
    set: (e: Value) => void;
    reset: () => void;
}

const valueDefault = [{ label: "", value: "" }];

interface ProvinsiStore extends StoreAddress<Option<string>[]> {
    provinsi: Option<string>[];
}

export const useProvinsiStore = create<ProvinsiStore>((set) => ({
    provinsi: valueDefault,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, provinsi: data, status: "resolve" })),
    reset: () => set(() => ({ provinsi: valueDefault, status: "idle", error: null })),
}));

interface KabupatenStore extends StoreAddress<Option<string>[]> {
    kabupaten: Option<string>[];
}
export const useKabupatenStore = create<KabupatenStore>((set) => ({
    kabupaten: valueDefault,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, kabupaten: data, status: "resolve" })),
    reset: () => set(() => ({ kabupaten: valueDefault, status: "idle", error: null })),
}));

interface KecamatanStore extends StoreAddress<Option<string>[]> {
    kecamatan: Option<string>[];
}
export const useKecamatanStore = create<KecamatanStore>((set) => ({
    kecamatan: valueDefault,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, kecamatan: data, status: "resolve" })),
    reset: () => set(() => ({ kecamatan: valueDefault, status: "idle", error: null })),
}));

interface KelurahanStore extends StoreAddress<Option<string>[]> {
    kelurahan: Option<string>[];
    listKelurahan: Kelurahan[];
}
export const useKelurahanStore = create<KelurahanStore>((set) => ({
    kelurahan: valueDefault,
    listKelurahan: [],
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, kelurahan: data, status: "resolve" })),
    reset: () => set(() => ({ kelurahan: valueDefault, status: "idle", error: null })),
}));
