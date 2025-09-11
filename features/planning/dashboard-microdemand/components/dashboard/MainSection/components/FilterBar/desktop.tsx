import { useEffect, useMemo } from "react";
import { When } from "react-if";

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
import { usePolygonStore, useUserDataStore, useUserStore } from "@features/planning/dashboard-microdemand/store/global";

import { DateRangePicker } from "@components/calendar";
import { Dropdown } from "@components/dropdown";
import { intersection } from "@functions/common";

const FilterBar: React.FC<{ user: User }> = ({ user }) => {
    const userDataStore = useUserDataStore();

    const userStore = useUserStore();
    const polygonStore = usePolygonStore();
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
            <When condition={user.role_keys.includes("supervisor-survey-mitra")}>
                <Dropdown
                    id="filter-surveyor"
                    label="Surveyor"
                    placeholder="Pilih Surveyor"
                    value={surveyor}
                    options={[
                        { label: "Semua Surveyor", value: "" },
                        ...userStore.data.map((data) => ({ label: data.fullname, value: data.userId })),
                    ]}
                    onChange={(surveyor) => filterStore.set({ surveyor })}
                    loading={userStore.status === "pending"}
                    error={userStore.error}
                    autocomplete
                />
            </When>
            <When condition={intersection(user.role_keys, ["supervisor-survey-mitra","admin-survey-branch"]).length}>
                <Dropdown
                    id="filter-polygon"
                    label="Polygon"
                    placeholder="Pilih Polygon"
                    value={polygon}
                    options={[
                        { label: "Semua Polygon", value: "" },
                        ...polygonStore.data.map((data) => ({ label: data.name, value: data?.objectid?.toString() })),
                    ]}
                    onChange={(polygon) => filterStore.set({ polygon })}
                    loading={polygonStore.status === "pending"}
                    error={polygonStore.error}
                    autocomplete
                />
            </When>
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
                options={statusList}
                value={status}
                placeholder="Pilih Status"
                onChange={(status) => filterStore.set({ status })}
            />
        </>
    );
};

export default FilterBar;
