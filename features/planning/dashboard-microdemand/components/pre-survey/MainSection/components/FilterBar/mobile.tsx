import useFetch from "@hooks/useFetch";
import { useEffect, useMemo, useState } from "react";
import { RiFilter3Fill } from "react-icons/ri";
import { When } from "react-if";

import { getRegionTsel, getBranchTsel } from "@api/district/network";
import { Vendor, getVendor } from "@api/survey-demand/utility";

import {
    regionalListFormat,
    statusList,
    vendorListFormat,
    witelListFormat,
} from "@features/planning/dashboard-microdemand/functions/dashboard";
import { Filter, filterDefaultValue, useFilterStore } from "@features/planning/dashboard-microdemand/store/dashboard";
import { usePolygonStore, useUserDataStore, useUserStore } from "@features/planning/dashboard-microdemand/store/global";

import { Button } from "@components/button";
import { DateRangePicker } from "@components/calendar";
import { Dropdown } from "@components/dropdown";
import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

const FilterBar: React.FC<{ user: User }> = ({ user }) => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterState, setFilterState] = useState<Filter>(filterDefaultValue);
    const userDataStore = useUserDataStore();

    const userStore = useUserStore();
    const polygonStore = usePolygonStore();
    const filterStore = useFilterStore();
    const { regional, witel, status, startDate, endDate, surveyor, polygon, vendor } = filterStore;

    const regionStore = useFetch<string[]>([]);
    const branchStore = useFetch<string[]>([]);
    const vendorStore = useFetch<Vendor[]>([]);

    useEffect(() => {
        if (filterOpen) {
            setFilterState({ ...filterDefaultValue, regional, witel, status, startDate, endDate, surveyor, polygon, vendor });
        }
    }, [filterOpen]);

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

    const onSave = () => {
        filterStore.set(filterState);
        setFilterOpen(false);
    };

    return (
        <>
            <Button variant="ghost" className="w-full" onClick={() => setFilterOpen(true)}>
                <RiFilter3Fill />
                Filter
            </Button>

            <Modal visible={filterOpen} className="w-full" onClose={() => setFilterState(filterDefaultValue)}>
                <ModalTitle onClose={() => setFilterOpen(false)}>Filter</ModalTitle>
                <div className="flex flex-col gap-3 mt-3">
                    <DateRangePicker
                        id="filter-date"
                        value={{ start: filterState.startDate, end: filterState.endDate }}
                        onChange={(startDate, endDate) => {
                            setFilterState({ ...filterState, startDate, endDate });
                        }}
                        label="Periode"
                    />
                    <When condition={user.role_keys.includes("supervisor-survey-mitra")}>
                        <Dropdown
                            id="filter-surveyor"
                            label="Surveyor"
                            placeholder="Pilih Surveyor"
                            value={filterState.surveyor}
                            loading={userStore.status === "pending"}
                            error={userStore.error}
                            options={[
                                { label: "Semua Surveyor", value: "" },
                                ...userStore.data.map((data) => ({ label: data.fullname, value: data.userId })),
                            ]}
                            onChange={(surveyor) => setFilterState({ ...filterState, surveyor })}
                            autocomplete
                        />
                        <Dropdown
                            id="filter-polygon"
                            label="Polygon"
                            placeholder="Pilih Polygon"
                            value={filterState.polygon}
                            loading={polygonStore.status === "pending"}
                            error={polygonStore.error}
                            options={[
                                { label: "Semua Polygon", value: "" },
                                ...polygonStore.data.map((data) => ({ label: data.name, value: data.objectid.toString() })),
                            ]}
                            onChange={(polygon) => setFilterState({ ...filterState, polygon })}
                            autocomplete
                        />
                    </When>
                    <Dropdown
                        id="filter-vendor"
                        label="Vendor"
                        placeholder="Pilih Vendor"
                        value={filterState.vendor}
                        options={vendorList}
                        loading={vendorStore.status === "pending"}
                        error={vendorStore.error}
                        onChange={(vendor) => {
                            setFilterState({ ...filterState, vendor });
                        }}
                        className="min-w-[12rem]"
                        parentClassName="md:hidden"
                        autocomplete
                    />
                    <Dropdown
                        id="filter-regional"
                        label="Region"
                        placeholder="Pilih Region"
                        value={filterState.regional}
                        options={regionList}
                        loading={regionStore.status === "pending"}
                        error={regionStore.error}
                        onChange={(regional) => {
                            setFilterState({ ...filterState, regional, witel: "" });
                        }}
                    />
                    <Dropdown
                        id="filter-witel"
                        label="Branch"
                        placeholder="Pilih Branch"
                        value={filterState.witel}
                        options={branchList}
                        loading={branchStore.status === "pending"}
                        error={branchStore.error}
                        onChange={(witel) => setFilterState({ ...filterState, witel })}
                    />
                    <Dropdown
                        id="filter-status"
                        label="Status"
                        options={statusList}
                        value={filterState.status}
                        placeholder="Pilih Status"
                        position="top center"
                        onChange={(status) => setFilterState({ ...filterState, status })}
                    />
                    <Button className="w-full mt-2 mb-1" onClick={onSave}>
                        Terapkan
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default FilterBar;
