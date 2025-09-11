import React, { FC, RefObject, useState } from "react";
import { HiOutlineMap } from "react-icons/hi";
import { Case, Switch, When } from "react-if";

import { GetBuildingIpca, UimIpcaById } from "@api/addons/ipca";

import { googleMapsIpca } from "@pages/planning/ipca";

import CheckBoxOdpArea from "@features/planning/odp-area/components/CheckBoxOdpArea";

import { Button } from "@components/button";
import { Spinner } from "@components/loader";
import { BottomSheet } from "@components/navigation";
import { SheetRef } from "@components/navigation/BottomSheet";
import { Title } from "@components/text";

import { exportCsv } from "../../functions/common";
import { fetchBuildingIpca, fetchOdpUimIpca } from "../../queries/odpAddons";
import { useAllBuildingData, useAllOdpData, useDefaultAllDataOdpStore, useOdpData, usePolygonStore } from "../../store/cummon";
import { useSource } from "../../store/filter";
import ListItem from "../ListItem";

interface Props {
    device: Device;
    mapState: MapState;
    sheetRef?: RefObject<SheetRef>;
}

const Mobile: FC<Props> = (props) => {
    const [mapType, setMapType] = useState("roadmap");
    const [data, status] = usePolygonStore((state) => [state.data, state.status]);
    const [dataAllOdp, statusAllOdp] = useAllOdpData((state) => [state.data, state.status]);
    const [dataOdp, statusOdp] = useOdpData((state) => [state.data, state.status]);
    const [source, setSource] = useSource((state) => [state.source, state.set]);
    const [polygon] = usePolygonStore((state) => [state.data]);
    const [allOdp] = useDefaultAllDataOdpStore((state) => [state.data]);
    const [allBuilding] = useAllBuildingData((state) => [state.data]);

    const handleShowData = (e: string) => {
        if (e == "odp") {
            fetchOdpUimIpca(polygon);
        } else {
            fetchBuildingIpca(polygon);
        }
    };

    const handleExport = () => {
        let data: UimIpcaById[] | GetBuildingIpca[];
        if (source == "odp") data = allOdp;
        else data = allBuilding;
        exportCsv(data);
    };

    return (
        <BottomSheet ref={props.sheetRef} defaultSnap="max" snapPoints={({ minHeight }) => [40, 100, minHeight]}>
            <div
                className="absolute top-0 -translate-y-[120%] right-2.5 bg-white w-12 h-12 rounded-full shadow cursor-pointer flex items-center justify-center"
                onClick={() => {
                    const type = mapType === "roadmap" ? "hybrid" : "roadmap";
                    setMapType(type);
                    googleMapsIpca.setMapTypeId(type);
                }}
            >
                <HiOutlineMap size="1.5rem" />
            </div>
            <div className="grid gap-3 px-5">
                <When condition={status != "idle"}>
                    <div className="grid gap-3 mt-3">
                        <CheckBoxOdpArea
                            value={source}
                            onChange={(e: "odp" | "building") => {
                                setSource(e);
                                handleShowData(e);
                            }}
                            options={[
                                { label: "Lihat ODP", value: "odp" },
                                { label: "Lihat Building", value: "building" },
                            ]}
                        />
                        <Button onClick={() => handleExport()} variant="ghost" className="w-full mt-2">
                            Dapatkan Laporan
                        </Button>
                    </div>
                    <Switch>
                        <Case condition={status == "pending"}>
                            <div className="grid place-items-center h-[100px] bg-white">
                                <Spinner size={20} />
                            </div>
                        </Case>
                        <Case condition={status == "resolve"}>
                            <Title size="large">Informasi</Title>
                            <div className="border-b-[1px] border-[#E9EBEF] pb-[23px] mb-[23px]">
                                <ListItem title="Cluster ID" value={data.cluster_id.toString()} />
                                <ListItem title="Regional" value={data.regional} />
                                <ListItem title="Witel" value={data.witel} />
                                <ListItem title="Nama LOP" value={data.nama_lop} />
                                <ListItem title="Alamat" value={`${data.kelurahan}, ${data.kecamatan}, ${data.kabupaten}, ${data.provinsi}`} />
                                <ListItem title="Nama Segment" value={data.nama_segment} />
                                <ListItem title="Jumlah Huni" value={data.jumlah_huni.toString()} />
                            </div>
                            <div className="border-b-[1px] border-[#E9EBEF] pb-[23px] mb-[23px]">
                                <When condition={statusOdp == "resolve"}>
                                    <ListItem title="Device Port" value={dataOdp.deviceportnumber.toString()} />
                                    <ListItem title="Idle Port" value={dataOdp.portidlenumber.toString()} />
                                    <ListItem title="Used Port" value={(dataOdp.deviceportnumber - dataOdp.portidlenumber).toString()} />
                                </When>
                                <When condition={statusAllOdp == "resolve"}>
                                    <ListItem title="Total ODP" value={dataAllOdp.total_odp.toString()} />
                                </When>
                            </div>
                            <div className="grid gap-3">
                                <ListItem title="Green" value={dataAllOdp.green.toString()} color="#2FA52D" />
                                <ListItem title="Yellow" value={dataAllOdp.yellow.toString()} color="#FFFF00" />
                                <ListItem title="Red" value={dataAllOdp.red.toString()} color="#C00000" />
                                <ListItem title="Orange" value={dataAllOdp.orange.toString()} color="#FFC000" />
                                <ListItem title="Black Green" value={dataAllOdp.black_green.toString()} color="black_green" />
                                <ListItem title="Black" value={dataAllOdp.black.toString()} color="#000000" />
                            </div>
                        </Case>
                        <Case condition={status == "reject"}>
                            <div>
                                <div>Terjadi Kesalahan</div>
                            </div>
                        </Case>
                    </Switch>
                </When>
            </div>
        </BottomSheet>
    );
};

export default Mobile;
