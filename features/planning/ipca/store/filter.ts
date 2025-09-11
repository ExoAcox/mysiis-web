
import { create } from "zustand";

interface StoreData {
  filter: Filter;
  status: DataStatus;
  error: DataError;
  set: (data: Filter) => void;
  reset: () => void;
}

interface Filter {
  regional: string;
  witel: string;
}

const defaultData: Filter = {
  regional: '',
  witel: ''
}


export const useFilterStore = create<StoreData>((set) => ({
  filter: defaultData,
  status: 'idle',
  error: null,
  set: (data: Filter) => set(() => ({ filter: data })),
  reset: () => set({ filter: defaultData })
}));

type DataSource = 'odp' | 'building'

interface StoreSource {
  source: DataSource
  set: (data: DataSource) => void;
  reset: () => void;
}

export const useSource = create<StoreSource>((set) => ({
  source: 'odp',
  set: (data: DataSource) => set(() => ({ source: data })),
  reset: () => set({ source: 'odp' })
}));