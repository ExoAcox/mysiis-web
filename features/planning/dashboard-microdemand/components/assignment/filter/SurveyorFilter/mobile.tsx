import useModal from "@hooks/useModal";
import { useState } from "react";
import { RiFilter3Fill } from "react-icons/ri";

import { useFilterStore } from "@features/planning/dashboard-microdemand/store/assignment";
import { usePolygonStore, useUserStore } from "@features/planning/dashboard-microdemand/store/global";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

const Search = () => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterState, setFilterState] = useState<{ surveyor: string; polygon: string }>({ surveyor: "", polygon: "" });
    const { setModal } = useModal("assignment-surveyor-add");

    const userStore = useUserStore();
    const polygonStore = usePolygonStore();
    const filterStore = useFilterStore();
    const { userid, mysistaid } = filterStore;

    const onSave = () => {
        filterStore.set(filterState);
        setFilterOpen(false);
    };

    return (
        <>
            <div className="flex gap-3 mb-4.5">
                <Button variant="ghost" className="flex-1" onClick={() => setFilterOpen(true)}>
                    <RiFilter3Fill />
                    Filter
                </Button>
                <Button className="flex-1" onClick={() => setModal(true)}>
                    Tambah Assignment
                </Button>
            </div>

            <Modal visible={filterOpen} className="w-full" onClose={() => setFilterState({ surveyor: "", polygon: "" })}>
                <ModalTitle onClose={() => setFilterOpen(false)}>Filter</ModalTitle>
                <div className="flex flex-col gap-3 mt-3">
                    <Dropdown
                        id="filter-surveyor"
                        label="Surveyor"
                        placeholder="Pilih Surveyor"
                        value={userid}
                        loading={userStore.status === "pending"}
                        error={userStore.error}
                        options={[
                            { label: "Semua Surveyor", value: "" },
                            ...userStore.data.map((data) => ({ label: data.fullname, value: data.userId })),
                        ]}
                        onChange={(userid) => filterStore.set({ userid, mysistaid: "" })}
                        className="min-w-[12rem]"
                        autocomplete
                    />
                    <Dropdown
                        id="filter-polygon"
                        label="Polygon"
                        placeholder="Pilih Polygon"
                        value={mysistaid}
                        loading={polygonStore.status === "pending"}
                        error={polygonStore.error}
                        options={[
                            { label: "Semua Polygon", value: "" },
                            ...polygonStore.data.map((data) => ({ label: data.name, value: data.objectid.toString(), data })),
                        ]}
                        onChange={(mysistaid) => filterStore.set({ mysistaid })}
                        className="min-w-[12rem]"
                        autocomplete
                    />
                    <Button className="w-full mt-2 mb-1" onClick={onSave}>
                        Terapkan
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default Search;
