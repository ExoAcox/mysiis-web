import { useEffect, useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { MdSearch } from "react-icons/md";

import useModal from "@hooks/useModal";

import { googleMaps, markerOdps } from "@pages/fulfillment/odp-view";

import { getColorComponent, getOdpName } from "@features/fulfillment/odp-view/functions/odp";
import { useFilterStore } from "@features/fulfillment/odp-view/store";

import { Button } from "@components/button";
import { TextField } from "@components/input";
import { Modal } from "@components/layout";
import { Pagination } from "@components/navigation";
import { Table } from "@components/table";
import { ModalTitle, Subtitle, Title } from "@components/text";

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

    const { modal, setModal } = useModal("odp-view/odp");

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
            className="w-[55rem]"
            onClose={() => {
                setOdps([]);
                setPage(1);
                setInput("");
            }}
        >
            <ModalTitle onClose={() => setModal(false)}>ODP {getOdpName(source).name}</ModalTitle>
            <TextField
                value={input}
                onChange={(value) => setInput(value)}
                placeholder="Masukkan ODP yang Anda cari ..."
                parentClassName="py-4"
                prefix={<MdSearch size="1.25rem" />}
            />
            <Table
                rows={filteredOdps.filter((_, index) => (page - 1) * 10 <= index && page * 10 > index)}
                columns={[
                    {
                        header: "No",
                        value: (_, index) => (page - 1) * 10 + index + 1,
                        className: "text-right",
                        headerClassName: "text-right",
                    },
                    {
                        header: "Nama Device",
                        value: (odp) => odp.name,
                    },
                    {
                        header: "Device Port",
                        value: (odp) => odp.devicePort,
                        className: "text-center",
                        headerClassName: "text-center",
                    },
                    {
                        header: "Idle Port",
                        value: (odp) => odp.idlePort,
                        className: "text-center",
                        headerClassName: "text-center",
                    },
                    {
                        header: "Status",
                        value: (odp) => getColorComponent(odp.status),
                        className: "text-center",
                        headerClassName: "text-center",
                    },
                    {
                        header: null,
                        value: (odp) => (
                            <Button className="py-1.5 mx-auto" onClick={() => viewMaps(odp.name)}>
                                <HiLocationMarker className="-translate-y-[1px]" />
                                <span>Lihat di Maps</span>
                            </Button>
                        ),
                    },
                ]}
                bodyClassName="py-2"
                parentClassName="shadow rounded-2xl"
                hideHeader={!filteredOdps.length}
                notFoundComponent={
                    <div className="py-8 text-center">
                        <div className="bg-primary-20 w-[18rem] h-[12.5rem] rounded-lg mx-auto" />
                        <Title className="mt-4 mb-2">Data ODP ‘{input}’ Tidak Ditemukan</Title>
                        <Subtitle size="subtitle" className="text-black-80">
                            Mohon cek keyword yang Anda masukkan dan coba lagi
                        </Subtitle>
                    </div>
                }
            />

            <Pagination className="mx-auto mb-3 mt-7" page={page} onChange={(value) => setPage(value)} row={10} totalCount={filteredOdps.length} />
        </Modal>
    );
};

export default OdpModal;
