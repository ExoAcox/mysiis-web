import { googleMapsInstance, infoWindowDemand } from "@features/planning/data-demand/components/maps/MapsPreview";

export const onMouseOverCluster = (cluster: { getMarkers: () => Marker[]; getCenter: () => LatLngFunction }) => {
    let scale10 = 0;
    let scale11 = 0;
    let scale12 = 0;
    let scaleOther = 0;

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
                scaleOther++;
                break;
        }
    });

    const content = `
    <div class="${"p-1 text-medium space-y-1"}">
        <div class="${"flex gap-1.5 items-center justify-between text-subtitle mb-3.5 whitespace-nowrap"}">
            <span>Total Responden</span>
            <span>: <b>${scale10 + scale11 + scale12 + scaleOther} orang</b></span>
        </div>
        <div class="${"flex gap-1.5 items-center justify-between whitespace-nowrap"}">
            <span class="${"w-40"}">Cenderung membutuhkan</span>
            <span>: ${scale10} orang</span>
        </div>
        <div class="${"flex gap-1.5 items-center justify-between whitespace-nowrap"}">
            <span class="${"w-40"}">Membutuhkan</span>
            <span>: ${scale11} orang</span>
        </div>
        <div class="${"flex gap-1.5 items-center justify-between whitespace-nowrap"}">
            <span class="${"w-40"}">Sangat membutuhkan</span>
            <span>: ${scale12} orang</span>
        </div>
    </div>`;

    infoWindowDemand.setContent(content);
    infoWindowDemand.setPosition(cluster.getCenter());
    infoWindowDemand.open(googleMapsInstance);
};