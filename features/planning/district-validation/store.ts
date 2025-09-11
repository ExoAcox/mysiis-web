import { create } from "zustand";
import { Kelurahan as Kelurahan_, Ncx, Street } from "@api/district/metadata";

const locationData: Kelurahan = {
    kode_desa_dagri: "",
    kelurahan: "",
    kecamatan: "",
    kota: "",
    provinsi: "",
    regional: "",
    witel: "",
    streetAddress: "",
    lat: 0,
    long: 0,
};

interface Kelurahan extends Kelurahan_ {
    streetAddress?: string;
}

export const useLocationStore = create<Store<Kelurahan>>((set) => ({
    data: locationData,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, data: locationData, status: "idle", error: null })),
}));

const ncxLocation = {
    googleAddress: { kelurahan: "", kecamatan: "", kota: "", provinsi: "" },
    addressNcx: { kelurahan: "", kecamatan: "", kota: "", provinsi: "" },
    ncx_pendekatan: { kelurahan: "", kecamatan: "", kota: "", provinsi: "" },
};

export const useNcxStore = create<Store<Ncx>>((set) => ({
    data: ncxLocation,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, data: ncxLocation, status: "idle", error: null })),
}));

export const streetDefaultValue = {
    lat: 0,
    long: 0,
    radius: 0,
    geom: "",
    kecamatan: "",
    kelurahan: "",
    kode_desa_dagri: "",
    kota: "",
    provinsi: "",
    st_name: "",
    multiline: true,
};

export const useStreetStore = create<Store<Street>>((set) => ({
    data: streetDefaultValue,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, data: streetDefaultValue, status: "idle", error: null })),
}));

interface RadiusStore {
    radius: number;
    set: (data: object) => void;
    reset: () => void;
}

export const useRadiusStore = create<RadiusStore>((set) => ({
    radius: 200,
    set: (data) => set(data),
    reset: () => set({ radius: 200 }),
}));

export const useStreetCountStore = create<Store<number>>((set) => ({
    data: 0,
    status: "idle",
    error: null,
    set: (data) => set(data),
    reset: () => set({ data: 0, status: "idle", error: null }),
}));
