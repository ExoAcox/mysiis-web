import { useRef, useState } from "react";
import { When } from "react-if";

import useMediaQuery from "@hooks/useMediaQuery";
import useModal from "@hooks/useModal";

import { createMap } from "@functions/maps";

import { InputProps } from "@features/profile/components/Address/components/AddressForm";
import { Kelurahan, useKelurahan } from "@features/profile/store";

import { Button } from "@components/button";
import { FloatingMenu, Modal } from "@components/layout";
import { Card, GoogleMaps, MapsController } from "@components/maps";
import { mapsController } from "@components/maps/MapsController";
import { ModalTitle, Subtitle } from "@components/text";

export let googleMaps: Maps;
export let markerPin: Marker;

export interface AddressMapsModalProps {
    access?: Access;
    setLocationData: (value: string) => void;
    input: InputProps;
    setInput: (value: InputProps) => void;
    fetchKota: (value: string) => void;
    fetchKecamatan: (provinsi: string, kabupaten: string) => void;
    setLoading: (value: boolean) => void;
}

const AddressMapsModal = ({
    access,
    setLocationData,
    input,
    setInput,
    fetchKota,
    fetchKecamatan,
    setLoading,
}: AddressMapsModalProps): JSX.Element => {
    const { modal, setModal } = useModal("modal-profile-address-maps");

    const [latLng, setLatLng] = useState<LatLng>();

    const kelurahan = useKelurahan(latLng);

    const mapRef = useRef<HTMLDivElement>(null);

    const { isMobile } = useMediaQuery(767, { debounce: false });

    const initialize = () => {
        googleMaps = createMap(mapRef.current!);

        markerPin = new window.google.maps.Marker({
            map: googleMaps,
            zIndex: 10,
        });

        googleMaps.addListener("click", (e: MapMouseEvent) => {
            const latLng = { lat: e.latLng!.lat(), lng: e.latLng!.lng() };

            resetData();
            setLatLng(latLng);
            markerPin?.setPosition(latLng);
            googleMaps?.panTo(latLng);
            if ((googleMaps?.getZoom() || 0) < 17) googleMaps?.setZoom(17);
        });

        mapsController(googleMaps);
    };

    const resetData = () => {
        setLatLng(undefined);
    };

    const formattedData = {
        ...input,
        addressProvince: (kelurahan.data as Kelurahan)?.provinsi,
        addressCity: (kelurahan.data as Kelurahan)?.kota,
        addressSubDistrict: (kelurahan.data as Kelurahan)?.kecamatan,
    };

    const handleSave = () => {
        setLoading(true);
        setLocationData((kelurahan.data as Kelurahan)?.formattedAddress || "");
        setInput(formattedData);
        fetchKota(formattedData.addressProvince || "");
        fetchKecamatan(formattedData.addressProvince || "", formattedData.addressCity || "");
        setModal(false);
        resetData();
        setLoading(false);
    };

    return (
        <Modal visible={modal} className="w-full p-6 rounded-xl" onClose={resetData}>
            <div className="flex flex-col gap-4">
                <ModalTitle
                    onClose={() => {
                        setModal(false);
                        resetData();
                    }}
                    className="text-large"
                >
                    Cari Alamat
                </ModalTitle>
                <div className="relative w-full h-[70vh]">
                    <div className="absolute inset-0 overflow-hidden">
                        <GoogleMaps onInit={initialize} mapRef={mapRef} />
                        <div className="absolute top-0 w-full pt-2 pr-6">
                            <MapsController
                                access={access}
                                onResultClick={(latLng) => {
                                    resetData();
                                    setLatLng(latLng);
                                }}
                                mapType={false}
                                fullscreen={false}
                                device={isMobile ? "mobile" : "desktop"}
                                className="left-3 w-fit"
                            />
                        </div>

                        <When condition={!!kelurahan.data}>
                            <FloatingMenu className="w-[22.875rem] z-[1] pt-2 md:w-full">
                                <div className="flex justify-center overflow-auto scrollbar-hidden h-fit md:absolute md:bottom-0 md:inset-x-0">
                                    <Card className="mt-16" data-testid="information-card">
                                        <Subtitle>{(kelurahan.data as Kelurahan)?.formattedAddress}</Subtitle>
                                        <Button className="w-full mt-4" onClick={() => handleSave()}>
                                            Pilih Alamat
                                        </Button>
                                    </Card>
                                </div>
                            </FloatingMenu>
                        </When>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddressMapsModal;
