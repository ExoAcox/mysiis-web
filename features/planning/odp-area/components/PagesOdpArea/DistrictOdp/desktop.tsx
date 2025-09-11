import useModal from "@hooks/useModal";
import { useEffect, useState } from "react";
import { Case, Default, Switch, When } from "react-if";

import { tw } from "@functions/style";

import { heatmapOdpAreaDistrictOdp, mainMarkerOdpAreaDistrictOdp, odpAreaMarkersDistrictOdp, odpAreaPolygonsDistrictOdp } from "@pages/planning/odp-area/district-odp";

import { showPolygonBuilding } from "@features/planning/odp-area/queries/building_by_kelurahan";
import { showDistrictOdp } from "@features/planning/odp-area/queries/odp_uim_by_kelurahan";
import { showHeatmap } from "@features/planning/odp-area/queries/odp_uim_mini_by_kabupaten";
import {
    useCountTotalBuidlingStore,
    useDistrictBuildingStore,
    useDistrictHeatmapStore,
    useDistrictOdpSummaryStore,
    useDistrictStore,
    useSource,
} from "@features/planning/odp-area/store";

import { Button } from "@components/button";
import { FloatingMenu } from "@components/layout";
import { Spinner } from "@components/loader";
import { WarningCard } from "@components/maps";
import { Title } from "@components/text";

import CheckBoxOdpArea from "../../CheckBoxOdpArea";
import ListItem from "../../ListItem";
import { fetchKelurahanByLocation } from "@features/planning/odp-area/queries/DistrictOdp";
import { toast } from "react-toastify";

export default function DistrictOdp({ className }: { className?: string }) {
    const [sourceStore, setSourceStore] = useSource((state) => [state.source, state.setSource]);
    const [source, setSource] = useState<SourceDistrictOdp>("district-odp");
    const [district, statusDictrict, errorDistrict] = useDistrictStore((state) => [state.data, state.status, state.error]);
    const [odpSummary, statusDistrictOdpSummary, errorDistrictOdpSummary] = useDistrictOdpSummaryStore((state) => [
        state.data,
        state.status,
        state.error,
    ]);
    const [district_building, statusBuilding, errorBuilding] = useDistrictBuildingStore((state) => [state.data, state.status, state.error]);
    const [countTotal] = useCountTotalBuidlingStore((state) => [state.countTotal]);
    const [district_heatmap] = useDistrictHeatmapStore((state) => [state.data, state.status]);

    const setModalDistrict = useModal("odp-modal");

    const onTabChange = (e: string) => {
        setSourceStore(e);
        if (e == "district-odp") {
            heatmapOdpAreaDistrictOdp.forEach((x) => x.setMap(null));
            heatmapOdpAreaDistrictOdp.length = 0;
            odpAreaPolygonsDistrictOdp.forEach((x) => x.setMap(null));
            odpAreaPolygonsDistrictOdp.length = 0;
            showDistrictOdp(odpSummary.lists);
        } else if (e == "district-building") {
            heatmapOdpAreaDistrictOdp.forEach((x) => x.setMap(null));
            heatmapOdpAreaDistrictOdp.length = 0;
            odpAreaMarkersDistrictOdp.forEach((x) => x.setMap(null));
            odpAreaMarkersDistrictOdp.length = 0;
            showPolygonBuilding(district_building);
        } else {
            odpAreaPolygonsDistrictOdp.forEach((x) => x.setMap(null));
            odpAreaPolygonsDistrictOdp.length = 0;
            odpAreaMarkersDistrictOdp.forEach((x) => x.setMap(null));
            odpAreaMarkersDistrictOdp.length = 0;
            showHeatmap(district_heatmap);
        }
    };

    const handleSource = (value: SourceDistrictOdp) => {
        if (mainMarkerOdpAreaDistrictOdp.getPosition()?.lat()) {
            const latLong: LatLng = {
                lat: mainMarkerOdpAreaDistrictOdp.getPosition()?.lat() ?? 0,
                lng: mainMarkerOdpAreaDistrictOdp.getPosition()?.lng() ?? 0,
            }
            if (mainMarkerOdpAreaDistrictOdp.getPosition()?.lat()) {
                setSource(value);
                onTabChange(value);
                fetchKelurahanByLocation(latLong, value)
            }
        } else {
            toast('Silakan pilih lokasi lebih dahulu!', {
                position: 'bottom-left',
                type: 'warning',
                autoClose: 2000,
                closeButton: false
            })
        }
    };

    useEffect(() => {
        if (sourceStore != source) {
            setSourceStore(source);
        }
    }, [source]);

    return (
        <FloatingMenu className={tw("scrollbar-hide pointer-events-auto", className)}>
            <div className="w-[334px] rounded-md shadow-md bg-white p-[16px] flex flex-col gap-[16px]">
                <Title size="large">Filter</Title>
                <div>
                    <CheckBoxOdpArea
                        value={source == 'district-heatmap' ? 'district-odp' : source}
                        onChange={(e: SourceDistrictOdp) => {
                            handleSource(e);
                        }}
                        options={[
                            { label: "ODP", value: "district-odp" },
                            { label: "Building", value: "district-building" },
                        ]}
                    />
                </div>
            </div>
            <When condition={statusDictrict != "idle"}>
                <div className="w-[334px] rounded-md shadow-md bg-white p-[16px] flex flex-col gap-[16px]">
                    <Title size="large">Informasi ODP</Title>
                    <When condition={statusDictrict == "resolve"}>
                        <div className="text-[14px]">
                            <ListItem title="Kelurahan" subTitle={district.kelurahan} />
                            <ListItem title="Kecamatan" subTitle={district.kecamatan} />
                            <ListItem title="Kota" subTitle={district.kota} />
                            <ListItem title="Provinsi" subTitle={district.provinsi} />
                        </div>
                    </When>
                    <When condition={statusDictrict == "pending"}>
                        <Spinner />
                    </When>
                    <When condition={statusDictrict == "reject"}>
                        <Switch>
                            <Case condition={errorDistrict?.code === 404}>
                                <WarningCard title="Data Tidak Ditemukan">
                                    Mohon cek radius yang Anda masukkan atau coba lagi di tempat lainnya.
                                </WarningCard>
                            </Case>
                            <Default>
                                <WarningCard title="Terjadi Kesalahan">
                                    Hubungi customer service terkait masalah berikut atau coba lagi nanti.
                                </WarningCard>
                            </Default>
                        </Switch>
                    </When>

                    <When condition={statusDistrictOdpSummary == "resolve" && source == "district-odp" || source == "district-heatmap"}>
                        <div className="text-[14px]">
                            <ListItem title="Device Port" subTitle={odpSummary.deviceportnumber} />
                            <ListItem title="Idle Port" subTitle={odpSummary.portidlenumber} />
                            <ListItem title="Used Port" subTitle={odpSummary.deviceportnumber - odpSummary.portidlenumber} />
                            <ListItem title="Total ODP" subTitle={odpSummary.total_odp} />
                        </div>
                        <div className="text-[14px]">
                            <ListItem subTitle={odpSummary.status_occ_add.green}>
                                <div className="rounded-full w-[16px] h-[16px] bg-[#2FA52D]" />
                                <span className="ml-2">Green</span>
                            </ListItem>
                            <ListItem subTitle={odpSummary.status_occ_add.yellow}>
                                <div className="rounded-full w-[16px] h-[16px] bg-[#FFFF00]" />
                                <span className="ml-2">Yellow</span>
                            </ListItem>
                            <ListItem subTitle={odpSummary.status_occ_add.red}>
                                <div className="rounded-full w-[16px] h-[16px] bg-[#C00000]" />
                                <span className="ml-2">Red</span>
                            </ListItem>
                            <ListItem subTitle={odpSummary.status_occ_add.black_system}>
                                <div className="rounded-full w-[16px] h-[16px] bg-[#000000] border-2 border-[#2FA52D]" />
                                <span className="ml-2">Black Green</span>
                            </ListItem>
                            <ListItem subTitle={odpSummary.status_occ_add.black}>
                                <div className="rounded-full w-[16px] h-[16px] bg-[#000000]" />
                                <span className="ml-2">Black</span>
                            </ListItem>
                        </div>
                        <div className="border-y py-3">
                            <CheckBoxOdpArea
                                disabled={statusBuilding == "pending"}
                                value={source}
                                onChange={(e: SourceDistrictOdp) => {
                                    if (e == 'district-heatmap' && source == 'district-heatmap') {
                                        handleSource('district-odp')
                                    } else {
                                        handleSource(e);
                                    }
                                }}
                                options={[
                                    { label: "Show Heatmap Odp", value: "district-heatmap" },
                                ]}
                            />
                        </div>
                        <Button
                            disabled={
                                (statusDistrictOdpSummary != "resolve" && statusBuilding != "resolve") ||
                                statusDistrictOdpSummary == "pending" ||
                                statusBuilding == "pending"
                            }
                            onClick={() => setModalDistrict.setModal(true)}
                            className="w-full"
                        >
                            Lihat Daftar ODP
                        </Button>
                    </When>
                    <When condition={statusDistrictOdpSummary == "pending" || statusBuilding == "pending"}>
                        <Spinner />
                    </When>
                    <When condition={statusDistrictOdpSummary == "reject" || statusBuilding == "reject"}>
                        <Switch>
                            <Case condition={errorDistrictOdpSummary?.code === 404 || errorBuilding?.code === 404}>
                                <WarningCard title="ODP/Building Tidak Ditemukan">
                                    Mohon cek radius yang Anda masukkan atau coba lagi di tempat lainnya.
                                </WarningCard>
                            </Case>
                            <Case condition={errorDistrictOdpSummary?.code === 471 || errorBuilding?.code === 471}>
                                <WarningCard title="Tidak Diijinkan Melihat Data">
                                    Anda hanya dapat melihat data sesuai dengan daftar peran/tugas Anda.
                                </WarningCard>
                            </Case>
                            <Default>
                                <WarningCard title="Terjadi Kesalahan">
                                    Hubungi customer service terkait masalah berikut atau coba lagi nanti.
                                </WarningCard>
                            </Default>
                        </Switch>
                    </When>
                    <When condition={source == 'district-building' && statusBuilding == "resolve"}>
                        <Title className="mb-2" size="large">
                            Informasi Building
                        </Title>
                        <ListItem title="Building Count" subTitle={countTotal} />

                    </When>
                </div>
            </When>
        </FloatingMenu>
    );
}
