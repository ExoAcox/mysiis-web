import { mathRandom } from "@functions/common";

import { clusterDemands, googleMaps, infoWindowDemand, markerDemands } from "@pages/planning/data-demand/maps-summary";

export const customClustererIcon = (color: string) => {
    const encoded = window.btoa(
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-100 -100 200 200"><defs><g id="a" transform="rotate(45)"><path d="M0 47A47 47 0 0 0 47 0L62 0A62 62 0 0 1 0 62Z" fill-opacity="0.7"/><path d="M0 67A67 67 0 0 0 67 0L81 0A81 81 0 0 1 0 81Z" fill-opacity="0.5"/><path d="M0 86A86 86 0 0 0 86 0L100 0A100 100 0 0 1 0 100Z" fill-opacity="0.3"/></g></defs><g fill="' +
            color +
            '"><circle r="42"/><use xlink:href="#a"/><g transform="rotate(120)"><use xlink:href="#a"/></g><g transform="rotate(240)"><use xlink:href="#a"/></g></g></svg>'
    );

    return "data:image/svg+xml;base64," + encoded;
};

export const filterRespondentByScale = (scales: number[]) => {
    infoWindowDemand.close();
    clusterDemands.clearMarkers();

    const markers = markerDemands.filter((marker) => {
        return scales.includes(marker.get("scale"));
    });

    clusterDemands.addMarkers(markers);
};

const scales = [10, 11, 12];
export const getRandomScaleOfNeedId = () => {
    const scale = scales[Math.floor(mathRandom() * scales.length)];
    return scale;
};

export const onMouseOverCluster = (cluster: { getMarkers: () => Marker[]; getCenter: () => LatLngFunction }) => {
    let scale10 = 0;
    let scale11 = 0;
    let scale12 = 0;

    const markers = cluster.getMarkers();
    markers.forEach((marker) => {
        switch (marker.get("scale")) {
            case 10:
                scale10++;
                break;
            case 11:
                scale11++;
                break;
            case 12:
                scale12++;
                break;
            default:
                break;
        }
    });

    const section = (label: string, value: string | number) => {
        return `
        <div class="${"flex gap-1.5 items-center"}">
            <span class="${"shrink-0 w-40"}">${label}</span>
            <span class="${"whitespace-nowrap"}">: ${value} orang</span>
        </div>`;
    };

    const content = `
    <div class="${"p-1 text-medium space-y-1"}">
        <div class="${"flex gap-1.5 items-center text-subtitle mb-3.5"}">
            <span class="${"shrink-0 w-40"}">Total Responden</span>
            <span class="${"whitespace-nowrap"}">: <b>${scale10 + scale11 + scale12} orang</b></span>
        </div>
        ${section("Cenderung membutuhkan", scale10)}
        ${section("Membutuhkan", scale11)}
        ${section("Sangat membutuhkan", scale12)}
    </div>`;

    infoWindowDemand.setContent(content);
    infoWindowDemand.setPosition(cluster.getCenter());
    infoWindowDemand.open(googleMaps);
};
