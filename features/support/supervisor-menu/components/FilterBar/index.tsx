import { useEffect, useMemo } from "react";
import { When } from "react-if";

import useFetch from "@hooks/useFetch";

import { MdSearch, MdClose } from "react-icons/md";

import { TextField } from "@components/input";
import { Dropdown } from "@components/dropdown";

import { useFilterStore } from "@features/support/supervisor-menu/store";
import { fetchListUser } from "@features/support/supervisor-menu/queries/user";

import { getRegional, getWitel } from "@api/district/network";
import { getVendor, Vendor } from "@api/survey-demand/utility";

let debounce: NodeJS.Timeout;

const FilterBar = ({ user }: { user: User }) => {
    const regionalStore = useFetch<string[]>([]);
    const witelStore = useFetch<string[]>([]);
    const vendorStore = useFetch<Vendor[]>([]);

    const filterStore = useFilterStore();
    const { search, regional, witel } = filterStore;

    const regionalList: Option<string>[] = useMemo(() => {
        if (user.regional && user.regional !== "National") {
            return [{ label: user.regional, value: user.regional }];
        } else {
            return [{ label: "Semua Regional", value: "" }, ...regionalStore.data.map((value) => ({ label: value, value }))];
        }
    }, [regionalStore]);

    const witelList: Option<string>[] = useMemo(() => {
        if (user.witel && user.witel !== "All") {
            return [{ label: user.witel, value: user.witel }];
        } else {
            return [{ label: "Semua Witel", value: "" }, ...witelStore.data.map((value) => ({ label: value, value }))];
        }
    }, [witelStore]);

    useEffect(() => {
        regionalStore.fetch(getRegional());
    }, []);

    useEffect(() => {
        if (regional) {
            witelStore.fetch(getWitel({ regional }));
        } else {
            witelStore.setData([]);
        }
    }, [regional]);

    useEffect(() => {
        vendorStore.fetch(getVendor());
    }, []);

    return (
        <div className="w-full h-full mt-6 mb-8">
            <div className="flex flex-wrap items-center gap-4">
                <TextField
                    label={"Cari"}
                    placeholder="Nama, telepon, alamat..."
                    value={search}
                    onChange={(search) => {
                        filterStore.set({ search, page: 1 });

                        clearTimeout(debounce);
                        debounce = setTimeout(() => {
                            fetchListUser({ ...filterStore, search, page: 1 });
                        }, 1000);
                    }}
                    prefix={<MdSearch />}
                    suffix={
                        <When condition={filterStore.search}>
                            <button
                                onClick={() => {
                                    filterStore.set({ search: "" });
                                    fetchListUser({ ...filterStore, search: "" }, "isSamePage");
                                }}
                            >
                                <MdClose />
                            </button>
                        </When>
                    }
                    parentClassName="flex-1"
                />
                <Dropdown
                    id="filter-regional"
                    label="Regional"
                    placeholder="Pilih Regional"
                    value={regional}
                    options={regionalList}
                    onChange={(regional) => {
                        filterStore.set({ regional, witel: "" });
                    }}
                    className="min-w-[12rem]"
                    parentClassName="md:hidden"
                />
                <Dropdown
                    id="filter-data-demand-table-witel"
                    label="Witel"
                    placeholder="Pilih Witel"
                    value={witel}
                    options={witelList}
                    onChange={(witel) => {
                        filterStore.set({ witel });
                    }}
                    className="w-[12rem]"
                    parentClassName="md:hidden"
                />
            </div>
        </div>
    );
};

export default FilterBar;
