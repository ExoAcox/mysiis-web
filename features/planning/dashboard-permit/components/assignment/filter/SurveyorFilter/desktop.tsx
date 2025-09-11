import useModal from "@hooks/useModal";

import { useFilterStore } from "@features/planning/dashboard-permit/store/assignment";
import { usePolygonStore, useUserStore } from "@features/planning/dashboard-microdemand/store/global";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";

const Search = () => {
    const { setModal } = useModal("assignment-surveyor-add");

    const userStore = useUserStore();
    const polygonStore = usePolygonStore();
    const filterStore = useFilterStore();
    const { userid, mysistaid } = filterStore;

    return (
        <div className="flex items-end gap-4 mt-6 mb-8">
            <Dropdown
                id="filter-surveyor"
                label="Surveyor"
                placeholder="Pilih Surveyor"
                value={userid}
                loading={userStore.status === "pending"}
                error={userStore.error}
                options={[{ label: "Semua Surveyor", value: "" }, ...userStore.data.map((data) => ({ label: data.fullname, value: data.userId }))]}
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
            <Button className="h-12 ml-auto" onClick={() => setModal(true)}>
                Tambah Assignment
            </Button>
        </div>
    );
};

export default Search;
