import { useEffect, useMemo, useState } from "react";

import { getWitel, getRegional } from "@api/district/network";

import useFetch from "@hooks/useFetch";

import {
    regionalListFormat,
    witelListFormat,
} from "@features/planning/dashboard-permit/functions/common";
import { useFilterStore } from "@features/planning/dashboard-permit/store/dashboard";
import { useUserDataStore } from "@features/planning/dashboard-permit/store/global";

import { DateRangePicker } from "@components/calendar";
import { Dropdown } from "@components/dropdown";
import { TextField } from "@components/input";

let debounce: NodeJS.Timeout;

const optionsStatusPermit = [
    { label: "Permit Approved", value: "approved"},
    { label: "Permit Process", value: "process"},
    { label: "Permit Rejected", value: "rejected"}
];

const FilterBar: React.FC<{ user: User }> = ({ user }) => {
    const userDataStore = useUserDataStore();
    const filterStore = useFilterStore();
    const { regional, witel, startDate, endDate, status_permits } = filterStore;
    const [keyword, setKeyword] = useState("");    
    
    const regionalStore = useFetch<string[]>([]);
    const witelStore = useFetch<string[]>([]);

    const regionalList: Option<string>[] = useMemo(() => {
        return regionalListFormat(userDataStore, regionalStore.data);
    }, [regionalStore]);

    const witelList: Option<string>[] = useMemo(() => {
        return witelListFormat(userDataStore, witelStore.data);
    }, [witelStore]);

    useEffect(() => {
        if (regional) {
            witelStore.fetch(getWitel({ regional: regional }));
        } else {
            witelStore.setData([]);
        }
    }, [regional]);

    useEffect(() => {
        regionalStore.fetch(getRegional());
    }, []);

    return (
        <>
            <DateRangePicker
                id="filter-date"
                value={{ start: startDate, end: endDate }}
                onChange={(startDate, endDate) => {
                    filterStore.set({ startDate, endDate });
                }}
                label="Periode"
            />
            <Dropdown
                id="filter-regional"
                label="Regional"
                placeholder="Pilih Regional"
                value={regional}
                options={regionalList}
                loading={regionalStore.status === "pending"}
                error={regionalStore.error}
                onChange={(regional) => {
                    filterStore.set({ regional, witel: "" });
                }}
            />
            <Dropdown
                id="filter-witel"
                label="Witel"
                placeholder="Pilih Witel"
                value={witel}
                options={witelList}
                loading={witelStore.status === "pending"}
                error={witelStore.error}
                onChange={(witel) => filterStore.set({ witel })}
            />
            <Dropdown
                id="filter-status-permit"
                label="Status Permit"
                placeholder="Pilih Status Permit"
                value={status_permits}
                options={optionsStatusPermit}
                onChange={(value) => filterStore.set({ status_permits: value })}
            />
            <TextField
                label={"Cari"}
                value={keyword}
                onChange={(value) => {
                    setKeyword(value);
                                                    
                    clearTimeout(debounce);
                    debounce = setTimeout(() => {
                        filterStore.set({ search: value, page: 1 });
                    }, 1000);
                }}
                className="pl-2"
                placeholder="Cari Nama Polygon..."
                parentClassName="w-52"
            />
        </>
    );
};

export default FilterBar;
