import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";

import { Polygon } from "@api/survey-demand/mysiista";

import useModal from "@hooks/useModal";

import { Button } from "@components/button";
import { TextField } from "@components/input";
import { Modal } from "@components/layout";
import { CheckBox } from "@components/radio";
import { ModalTitle } from "@components/text";
import { Dropdown } from "@components/dropdown";

const PolygonModal: React.FC<{ polygons: Polygon[]; selectedPolygons: Polygon[]; setPolygon: (polygon: Polygon[]) => void }> = ({
    polygons,
    selectedPolygons,
    setPolygon,
}) => {
    const [search, setSearch] = useState("");
    const [area, setArea] = useState("");

    const { modal, setModal } = useModal("assignment-surveyor-polygon");

    const [filteredPolygons, setFilteredPolygons] = useState<Polygon[]>([]);
    const [temporaryPolygons, setTemporaryPolygons] = useState<string[]>([]);

    useEffect(() => {
        if (modal) setTemporaryPolygons(selectedPolygons.map((polygon) => polygon.objectid.toString()));
    }, [modal]);

    useEffect(() => {
        if (modal){
            // filter area and search
            setFilteredPolygons(
                polygons.filter((polygon) => {
                    const areaMatch = area === "" || polygon.area === area;
                    const searchMatch = polygon.name.toLowerCase().includes(search.toLowerCase());
                    return areaMatch && searchMatch;
                })
            );
        };
    }, [modal, search, area]);

    const onSave = () => {
        setPolygon(polygons.filter((polygon) => temporaryPolygons.includes(polygon.objectid.toString())));
        setModal(false);
    };

    return (
        <Modal
            visible={modal}
            onClose={() => {
                setSearch("");
                setTemporaryPolygons([]);
                setFilteredPolygons([]);
            }}
            className="h-[80%]"
        >
            <div className="flex flex-col h-full gap-2">
                <ModalTitle onClose={() => setModal(false)}>Pilih Polygon</ModalTitle>
                <Dropdown
                    id="filter-area"
                    label="Filter Area"
                    placeholder="Pilih Area"
                    value={area}
                    options={["Semua", "AREA 1", "AREA 2", "AREA 3", "AREA 4"].map((area) => ({ label: area, value: area }))}
                    onChange={(area) => setArea(area === "Semua" ? "" : area)}
                    autocomplete
                />
                <TextField
                    value={search}
                    onChange={(value) => setSearch(value)}
                    prefix={<MdSearch />}
                    placeholder="Cari polygon ..."
                />
                <div className="flex-1 overflow-auto">
                    <CheckBox
                        value={temporaryPolygons}
                        options={filteredPolygons.map((polygon) => ({ label: polygon.name, value: polygon?.objectid?.toString() }))}
                        onChange={(values) => {
                            setTemporaryPolygons(values);
                        }}
                    />
                </div>
                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-black-50">
                    <span className="mr-auto font-medium text-black-80">{temporaryPolygons.length} polygon dipilih</span>
                    <Button variant="ghost" className="ml-4 w-[6.25rem]" onClick={() => setModal(false)}>
                        Batal
                    </Button>
                    <Button className="w-[6.25rem]" onClick={onSave}>
                        Simpan
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PolygonModal;
