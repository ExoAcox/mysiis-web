import { create } from "zustand";

interface StoreMySiista<Value> {
    set: (data: Value) => void;
    reset: () => void;
}

interface Priority extends StoreMySiista<string> {
    priority: string;
    error: object | null;
}

export const usePriority = create<Priority>((set) => ({
    priority: "priority-1",
    error: null,
    set: (data) => set((state) => ({ ...state, priority: data })),
    reset: () => set(() => ({ priority: "priority-1" })),
}));

interface PredictBuilding extends StoreMySiista<string> {
    building: string;
    status: DataStatus;
    error: object | null;
}

export const usePredicBuildingStore = create<PredictBuilding>((set) => ({
    building: "0",
    status: "idle",
    error: null,
    set: (data) => set(() => ({ building: data, status: "resolve" })),
    reset: () => set(() => ({ building: "0", status: "idle" })),
}));

type List = {
    label: string;
    value: string;
};

interface ListSurveyor extends StoreMySiista<List[]> {
    list: List[];
    status: DataStatus;
    error: object | null;
}

export const useListSurveyor = create<ListSurveyor>((set) => ({
    list: [{ label: "", value: "" }],
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, list: data, status: "resolve" })),
    reset: () => set(() => ({ list: [{ label: "", value: "" }], status: "idle" })),
}));

interface ObjectBody {
    tahap_survey: string;
    name: string;
    prioritas: number;
    treg: string;
    witel: string;
    id_desa: string;
    street: string;
    address: string;
    postal: string;
    desa: string;
    kecamatan: string;
    kabupaten: string;
    provinsi: string;
    lat: number;
    lon: number;
    keterangan: string;
    surveyor: string;
    target_household: string;
    user: string;
}
interface BodyStore extends StoreMySiista<object> {
    body: ObjectBody;
    status: DataStatus;
    error: object | null;
}

export const dataListBody = {
    tahap_survey: "",
    name: "",
    prioritas: 1,
    treg: "",
    witel: "",
    id_desa: "",
    street: "",
    address: "",
    postal: "",
    desa: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    lat: 0,
    lon: 0,
    keterangan: "",
    surveyor: "",
    target_household: "",
    user: "",
};

export const useBodyStore = create<BodyStore>((set) => ({
    body: dataListBody,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ body: { ...state.body, ...data }, status: "resolve" })),
    reset: () => set(() => ({ body: dataListBody, status: "idle" })),
}));
