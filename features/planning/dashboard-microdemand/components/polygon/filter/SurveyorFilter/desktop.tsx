import useModal from "@hooks/useModal";

import { useFilterStore } from "@features/planning/dashboard-microdemand/store/polygon";

import { Dropdown } from "@components/dropdown";
import { optionsStatus } from "@features/planning/dashboard-microdemand/functions/common";
import { Button } from "@components/button";
import { exportPolygonKml } from "@api/survey-demand/mysiista";
import { useState } from "react";
import { toast } from "react-toastify";
import { TextField } from "@components/input";
import { MdSearch } from "react-icons/md";
import { When } from "react-if";

let debounce: NodeJS.Timeout;

const Filter: React.FC<{ user: User }> = ({ user }) => {
    const { setModal } = useModal("assignment-surveyor-add");
    const { setModal : setModalAddKml } = useModal("polygon-add-kml");
    const filterStore = useFilterStore();
    const { status, keyword } = filterStore;
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");

    const handleExportKML = async () => {
        const { status } = filterStore;
        const body: { area: string; region?: string; branch?: string; vendor?: string; status?: string; } = {
            area: "ALL",
        };

        if(status) {
            body["status"] = status;
        }

        if(user.role_keys.includes("admin-survey-branch")) {
            body["branch"] = user.tsel_branch!;
            body["region"] = user.tsel_region!;
            body["area"] = user.tsel_area!;
            // body["vendor"] = user.vendor!;
        } else if(user.role_keys.includes("admin-survey-region")) {
            body["region"] = user.tsel_region!;
            body["area"] = user.tsel_area!;
            // body["vendor"] = user.vendor!;
        } else if(user.role_keys.includes("admin-survey-area")) {
            body["area"] = user.tsel_area!;
            // body["vendor"] = user.vendor!;
        } else {
            body["area"] = "ALL";
            // body["vendor"] = user.vendor!;
        }

        setIsLoading(true);
        try {
            const result = await exportPolygonKml(body);
            const blob = new Blob([result as BlobPart], { type: 'application/vnd.google-earth.kml+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = Object.values(body).join('_') + '.kml';
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            toast.error("Failed to export KML");
        } finally {
            setIsLoading(false);
        }      
    };

    return (
        <div className="flex justify-between items-end gap-4 my-4">
            <div className="flex items-end gap-2">
                <TextField
                    label={"Cari"}
                    value={search}
                    onChange={(search) => {
                        setSearch(search);
                        
                        clearTimeout(debounce);
                        debounce = setTimeout(() => {
                            filterStore.set({ keyword: search, page: 1 });
                        }, 1000);
                    }}
                    className="pl-0"
                    placeholder="Cari nama polygon..."
                    prefix={<MdSearch size="1.25rem" className="ml-2" />}
                    // parentClassName="flex-1 min-w-[25%]"
                />
                <Dropdown
                    id="filter-status"
                    label="Status"
                    placeholder="Pilih Status"
                    value={status}
                    options={optionsStatus}
                    onChange={(status) => filterStore.set({ status })}
                    className="min-w-[12rem]"
                />
                <Button
                    className="p-3"
                    variant="filled" 
                    onClick={handleExportKML} 
                    loading={isLoading}
                >
                    Unduh KML
                </Button>
            </div>
            {/* <When condition={user.role_keys.includes("admin-survey-branch")}>
                <Button 
                    className="p-3"
                    variant="filled" 
                    onClick={()=> setModalAddKml(true)} 
                >
                    Tambah KML
                </Button>
            </When> */}
        </div>
    );
};

export default Filter;
