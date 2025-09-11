import React, { FC, RefObject, useEffect, useState } from "react";

import { getWitel } from "@api/district/network";

import { errorHelper } from "@functions/common";

import Filter from "@images/vector/filter.svg";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { Modal } from "@components/layout";
import { SheetRef } from "@components/navigation/BottomSheet";
import { ModalTitle } from "@components/text";

import { regionals } from "../../functions/common";
import { fetchOdpAddOns } from "../../queries/odpAddons";
import { useIpcaStore } from "../../store/cummon";
import { useFilterStore } from "../../store/filter";

interface Props {
    access: Access;
    mapState: MapState;
    device: Device;
    sheetRef?: RefObject<SheetRef>;
}

const Mobile: FC<Props> = ({ sheetRef }) => {
    const [isOpen, setOpen] = useState(false);
    const [params, setParams] = useFilterStore((e) => [e.filter, e.set]);
    const [statusGetWitel, setStatusGetWitel] = useState<DataStatus>("idle");
    const [witels, setWitels] = useState<string[]>([""]);
    const [status] = useIpcaStore((state) => [state.status]);

    const fetchWitel = (regional: { regional: string }) => {
        setStatusGetWitel("pending");
        setWitels([]);
        getWitel(regional)
            .then((result) => {
                setStatusGetWitel("resolve");
                setWitels(result);
            })
            .catch((error) => {
                setStatusGetWitel("reject");
                errorHelper(error);
                setWitels(["Terjadi Kesalahan"]);
            });
    };

    useEffect(() => {
        if (status == "resolve") setOpen(false);
    }, [status]);

    return (
        <>
            <Button className="h-[2.5rem]" onClick={() => setOpen(true)} variant="ghost">
                <Filter />
                Filter
            </Button>
            <Modal visible={isOpen} className="max-w-[90%] w-full" centered>
                <ModalTitle onClose={() => setOpen(false)} parentClassName="mb-4">
                    Filter
                </ModalTitle>
                <div className="grid gap-4">
                    <div className="w-full">
                        <div className="mb-2">Regional</div>
                        <Dropdown
                            id="filter-odp-area-odp-summary"
                            placeholder="Pilih Regional"
                            value={params.regional}
                            options={regionals.map((e) => ({ label: e, value: e }))}
                            onChange={(value) => {
                                setParams({ ...params, regional: value });
                                fetchWitel({ regional: value });
                            }}
                            className="w-full overflow-hidden"
                        />
                    </div>
                    <div>
                        <div className="mb-2">Witel</div>
                        <Dropdown
                            loading={statusGetWitel == "pending" ? true : false}
                            id="filter-odp-area-odp-summary"
                            placeholder="Pilih Witel"
                            value={params.witel}
                            options={witels.map((e) => ({ label: e, value: e }))}
                            onChange={(value) => {
                                setParams({ ...params, witel: value });
                            }}
                            className="w-full overflow-hidden"
                        />
                    </div>
                    <Button
                        loading={status == "pending" ? true : false}
                        onClick={() => {
                            params?.witel && fetchOdpAddOns({ sheetRef: sheetRef, regional: params.regional, witel: params.witel });
                        }}
                        className="w-full mt-2"
                    >
                        Terapkan
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default Mobile;
