import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { When } from "react-if";

import { getServer, session } from "@libs/session";

import { SummaryPenetration } from "@api/district/summary";

import { createMap } from "@functions/maps";
import { tw } from "@functions/style";

import { tabOptionsOdpArea } from "@features/planning/odp-area/Functions";
import FilterDistrictSummary from "@features/planning/odp-area/components/FilterDistrictSummary";
import InfoDistrictSummary from "@features/planning/odp-area/components/InfoDistrictSummary";
import InfoDistrictSummaryMobile from "@features/planning/odp-area/components/Mobile/DistrictSummary/InfoDistrictSummary";
import ModalDetailInfo from "@features/planning/odp-area/components/Mobile/DistrictSummary/ModalDetailInfo";
import PageInfo from "@features/planning/odp-area/components/PageInfo";
import TableDistrictSummary from "@features/planning/odp-area/components/TableDistrictSummary";
import { clearDataDistrictSummary, fetchKabupatenDagri } from "@features/planning/odp-area/queries/DistrictSummary";
import { useSource, useSummaryPenetrasiOdpBuildingStore } from "@features/planning/odp-area/store";

import { Wrapper } from "@components/layout";
import { GoogleMaps, MapsController } from "@components/maps";
import { mapsController } from "@components/maps/MapsController";
import { TabBar } from "@components/navigation/NavigationBar/components";
import { Title } from "@components/text";

import { OdpAreaProps } from "..";

interface PolygonPenetration extends Polygon {
    data?: SummaryPenetration;
}

export let googleMapsDistrictSummary: Maps;
export let mainMarkerDistrictSummary: Marker;
export let polygonKelurahanDistrictSummary: Polygon;
export const districtSummaryPolygons: PolygonPenetration[] = [];
export const districtSummaryInfoWindows: InfoWindow[] = [];

const DistrictSummaryPage = ({ user, device }: OdpAreaProps) => {
    const router = useRouter();
    const [sourceStore, setSource] = useSource((state) => [state.source, state.setSource]);
    const [statusSummary] = useSummaryPenetrasiOdpBuildingStore((state) => [state.status]);
    const [isOpen, setOpen] = useState(false);
    const [mode, setMode] = useState("penetration");

    const handleHeight = () => {
        let height;
        if (isOpen) {
            height = "h-[765px]";
        } else {
            height = "h-[447px]";
        }
        return height;
    };

    const mapRef = useRef<HTMLDivElement>(null);

    const initialize = () => {
        googleMapsDistrictSummary = createMap(mapRef.current!, {
            zoomControl: false,
            zoom: device == "mobile" ? 4.3 : 5.3,
            gestureHandling: "cooperative",
        });

        mainMarkerDistrictSummary = new window.google.maps.Marker({
            map: googleMapsDistrictSummary,
            zIndex: 10,
        });

        polygonKelurahanDistrictSummary = new window.google.maps.Polygon({
            map: googleMapsDistrictSummary,
            paths: [],
            strokeWeight: 2,
            strokeColor: "#FF3300",
            fillOpacity: 0,
            clickable: false,
        });

        googleMapsDistrictSummary.addListener("click", (e: MapMouseEvent) => {
            const latLng = { lat: e.latLng!.lat(), lng: e.latLng!.lng() };
            mainMarkerDistrictSummary.setMap(googleMapsDistrictSummary);
            fetchKabupatenDagri(latLng);
        });

        mapsController(googleMapsDistrictSummary);
    };

    return (
        <Wrapper user={user} title="ODP Area" screenMax>
            <div className="w-full">
                <TabBar
                    screenMax
                    parentClassName="w-full gap-0 pl-[135px]"
                    wrapperClassName="w-[150px] flex items-center justify-center bg-white"
                    tab={{
                        value: "district-summary",
                        options: tabOptionsOdpArea,
                        onChange: (value) => {
                            router.push("/planning/odp-area/" + value);
                            setSource(value);
                            clearDataDistrictSummary();
                        },
                    }}
                />
                <PageInfo
                    className={tw(
                        "w-full text-[13px] bg-transparent border-none",
                        device == "mobile" ? "py-3 px-3 inline-block h-auto text-[12px] bg-white" : "px-[135px] my-[10px]"
                    )}
                >
                    Menampilkan data ODP sesuai Provinsi-Kabupaten, Data Penetrasi & Readiness dalam Peta
                </PageInfo>
            </div>
            <main className={tw("bg-white rounded-lg shadow-lg p-[24px] mb-5", device != "mobile" ? "mx-[135px]" : "shadow-none py-[10px]")}>
                <When condition={device != "mobile"}>
                    <Title>District Summary</Title>
                </When>
                <When condition={device == "mobile"}>
                    <MapsController
                        className="z-20"
                        mapType={false}
                        fullscreen={false}
                        device={device}
                        onResultClick={(latLng) => {
                            fetchKabupatenDagri(latLng);
                        }}
                    />
                </When>
                <FilterDistrictSummary
                    device={device}
                    onResultClick={(latLng) => {
                        fetchKabupatenDagri(latLng);
                    }}
                />
                <div className={tw("w-full relative rounded-lg overflow-hidden", device == "mobile" ? "h-[293px]" : handleHeight())}>
                    <GoogleMaps
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY_ODP_AREA}
                        onInit={initialize}
                        mapRef={mapRef}
                        state={{
                            "data-source": sourceStore,
                            "data-mode": mode,
                        }}
                    />
                    <When condition={device != "mobile"}>
                        <MapsController
                            onResultClick={(latLng) => {
                                fetchKabupatenDagri(latLng);
                            }}
                        />
                    </When>
                    <When condition={device == "mobile" && statusSummary == "resolve"}>
                        <InfoDistrictSummaryMobile />
                    </When>
                    <When condition={device != "mobile"}>
                        <InfoDistrictSummary isOpen={isOpen} setOpen={setOpen} mode={mode} setMode={setMode} />
                    </When>
                </div>
                <TableDistrictSummary device={device} />
            </main>
            <ModalDetailInfo mode={mode} setMode={setMode} />
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({
        context,
        permissions: ["district-data"],
    });

    return server;
});

export default DistrictSummaryPage;
