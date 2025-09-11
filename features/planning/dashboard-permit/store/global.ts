import { create } from "zustand";

export interface UserDataStore {
    telkom_regional: string;
    telkom_witel: string[];
    regional: string;
    witel: string[];
    vendor: string;
    role: string;
    set: (data: object) => void;
    reset: () => void;
}

const userDataDefaultValue = {
    role: "",
    telkom_regional: "",
    telkom_witel: [],
    regional: "",
    witel: [],
    vendor: "",
};

export const useUserDataStore = create<UserDataStore>((set) => ({
    ...userDataDefaultValue,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, ...userDataDefaultValue })),
}));
