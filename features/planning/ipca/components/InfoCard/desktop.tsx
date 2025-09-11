import React from "react";
import { Case, Else, If, Switch, Then, When } from "react-if";

import { FloatingMenu } from "@components/layout";
import { Spinner } from "@components/loader";
import { Card } from "@components/maps";
import { Title } from "@components/text";

import { useAllBuildingData, useAllOdpData, useOdpData, usePolygonStore } from "../../store/cummon";
import { useSource } from "../../store/filter";
import FilterCard from "../FilterCard";
import ListItem from "../ListItem";

interface Props {
    access: Access;
    mapState: MapState;
    device: Device;
}

const InfoCard: React.FC<Props> = ({ access, mapState, device }) => {
    const [data, status] = usePolygonStore((state) => [state.data, state.status]);
    const [dataAllOdp, statusAllOdp, errorOdp] = useAllOdpData((state) => [state.data, state.status, state.error]);
    const [dataOdp, statusOdp] = useOdpData((state) => [state.data, state.status]);
    const [source] = useSource((state) => [state.source]);
    const [buildings, statusAllBuilding, errorAllBuilding] = useAllBuildingData((state) => [state.data, state.status, state.error]);

    return (
        <FloatingMenu>
            <FilterCard access={access} mapState={mapState} device={device} />
            <When condition={status != "idle"}>
                <Card className="w-[334px] text-sm">
                    <Switch>
                        <Case condition={status == "pending"}>
                            <div className="grid place-items-center">
                                <Spinner size={20} />
                            </div>
                        </Case>
                        <Case condition={status == "resolve"}>
                            <Title size="large">Informasi</Title>
                            <If condition={source == "odp"}>
                                <Then>
                                    <div className="border-b-[1px] border-[#E9EBEF] pb-[23px] mb-[23px]">
                                        <ListItem title="Cluster ID" value={data.cluster_id.toString()} />
                                        <ListItem title="Regional" value={data.regional} />
                                        <ListItem title="Witel" value={data.witel} />
                                        <ListItem title="Nama LOP" value={data.nama_lop} />
                                        <ListItem
                                            title="Alamat"
                                            value={`${data.kelurahan}, ${data.kecamatan}, ${data.kabupaten}, ${data.provinsi}`}
                                        />
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
                                </Then>
                                <Else>
                                    <div className="border-b-[1px] border-[#E9EBEF] pb-[23px] mb-[23px] mt-5">
                                        <ListItem title="Jumlah Building" value={buildings.length.toString()} />
                                    </div>
                                </Else>
                            </If>
                        </Case>
                        <Case condition={statusAllOdp == "reject" && source == "odp"}>
                            <div>
                                <div>{errorOdp?.message || "Terjadi Kesalahan"}</div>
                            </div>
                        </Case>
                        <Case condition={statusAllBuilding == "reject" && source == "building"}>
                            <div>
                                <div>{errorAllBuilding?.message || "Terjadi Kesalahan"}</div>
                            </div>
                        </Case>
                        <Case condition={status == "reject"}>
                            <div>
                                <div>Terjadi Kesalahan</div>
                            </div>
                        </Case>
                    </Switch>
                </Card>
            </When>
        </FloatingMenu>
    );
};

export default InfoCard;
