import Filter from "@public/images/vector/filter.svg";
// import { logEvent } from "firebase/analytics";
import { GetServerSideProps } from "next";
import React, { useEffect, useRef, useState } from "react";
import { When } from "react-if";

// import { analytic } from "@libs/firebase";
import { getServer, session } from "@libs/session";

import { OdpSource } from "@api/odp";

import useModal from "@hooks/useModal";
import useProfile from "@hooks/useProfile";

import { createMap } from "@functions/maps";

import IconDraw from "@images/vector/icon-draw.svg";

import FloatingTab from "@features/planning/mysiista/components/FloatingTab";
import BottomSheetInfo from "@features/planning/mysiista/components/Mobile/BottomSheetInfo";
import ModalFilter from "@features/planning/mysiista/components/Mobile/ModalFilter";
import ModalAddSuccess from "@features/planning/mysiista/components/ModalAddSuccess";
import ModalDrawingPolygon from "@features/planning/mysiista/components/ModalDrawingPolygon";
import StreetInfor from "@features/planning/mysiista/components/StreetInfo";
import { handleSetAddress } from "@features/planning/mysiista/function/address";
import { handleReset } from "@features/planning/mysiista/function/drawing";
import { defaultOption, fetchProvinsi } from "@features/planning/mysiista/queries/address";
import { fetchKelurahanByLocation, resetData } from "@features/planning/mysiista/queries/odp";
import { fetchDataToken } from "@features/planning/mysiista/queries/surveyor";
import { useKabupatenStore, useKecamatanStore, useKelurahanStore, useProvinsiStore } from "@features/planning/mysiista/store/address";
import { useOdpPercentStore, useSourceastore } from "@features/planning/mysiista/store/odp";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { FloatingMenu, Wrapper } from "@components/layout";
import { GoogleMaps, RadiusSlider } from "@components/maps";
import MapsController, { mapsController } from "@components/maps/MapsController";
import { SheetRef } from "@components/navigation/BottomSheet";
import { TabBar } from "@components/navigation/NavigationBar/components";

interface MySiistaProps {
    user: User;
    access: Access;
    device: Device;
}

let debounce1: NodeJS.Timeout;
let debounce2: NodeJS.Timeout;

export let googleMapsMysiista: Maps;
export let markerPinMysiista: Marker;
export let circleRadiusMysiista: Circle;
export let polygonBoundaryMysiista: Polygon;
export const markerOdpMySiista: Marker[] = [];
export const markerUsersMySiista: Marker[] = [];
export const polygonsOdpMySiista: Polygon[] = [];

export default function MySiista({ user, access, device }: MySiistaProps) {
    const profile = useProfile();

    const mapRef = useRef<HTMLDivElement>(null);
    const mapState: MapState = () => mapRef.current!.dataset;

    const [source, radius, setSource] = useSourceastore((state) => [state.source, state.radius, state.set]);
    const [listProvinsi] = useProvinsiStore((state) => [state.provinsi]);
    const [listKabupaten] = useKabupatenStore((state) => [state.kabupaten]);
    const [listKecamatan] = useKecamatanStore((state) => [state.kecamatan]);
    const [listKelurahan, dataKelurahan] = useKelurahanStore((state) => [state.kelurahan, state.listKelurahan]);
    const [statusOdpInfo] = useOdpPercentStore((state) => [state.status]);
    const [address, setAddress] = useState(defaultOption);
    const { setModal: setModalFilter } = useModal("moda-filter");
    const { setData: setDataSheet } = useModal("moda-drawing-polygon");
    const sheetRef = useRef<SheetRef>(null);

    const initialize = () => {
        googleMapsMysiista = createMap(mapRef.current!, {
            zoomControl: device == "mobile" ? false : true,
        });

        markerPinMysiista = new window.google.maps.Marker({
            map: googleMapsMysiista,
            zIndex: 10,
        });

        circleRadiusMysiista = new window.google.maps.Circle({
            map: googleMapsMysiista,
            strokeColor: "#FF0000",
            strokeOpacity: 0,
            strokeWeight: 0,
            fillColor: "#FF0000",
            fillOpacity: 0.2,
            zIndex: 2,
        });

        polygonBoundaryMysiista = new window.google.maps.Polygon({
            map: googleMapsMysiista,
            strokeWeight: 3,
            strokeColor: "#388e3c",
            fillColor: "#FF0000",
            fillOpacity: 0.2,
            zIndex: 4,
        });

        googleMapsMysiista.addListener("click", (e: MapMouseEvent) => {
            const latLng = { lat: e.latLng!.lat(), lng: e.latLng!.lng() };
            fetchKelurahanByLocation(latLng, mapState().source as OdpSource, Number(mapState().radius));
            fetchDataToken();
            resetData();
            setAddress(defaultOption);
        });
        googleMapsMysiista.addListener("dragend", () => {
            fetchDataToken();
        });
        googleMapsMysiista.addListener("zoom_changed", () => {
            fetchDataToken();
        });

        mapsController(googleMapsMysiista);
    };

    // unmount
    useEffect(
        () => () => {
            handleReset();
        },
        []
    );

    useEffect(() => {
        fetchProvinsi();
    }, []);

    useEffect(() => {
        if (address.kelurahan != "") {
            const kelurahan = dataKelurahan.find((e) => e.kelurahan == address.kelurahan);
            if (kelurahan) {
                const latLng = { lat: kelurahan?.lat, lng: kelurahan?.long };
                fetchKelurahanByLocation(latLng, mapState().source as OdpSource, Number(mapState().radius));
            }
        }
    }, [address.kelurahan]);

    // useEffect(() => {
    //     if (analytic && process.env.NODE_ENV === "production" && user.userId) {
    //         logEvent(analytic, "mysiis_mysiista_hit", {
    //             userId: user.userId,
    //             regional: user?.regional ?? "",
    //             witel: user?.witel ?? "",
    //             role: profile.role_details?.name ?? "",
    //             platform: "web",
    //         });
    //     }
    // }, [analytic]);

    const handleBtn = () => {
        setTimeout(() => {
            const postition = {
                lat: markerPinMysiista.getPosition()?.lat(),
                lng: markerPinMysiista.getPosition()?.lng(),
            };
            setDataSheet(postition);
        }, 500);
    };

    return (
        <Wrapper user={user} title="MySiista" screenMax>
            <When condition={device == "mobile"}>
                <TabBar
                    screenMax
                    parentClassName="w-full gap-0 pl-[135px]"
                    wrapperClassName="w-[150px] flex items-center justify-center bg-white"
                    tab={{
                        value: source,
                        options: [
                            {
                                label: "UIM",
                                value: "uim",
                            },
                            {
                                label: "Valins",
                                value: "valins",
                            },
                        ],
                        onChange: (value) => {
                            setSource(value as "uim" | "valins");
                            if (markerPinMysiista.getPosition()) {
                                clearTimeout(debounce1);
                                debounce1 = setTimeout(() => {
                                    const latLng = markerPinMysiista.getPosition()!;
                                    fetchKelurahanByLocation(
                                        { lat: latLng.lat()!, lng: latLng.lng()! },
                                        source as OdpSource,
                                        Number(mapState().radius)
                                    );
                                }, 1000);
                            }
                        },
                    }}
                />
                <div className="bg-[#DEEBFF] border-y-2 border-y-[#2684FF] px-[16px] py-[6px] text-[12px]">
                    Menentukan batasan area/wilayah yang ingin disurvey pada aplikasi survey microdemand di seluruh Telkom Regional & Witel
                </div>
            </When>
            <div className="absolute w-full h-full">
                <GoogleMaps
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY_MYSIISTA}
                    className="h-full"
                    onInit={initialize}
                    mapRef={mapRef}
                    state={{
                        "data-source": source,
                        "data-radius": radius,
                    }}
                />
                <div className={device == "mobile" ? "absolute top-0 flex w-full gap-2 p-2" : ""}>
                    <MapsController
                        className="z-10"
                        mapType={device == "mobile" ? false : true}
                        fullscreen={false}
                        device={device}
                        access={access}
                        onResultClick={(latLng) => {
                            fetchKelurahanByLocation(latLng, mapState().source as OdpSource, Number(mapState().radius));
                            fetchDataToken();
                            resetData();
                            setAddress(defaultOption);
                        }}
                        onFocus={() => device == "mobile" && sheetRef.current!.snapTo(0)}
                    />
                    <Button variant="ghost" onClick={() => setModalFilter(true)}>
                        <Filter />
                        Filter
                    </Button>
                </div>
                <When condition={device != "mobile"}>
                    <FloatingMenu className="w-[22.875rem] z-[1]">
                        <div className="rounded-lg shadow-lg p-[16px] bg-white z-20">
                            <FloatingTab
                                onChange={(source) => {
                                    if (markerPinMysiista.getPosition()) {
                                        clearTimeout(debounce1);
                                        debounce1 = setTimeout(() => {
                                            const latLng = markerPinMysiista.getPosition()!;
                                            fetchKelurahanByLocation(
                                                { lat: latLng.lat()!, lng: latLng.lng()! },
                                                source as OdpSource,
                                                Number(mapState().radius)
                                            );
                                        }, 1000);
                                    }
                                }}
                            />
                            <div className="mt-2 text-[12px]">
                                Menampilkan perbandingan data district & street di SIIS dan NCX untuk kebutuhan update data NCX
                            </div>
                            <RadiusSlider
                                value={radius}
                                className="mt-3"
                                min={50}
                                max={300}
                                step={25}
                                onChange={(e) => {
                                    useSourceastore.setState({ radius: e });
                                    if (markerPinMysiista.getPosition()) {
                                        clearTimeout(debounce2);
                                        debounce2 = setTimeout(() => {
                                            circleRadiusMysiista.setRadius(e);
                                            const latLng = markerPinMysiista.getPosition()!;
                                            fetchKelurahanByLocation(
                                                { lat: latLng.lat()!, lng: latLng.lng()! },
                                                mapState().source as OdpSource,
                                                Number(mapState().radius)
                                            );
                                        }, 1000);
                                    }
                                }}
                            />
                            <div className="flex flex-col gap-2 mt-3">
                                <Dropdown
                                    label="Provinsi"
                                    id="filter-odp-area-odp-summary"
                                    placeholder="Pilih Provinsi"
                                    value={address.provinsi}
                                    options={listProvinsi}
                                    onChange={(value) => {
                                        setAddress({ ...address, provinsi: value });
                                        handleSetAddress("kabupaten", { provinsi: value });
                                    }}
                                    className="w-full md:w-[70vw] overflow-hidden"
                                />
                                <When condition={listKabupaten[0].value != ""}>
                                    <Dropdown
                                        label="Kabupaten / Kota"
                                        id="filter-odp-area-odp-summary"
                                        placeholder="Pilih Kabupaten"
                                        value={address.kabupaten}
                                        options={listKabupaten}
                                        onChange={(value) => {
                                            setAddress({ ...address, kabupaten: value });
                                            handleSetAddress("kecamatan", { provinsi: address.provinsi, kabupaten: value });
                                        }}
                                        className="w-full md:w-[70vw] overflow-hidden"
                                    />
                                </When>
                                <When condition={listKecamatan[0].value != ""}>
                                    <Dropdown
                                        label="Kecamatan"
                                        id="filter-odp-area-odp-summary"
                                        placeholder="Pilih Kecamatan"
                                        value={address.kecamatan}
                                        options={listKecamatan}
                                        onChange={(value) => {
                                            setAddress({ ...address, kecamatan: value });
                                            handleSetAddress("kelurahan", {
                                                provinsi: address.provinsi,
                                                kabupaten: address.kabupaten,
                                                kecamatan: value,
                                            });
                                        }}
                                        className="w-full md:w-[70vw] overflow-hidden"
                                    />
                                </When>
                                <When condition={listKelurahan[0].value != ""}>
                                    <Dropdown
                                        label="Kelurahan"
                                        id="filter-odp-area-odp-summary"
                                        placeholder="Pilih Kelurahan"
                                        value={address.kelurahan}
                                        options={listKelurahan}
                                        onChange={(value) => {
                                            setAddress({ ...address, kelurahan: value });
                                        }}
                                        className="w-full md:w-[70vw] overflow-hidden"
                                    />
                                </When>
                            </div>
                        </div>
                        <StreetInfor />
                    </FloatingMenu>
                </When>
            </div>
            <ModalDrawingPolygon device={device} />
            <ModalAddSuccess />
            <ModalFilter
                onChange={(e) => useSourceastore.setState({ radius: e })}
                onClick={() => {
                    setModalFilter(false);
                    if (markerPinMysiista.getPosition()) {
                        clearTimeout(debounce2);
                        debounce2 = setTimeout(() => {
                            circleRadiusMysiista.setRadius(radius);
                            const latLng = markerPinMysiista.getPosition()!;
                            fetchKelurahanByLocation(
                                { lat: latLng.lat()!, lng: latLng.lng()! },
                                mapState().source as OdpSource,
                                Number(mapState().radius)
                            );
                        }, 1000);
                    }
                }}
            />
            <When condition={statusOdpInfo == "resolve" && device == "mobile"}>
                <Button onClick={() => handleBtn()} className="absolute bottom-0 -translate-y-[140%] w-[50%] ml-[24%]">
                    <IconDraw className="text-2xl text-white" />
                    Gambar Polygon
                </Button>
            </When>
            <BottomSheetInfo sheetRef={sheetRef} device={device} />
        </Wrapper>
    );
}

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context, permissions: ["development"] });

    return server;
});
