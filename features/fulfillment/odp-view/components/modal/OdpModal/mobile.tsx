import { useEffect, useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { MdSearch } from "react-icons/md";

import useModal from "@hooks/useModal";

import { googleMaps, markerOdps } from "@pages/fulfillment/odp-view";

import { getColorComponent, getOdpName } from "@features/fulfillment/odp-view/functions/odp";
import { useFilterStore } from "@features/fulfillment/odp-view/store";

import { TextField } from "@components/input";
import { Modal } from "@components/layout";
import { Pagination } from "@components/navigation";
import { TableList } from "@components/table";
import { ModalTitle } from "@components/text";

interface Odp {
    name: string;
    idlePort: number;
    devicePort: number;
    status: string;
    lat: number;
    lng: number;
}

const OdpModal = () => {
    const [odps, setOdps] = useState<Odp[]>([]);
    const [filteredOdps, setFilteredOdps] = useState<Odp[]>([]);
    const [page, setPage] = useState(1);
    const [input, setInput] = useState("");

    const source = useFilterStore((store) => store.source);

    const { modal, setModal } = useModal("odp-view/modal");

    useEffect(() => {
        if (!modal) return;

        const filteredMarkers = markerOdps
            .filter((marker) => marker.getMap())
            .map((marker) => {
                return {
                    name: marker.get("name"),
                    idlePort: marker.get("idlePort"),
                    devicePort: marker.get("devicePort"),
                    status: marker.get("status"),
                    lat: marker.getPosition()?.lat(),
                    lng: marker.getPosition()?.lng(),
                } as Odp;
            });

        setOdps(filteredMarkers);
    }, [modal]);

    const viewMaps = (name: string) => {
        const marker = markerOdps.find((marker) => marker.get("name") === name);
        if (!marker) return;

        googleMaps.panTo(marker.getPosition()!);
        if (googleMaps.getZoom()! < 18) googleMaps.setZoom(18);

        marker.get("infoWindow").open(googleMaps, marker);
        setModal(false);
    };

    useEffect(() => {
        setPage(1);
        setFilteredOdps(odps.filter((odp) => odp.name.toLowerCase().includes(input.toLowerCase())));
    }, [odps, input]);

    return (
        <Modal
            visible={modal}
            className="overflow-auto"
            onClose={() => {
                setOdps([]);
                setPage(1);
                setInput("");
            }}
        >
            <div className="sticky top-0 left-0">
                <ModalTitle onClose={() => setModal(false)}>ODP {getOdpName(source).name}</ModalTitle>
                <TextField
                    value={input}
                    onChange={(value) => setInput(value)}
                    placeholder="Masukkan ODP yang Anda cari ..."
                    parentClassName="pt-3 pb-2 text-medium"
                    prefix={<MdSearch size="1.25rem" />}
                />

                {filteredOdps
                    .filter((_, index) => (page - 1) * 5 <= index && page * 5 > index)
                    .map((odp) => {
                        return (
                            <div key={odp.name} className="relative gap-4 py-3 border-b border-secondary-20">
                                <TableList
                                    options={[
                                        { label: "Nama Device", value: odp.name },
                                        { label: "Device Port", value: odp.devicePort },
                                        { label: "Idle Port", value: odp.idlePort },
                                        { label: "Status", value: getColorComponent(odp.status) },
                                    ]}
                                    labelClassName="text-medium min-w-[5.5rem]"
                                    valueClassName="text-medium font-bold max-w-[10rem]"
                                />
                                <div
                                    className="absolute flex cursor-pointer items-center justify-center w-12 h-12 rounded-md bottom-3.5 right-1 bg-primary-40 shrink-0"
                                    onClick={() => viewMaps(odp.name)}
                                >
                                    <HiLocationMarker fill="white" />
                                </div>
                            </div>
                        );
                    })}
            </div>
            <div>
                <Pagination className="pr-3 mt-6 mb-3" page={page} onChange={(value) => setPage(value)} row={5} totalCount={filteredOdps.length} />
            </div>
        </Modal>
    );
};

export default OdpModal;
