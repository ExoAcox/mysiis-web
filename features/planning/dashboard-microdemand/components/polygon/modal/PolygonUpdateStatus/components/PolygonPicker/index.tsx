import useModal from "@hooks/useModal";
import { When } from "react-if";

import { Polygon } from "@api/survey-demand/mysiista";

import { Button } from "@components/button";
import { TableList } from "@components/table";

import { PolygonModal } from "../index";

const PolygonPicker: React.FC<{ polygons: Polygon[]; selectedPolygon: Polygon[]; setPolygon: (polygon: Polygon[]) => void }> = ({ polygons, selectedPolygon, setPolygon }) => {
    const { setModal } = useModal("assignment-surveyor-polygon");

    return (
        <div>
            <div className="flex justify-between">
                <label className="block font-bold text-black-80 text-small">Polygon (Multi-select)</label>
            </div>
            <div className="flex flex-col border rounded border-black-50 h-[15rem] mt-2">
                <div className="flex-1 p-4 pb-0 overflow-auto">
                    <When condition={!selectedPolygon.length}>
                        <div className="flex items-center justify-center h-full text-medium">Silahkan pilih polygon terlebih dahulu</div>
                    </When>
                    <When condition={selectedPolygon.length}>
                        <div className="flex flex-col gap-4">
                            {selectedPolygon.map((polygon) => {
                                return (
                                    <TableList
                                        key={polygon.objectid}
                                        options={[
                                            { label: "Nama", value: polygon.name },
                                            { label: "Alamat", value: polygon.address },
                                            { label: "Kelurahan", value: polygon.desa },
                                            { label: "Kecamatan", value: polygon.kecamatan },
                                            { label: "Kota/Kabupaten", value: polygon.kabupaten },
                                            { label: "Latitude", value: polygon.lat },
                                            { label: "Longitude", value: polygon.lon },
                                            { label: "Tahap Survey", value: polygon.tahap_survey },
                                            { label: "Target Survey", value: polygon.target_household },
                                        ]}
                                        labelClassName="min-w-[7.5rem]"
                                        parentClassName="pb-4 border-b border-black-50"
                                    />
                                );
                            })}
                        </div>
                    </When>
                </div>
                <div className="p-4">
                    <Button className="w-full" variant="ghost" onClick={() => setModal(true)}>
                        + Pilih Polygon
                    </Button>
                </div>
            </div>

            <PolygonModal polygons={polygons} selectedPolygons={selectedPolygon} setPolygon={setPolygon} />
        </div>
    );
};

export default PolygonPicker;
