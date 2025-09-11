import { create } from "zustand";

import { User } from "@api/account/user";
import { Notification } from "@api/notification";

interface ProfileStore {
    ready: boolean;
    data: User;
    set: (data: object) => void;
    reset: () => void;
}

export const profileDefaultValue: User = {
    userId: "",
    fullname: "",
    status: "verified",
    role_keys: [],
    permission_keys: [],
    customdata: { 
        regional: "", 
        witel: "", 
        vendor: "", 
        tsel_region_branch: [{
            region: "",
            branch: "",
            vendor: ""
        }]
    },
};

export const useProfileStore = create<ProfileStore>((set) => ({
    ready: false,
    data: profileDefaultValue,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set({ ready: false, data: profileDefaultValue }),
}));

interface NotificationStore {
    status: DataStatus;
    data: Notification[];
    unreadCount: number;
    error: DataError | null;
    set: (data: object) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    status: "idle",
    data: [],
    unreadCount: 0,
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
}));

// ========--------------

export interface ModalStore {
    visible: boolean;
    data: unknown;
}

const modalStoreCache = new Map();
export const useModalStore = (id: string) => {
    let store = modalStoreCache.get(id);
    if (!store) {
        store = create<ModalStore>(() => ({
            visible: false,
            data: {},
        }));
        modalStoreCache.set(id, store);
    }
    return store;
};

// ========--------------

export const useMapsSearchBoxStore = create<Store<AutocompletePrediction[]>>((set) => ({
    data: [],
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, data: [], status: "idle", error: null })),
}));
