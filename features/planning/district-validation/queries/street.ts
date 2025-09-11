import { googleMaps, polylineStreets } from "@pages/planning/district-validation/maps-summary";

import { getStreet } from "@api/district/metadata";
import { useStreetCountStore } from "../store";
import { errorHelper } from "@functions/common";

interface GetStreet {
    latLng: LatLng;
    radius: number;
}

const fetchStreet = async (args: GetStreet) => {
    const { latLng, radius } = args;

    polylineStreets.forEach((x) => x.setMap(null));

    try {
        const streetAddress = await getStreet({ lat: latLng.lat, long: latLng.lng, radius });

        streetAddress.forEach((data) => {
            const multiline = data.geom!.includes("MULTILINESTRING");

            if (multiline) {
                data.geom!
                    .slice(17, -2)
                    .split("),(")
                    .forEach((data2) => {
                        const path = data2.split(",").map((row) => {
                            const split = row.split(" ");
                            return { lat: parseFloat(split[1]), lng: parseFloat(split[0]) };
                        });

                        const line = new window.google.maps.Polyline({
                            map: googleMaps,
                            path,
                            strokeColor: "green",
                            strokeOpacity: 1,
                            strokeWeight: 5,
                            zIndex: 0,
                        });

                        const bounds = new window.google.maps.LatLngBounds();
                        path.forEach((bound) => bounds.extend(bound));

                        line.set(
                            "infoWindow",
                            new window.google.maps.InfoWindow({
                                content: data.st_name,
                            })
                        );

                        line.addListener("mouseover", () => {
                            line.get("infoWindow").setPosition(bounds.getCenter());
                            line.get("infoWindow").open(googleMaps, line);
                        });

                        line.addListener("mouseout", () => {
                            line.get("infoWindow").close();
                        });

                        polylineStreets.push(line);
                    });
            } else {
                const path = data.geom!
                    .slice(11, -1)
                    .replaceAll("),(", ",")
                    .split(",")
                    .map((row) => {
                        const split = row.split(" ");
                        return { lat: parseFloat(split[1]), lng: parseFloat(split[0]) };
                    });

                const line = new window.google.maps.Polyline({
                    map: googleMaps,
                    path,
                    strokeColor: "green",
                    strokeOpacity: 1,
                    strokeWeight: 5,
                    zIndex: 0,
                });

                polylineStreets.push(line);
            }
        });

        useStreetCountStore.setState({ data: streetAddress.length, status: "resolve" });
    } catch(error){
        useStreetCountStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export default fetchStreet;
