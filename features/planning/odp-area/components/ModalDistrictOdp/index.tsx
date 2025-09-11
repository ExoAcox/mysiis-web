import { RefObject, useEffect, useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { Else, If, Then, When } from "react-if";

import { OdpUim } from "@api/odp";

import useModal from "@hooks/useModal";

import { getColorComponent } from "@features/fulfillment/odp-view/functions/odp";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { Pagination, PaginationInfo } from "@components/navigation";
import { SheetRef } from "@components/navigation/BottomSheet";
import { Table } from "@components/table";
import { ModalTitle, Subtitle, Title } from "@components/text";

import { viewMapsOdpArea } from "../../Functions";
import { useDistrictOdpSummaryStore } from "../../store";
import InputTextOdpArea from "../InputTextOdpArea";

export default function ModalDistrictOdp({ device, sheetRef }: { device: Device; sheetRef: RefObject<SheetRef> }) {
    const { modal, setModal } = useModal("odp-modal");
    const odpSummary = useDistrictOdpSummaryStore((state) => state.data);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [listOdpSummary, setListOdpSummary] = useState<OdpUim[]>([]);

    useEffect(() => {
        odpSummary.lists && setListOdpSummary(odpSummary.lists);
    }, [odpSummary]);

    const handleSearch = (e: string) => {
        const data = odpSummary.lists ? odpSummary.lists : [];
        if (e == "Enter") {
            const result = data.filter((item) => {
                if (item.devicename !== undefined) return item.devicename.toLowerCase().indexOf(search.toLowerCase()) > -1;
            });
            result.length > 0 ? setListOdpSummary(result) : setListOdpSummary([]);
        }
    };

    return (
        <Modal
            visible={modal}
            className="w-[55rem]"
            onClose={() => {
                setSearch("");
            }}
        >
            <ModalTitle onClose={() => setModal(false)}>Daftar ODP</ModalTitle>
            <InputTextOdpArea value={search} parentClassName="my-5" onChange={(e) => setSearch(e)} onKeyDown={(e) => handleSearch(e)} />
            <If condition={device == "mobile"}>
                <Then>
                    {modal &&
                        listOdpSummary
                            .filter((_, index) => (page - 1) * 10 <= index && page * 10 > index)
                            .map((odp) => {
                                return (
                                    <div key={odp.device_id} className="border border-[#E9EBEF] rounded-md overflow-hidden mb-3">
                                        <div className="text-[16px] font-bold bg-[#E9EBEF] h-[48px] flex items-center p-[12px]">{odp.devicename}</div>
                                        <div className="px-[10px] py-[8px] flex flex-col gap-[8px]">
                                            <div className="flex text-[14px]">
                                                <div className="w-[40%] font-bold">Device Port </div>
                                                <div>: {odp.deviceportnumber}</div>
                                            </div>
                                            <div className="flex text-[14px]">
                                                <div className="w-[40%] font-bold">Idle Port </div>
                                                <div>: {odp.portidlenumber}</div>
                                            </div>
                                            <div className="flex text-[14px]">
                                                <div className="w-[40%] font-bold">Status </div>
                                                <div>: {getColorComponent(odp.status_occ_add)}</div>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                setModal(false);
                                                viewMapsOdpArea(odp.devicename);
                                                sheetRef.current!.snapTo(100);
                                            }}
                                            className="rounded-lg h-[24px] mx-auto w-[90%] my-3 text-[14px]"
                                        >
                                            Lihat di Maps
                                        </Button>
                                    </div>
                                );
                            })}
                </Then>
                <Else>
                    <Table
                        rows={listOdpSummary.length > 0 ? listOdpSummary.filter((_, index) => (page - 1) * 10 <= index && page * 10 > index) : []}
                        columns={[
                            {
                                header: "No",
                                value: (_, index) => (page - 1) * 10 + index + 1,
                                className: "text-right",
                                headerClassName: "text-right",
                            },
                            {
                                header: "Nama Device",
                                value: (odp) => odp.devicename,
                            },
                            {
                                header: "Device Port",
                                value: (odp) => odp.deviceportnumber,
                                className: "text-center",
                                headerClassName: "text-center",
                            },
                            {
                                header: "Idle Port",
                                value: (odp) => odp.portidlenumber,
                                className: "text-center",
                                headerClassName: "text-center",
                            },
                            {
                                header: "Status",
                                value: (odp) => getColorComponent(odp.status_occ_add),
                                className: "text-center",
                                headerClassName: "text-center",
                            },
                            {
                                header: null,
                                value: (odp) => (
                                    <Button
                                        className="py-1.5 mx-auto"
                                        onClick={() => {
                                            setModal(false);
                                            viewMapsOdpArea(odp.devicename);
                                        }}
                                    >
                                        <HiLocationMarker className="-translate-y-[1px]" />
                                        <span>Lihat di Maps</span>
                                    </Button>
                                ),
                            },
                        ]}
                        bodyClassName="py-2"
                        parentClassName="shadow rounded-2xl"
                        hideHeader={!listOdpSummary.length}
                        notFoundComponent={
                            <div className="py-8 text-center">
                                <div className="bg-primary-20 w-[18rem] h-[12.5rem] rounded-lg mx-auto" />
                                <Title className="mt-4 mb-2">Data ODP Tidak Ditemukan</Title>
                                <Subtitle size="subtitle" className="text-black-80">
                                    Mohon cek keyword yang Anda masukkan dan coba lagi
                                </Subtitle>
                            </div>
                        }
                    />
                </Else>
            </If>
            <When condition={device == "mobile"}>
                <div className="flex justify-center mt-3">
                    <PaginationInfo page={page} totalCount={listOdpSummary.length} row={10} />
                </div>
            </When>
            <Pagination
                pageRangeDisplayed={3}
                className="flex items-center mx-auto mt-5 mb-3"
                page={page}
                onChange={(value) => setPage(value)}
                row={10}
                totalCount={listOdpSummary.length}
            />
        </Modal>
    );
}
