import { RefObject } from "react";
import { toast } from "react-toastify";

import { useMapsSearchBoxStore } from "@libs/store";

import { searchTMaps, tmapsController } from "@api/district/metadata";

import { googleMapsEvent } from "@functions/maps";

import { MapsControllerProps } from "..";

type Source = "gmaps" | "tmaps";

const latLngRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

interface Props extends MapsControllerProps {
    googleMaps: Maps;
    searchBoxRef: RefObject<HTMLInputElement>;
}

export const eventListener = ({ googleMaps, onResultClick, access, searchBox, mapType, searchBoxRef }: Props) => {
    if (mapType) {
        googleMapsEvent("maps-searchbox-type", "click", () => {
            const type = document.getElementById("maps-searchbox-type")!.dataset.type as string;

            googleMaps.setMapTypeId(type);
        });
    }

    if (!searchBox || !onResultClick) return;
    if (access === "unauthorized") return;

    const searchBoxObject = new window.google.maps.places.AutocompleteService();
    const searchClick = new window.google.maps.places.PlacesService(googleMaps);

    const handleTMaps = (input: string, source: Source) => {
        searchTMaps(input)
            .then((resolve) => {
                if (source !== "tmaps") return;
                useMapsSearchBoxStore.setState({ data: resolve, status: "resolve" });
            })
            .catch((reject) => {
                if (reject?.code === 400) return;
                useMapsSearchBoxStore.setState({ data: [], status: "reject", error: reject });
            });
    };

    const handleGMaps = (input: string, source: Source) => {
        searchBoxObject.getPlacePredictions({ input, componentRestrictions: { country: "id" } }, (predictions, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                if (predictions?.length) {
                    if (source !== "gmaps") return;
                    useMapsSearchBoxStore.setState({ data: predictions, status: "resolve", error: null });
                } else {
                    useMapsSearchBoxStore.setState({ data: [], status: "reject", error: { message: "Data tidak ditemukan." } });
                }
            } else {
                useMapsSearchBoxStore.setState({ data: [], status: "reject", error: { message: "Terjadi kesalahan." } });
            }
        });
    };

    googleMapsEvent("maps-searchbox-form", "submit", (e: Event) => {
        e.preventDefault();

        const source = document.getElementById("maps-searchbox-source")?.dataset.source as Source;
        const input = (document.getElementById("maps-searchbox-input") as HTMLInputElement).value;

        if (latLngRegex.test(input)) {
            const latLng = input.split(",");
            const lat = parseFloat(latLng[0]);
            const lng = parseFloat(latLng[1]);

            return onResultClick({ lat, lng });
        }

        useMapsSearchBoxStore.setState({ data: [], status: "pending", error: null });
        if (source === "tmaps") {
            handleTMaps(input, source);
        } else {
            handleGMaps(input, source);
        }
    });

    let debounce: NodeJS.Timeout;

    googleMapsEvent("maps-searchbox-form", "keyup", () => {
        const source = document.getElementById("maps-searchbox-source")?.dataset.source as Source;
        const input = (document.getElementById("maps-searchbox-input") as HTMLInputElement).value;

        if (latLngRegex.test(input)) {
            return useMapsSearchBoxStore.setState({ data: [], status: "resolve", error: null });
        }

        if (source === "tmaps") {
            if (tmapsController) tmapsController.abort();
            useMapsSearchBoxStore.setState({ data: [], status: input ? "pending" : "resolve", error: null });

            clearTimeout(debounce);
            debounce = setTimeout(() => {
                handleTMaps(input, source);
            }, 1000);
        }
    });

    googleMapsEvent("maps-searchbox-result", "click", (e: Event) => {
        if (!(e.target as HTMLElement).closest(".maps-searchbox-result-list")) return;
        const target = (e.target as HTMLElement).closest(".maps-searchbox-result-list") as HTMLDivElement;

        searchBoxRef.current!.value = "";
        useMapsSearchBoxStore.setState({ data: [], status: "idle", error: null });
        const source = document.getElementById("maps-searchbox-source")?.dataset.source as Source;

        if (source === "gmaps") {
            const place_id = target.dataset.place_id!;

            searchClick.getDetails(
                {
                    placeId: place_id,
                    fields: ["name", "geometry"],
                },
                (place, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        if (!place?.geometry?.location) {
                            return toast.error("Lokasi tidak ditemukan");
                        }

                        const { location } = place.geometry;
                        onResultClick({ lat: location.lat(), lng: location.lng() });
                    } else {
                        toast.error("Terjadi kesalahan di Google Maps");
                    }
                }
            );
        } else {
            const lat = parseFloat(target.dataset.lat!);
            const lng = parseFloat(target.dataset.lng!);

            onResultClick({ lat, lng });
        }
    });
};
