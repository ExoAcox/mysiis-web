import { MdSearch } from "react-icons/md";

import { fetchSurvey } from "@features/planning/dashboard-microdemand/queries/dashboard/survey";
import { useFilterStore, useSurveyStore } from "@features/planning/dashboard-microdemand/store/dashboard";

import { Dropdown } from "@components/dropdown";
import { TextField } from "@components/input";

let debounce: NodeJS.Timeout;

const SearchBar = () => {
    const setSurvey = useSurveyStore((store) => store.set);
    const filterStore = useFilterStore();

    return (
        <TextField
            label={"Cari"}
            value={filterStore.search}
            onChange={(search) => {
                setSurvey({ data: [], status: "pending" });
                filterStore.set({ search, page: 1 });

                clearTimeout(debounce);
                debounce = setTimeout(() => {
                    fetchSurvey({ ...filterStore, search, page: 1 });
                }, 1000);
            }}
            className="pl-0"
            placeholder={filterStore.searchType === "name" ? "Cari Nama Responden..." : "Cari No. Telp Responden..."}
            prefix={
                <div className="flex items-center gap-3">
                    <Dropdown
                        id="filter-search"
                        value={filterStore.searchType}
                        options={[
                            { label: "Nama", value: "name" },
                            { label: "No. Telp", value: "phone" },
                        ]}
                        onChange={(searchType) => filterStore.set({ searchType })}
                        className="-translate-x-[1px] rounded-r-none"
                    />
                    <MdSearch size="1.25rem" />
                </div>
            }
            parentClassName="flex-1 min-w-[45%]"
        />
    );
};

export default SearchBar;
