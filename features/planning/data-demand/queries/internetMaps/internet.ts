import { googleMaps, markerPin, markerDemands } from "@pages/planning/data-demand/internet-summary";

import { useModalOutside } from "@hooks/useModal";

import { getAllMultilayer } from "@api/multilayer/feedback";

import { errorHelper } from "@functions/common";

import { useDataInternetStore } from "@features/planning/data-demand/store/internetMaps";

interface Props {
    kelurahan: string;
    predict: string[];
    cluster: string[];
}

const fetchInternet = async (args: Props, access: Access) => {
    const { kelurahan, predict, cluster } = args;

    if (access !== "allowed") return;

    useDataInternetStore.setState({ lists: [], totalData: 0, status: "pending" });

    try {
        const demands = await getAllMultilayer({ kelurahan });

        const filterCluster = demands.lists?.filter((demand) => cluster.includes(demand.cluster));
        const filterPredict = filterCluster?.filter((demand) => predict.join().includes(String(demand.prediksi)));

        const bounds = new window.google.maps.LatLngBounds();

        filterPredict?.forEach((demand) => {
            let color;
            switch (demand.prediksi) {
                case 1:
                case 2:
                case 3:
                    color = "%23EA001E";
                    break;
                case 4:
                case 5:
                    color = "%23F96408";
                    break;
                case 6:
                case 7:
                    color = "%23C7920C";
                    break;
                case 8:
                case 9:
                case 10:
                    color = "%2336A42B";
                    break;
                default:
                    color = "black";
            }

            const marker: Marker = new window.google.maps.Marker({
                map: googleMaps,
                position: { lat: Number(demand.lat), lng: Number(demand.long) },
                zIndex: 2,
                icon: {
                    anchor: new window.google.maps.Point(10, 10),
                    url: `data:image/svg+xml;utf-8, \
                        <svg width="20" height="20" viewBox="0 0 35 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 5C0 2.23858 2.23858 0 5 0H30C32.7614 0 35 2.23858 35 5V30C35 32.7614 32.7614 35 30 35H5C2.23858 35 0 32.7614 0 30V5Z" fill="${color}"/>  
                            <path d="M22 35H13L17.5 41L22 35Z" fill="${color}"/>
                        </svg>`,
                },
            });

            const section = (label: string, value: string | number) => {
                return `
                <div class="${"flex gap-1.5"}">
                    <span class="${"shrink-0 w-[3.5rem]"}">${label}</span>
                    <span class="${"whitespace-nowrap"}">: <b class="${"font-bold"}">${value}</b></span>
                </div>`;
            };

            const content = `
            <div class="${"p-1 text-medium space-y-1 text-black-90"}">
                ${section("ID", demand._id || "-")}
                ${section("Provinsi", demand.provinsi || "-")}
                ${section("Occ rate", demand.occ_rate || "-")}
                ${section("Prediksi", demand.prediksi || "-")}
                ${section("Cluster", demand.cluster || "-")}
                ${section("Lat", demand.lat || "-")}
                ${section("Long", demand.long || "-")}
                <div class="text-center font-bold">
                    <button id="btn-click" class="p-1 w-full border-2 border-secondary-30 rounded">
                        Lihat Detail
                    </button>
                </div>
            </div>`;

            marker.set(
                "infoWindow",
                new window.google.maps.InfoWindow({
                    content,
                })
            );

            marker.addListener("mouseover", () => {
                markerDemands.forEach((marker) => marker.get("infoWindow").close());
                marker.get("infoWindow").open(googleMaps, marker);
            });

            const mouseout = marker.addListener("mouseout", () => {
                markerDemands.forEach((marker) => marker.get("infoWindow").close());
            });

            marker.addListener("click", async () => {
                markerDemands.forEach((marker) => marker.get("infoWindow").close());
                marker.get("infoWindow").open(googleMaps, marker);
                window.google.maps.event.removeListener(mouseout);

                setTimeout(() => {
                    const button = document.getElementById("btn-click");
                    if (button) {
                        button.addEventListener("click", () => {
                            useModalOutside("modal-detail-internet-demand", { visible: true, data: demand });
                        });
                    }
                }, 1000);
            });

            markerDemands.push(marker);
            bounds.extend(new window.google.maps.LatLng(Number(demand.lat), Number(demand.long)));
        });

        googleMaps.fitBounds(bounds);

        if (!filterPredict.length) {
            if (markerPin.getPosition()) googleMaps.panTo(markerPin.getPosition()!);
            if (googleMaps.getZoom()! < 17) googleMaps.setZoom(17);
        }

        useDataInternetStore.setState({ lists: filterPredict, totalData: filterPredict.length, status: "resolve" });
    } catch (error) {
        useDataInternetStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export default fetchInternet;
