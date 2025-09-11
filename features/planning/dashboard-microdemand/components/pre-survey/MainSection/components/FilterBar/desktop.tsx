import { useEffect, useMemo } from "react";

import { getRegionTsel, getBranchTsel } from "@api/district/network";
import { Vendor, getVendor } from "@api/survey-demand/utility";

import useFetch from "@hooks/useFetch";

import {
    regionalListFormat,
    statusList,
    vendorListFormat,
    witelListFormat,
} from "@features/planning/dashboard-microdemand/functions/dashboard";
import { useFilterStore } from "@features/planning/dashboard-microdemand/store/dashboard";
import { useUserDataStore } from "@features/planning/dashboard-microdemand/store/global";

import { DateRangePicker } from "@components/calendar";
import { Dropdown } from "@components/dropdown";

const FilterBar: React.FC<{ user: User }> = ({ user }) => {
    const userDataStore = useUserDataStore();
    const filterStore = useFilterStore();
    const { regional, witel, status, startDate, endDate, surveyor, polygon, vendor } = filterStore;

    const regionStore = useFetch<string[]>([]);
    const branchStore = useFetch<string[]>([]);
    const vendorStore = useFetch<Vendor[]>([]);

    const regionList: Option<string>[] = useMemo(() => {
        return regionalListFormat(userDataStore, regionStore.data);
    }, [regionStore]);

    const branchList: Option<string>[] = useMemo(() => {
        return witelListFormat(userDataStore, branchStore.data);
    }, [branchStore]);

    const vendorList: Option<string>[] = useMemo(() => {
        return vendorListFormat(user, vendorStore.data);
    }, [vendorStore]);

    useEffect(() => {
        if (regional) {
            branchStore.fetch(getBranchTsel({ region: regional }));
        } else {
            branchStore.setData([]);
        }
    }, [regional]);

    useEffect(() => {
        regionStore.fetch(getRegionTsel({ area: user.tsel_area }));
    }, []);

    useEffect(() => {
        vendorStore.fetch(getVendor());
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
                id="filter-vendor"
                label="Vendor"
                placeholder="Pilih Vendor"
                value={vendor}
                options={vendorList}
                onChange={(vendor) => {
                    filterStore.set({ vendor });
                }}
                className="min-w-[12rem]"
                parentClassName="md:hidden"
                loading={vendorStore.status === "pending"}
                error={vendorStore.error}
                autocomplete
            />
            <Dropdown
                id="filter-regional"
                label="Region"
                placeholder="Pilih Region"
                value={regional}
                options={regionList}
                loading={regionStore.status === "pending"}
                error={regionStore.error}
                onChange={(regional) => {
                    filterStore.set({ regional, witel: "" });
                }}
            />
            <Dropdown
                id="filter-witel"
                label="Branch"
                placeholder="Pilih Branch"
                value={witel}
                options={branchList}
                loading={branchStore.status === "pending"}
                error={branchStore.error}
                onChange={(witel) => filterStore.set({ witel })}
            />
            <Dropdown
                id="filter-status"
                label="Status"
                options={[
                    { value: "", label: "Semua Status" },
                    { value: "unvalidated", label: "Unvalidated" },
                    { value: "invalid", label: "Invalid" },
                    { value: "valid-mitra", label: "Valid Mitra" },
                    { value: "proses-izin", label: "Proses Izin" },
                    { value: "valid", label: "Valid" },
                  ]}
                value={status}
                placeholder="Pilih Status"
                onChange={(status) => filterStore.set({ status })}
            />
        </>
    );
};

export default FilterBar;
