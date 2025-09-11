import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";

import { Polygon } from "@api/survey-demand/mysiista";

import useModal from "@hooks/useModal";

import { Button } from "@components/button";
import { TextField } from "@components/input";
import { Modal } from "@components/layout";
import { CheckBox } from "@components/radio";
import { ModalTitle } from "@components/text";

const PolygonModal: React.FC<{ polygons: Polygon[]; selectedPolygons: Polygon[]; setPolygon: (polygon: Polygon[]) => void }> = ({
    polygons,
    selectedPolygons,
    setPolygon,
}) => {
    const [search, setSearch] = useState("");

    const { modal, setModal } = useModal("assignment-surveyor-polygon");

    const [filteredPolygons, setFilteredPolygons] = useState<Polygon[]>([]);
    const [temporaryPolygons, setTemporaryPolygons] = useState<string[]>([]);

    useEffect(() => {
        if (modal) setTemporaryPolygons(selectedPolygons.map((polygon) => polygon.objectid.toString()));
    }, [modal]);

    useEffect(() => {
        if (modal) setFilteredPolygons(polygons.filter((polygon) => polygon.name.toLowerCase().includes(search.toLowerCase())));
    }, [modal, search]);

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
            <div className="flex flex-col h-full">
                <ModalTitle onClose={() => setModal(false)}>Pilih Polygon</ModalTitle>
                <TextField
                    value={search}
                    onChange={(value) => setSearch(value)}
                    prefix={<MdSearch />}
                    placeholder="Cari polygon ..."
                    parentClassName="py-4"
                />
                <div className="flex-1 overflow-auto">
                    <CheckBox
                        value={temporaryPolygons}
                        options={filteredPolygons.map((polygon) => ({ label: polygon.name, value: polygon.objectid.toString() }))}
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
