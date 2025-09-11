import { OdpSource } from "@api/odp";

import { circleRadius, markerPin, polygonBoundary } from "@pages/fulfillment/odp-view";

import { fetchOdp } from "@features/fulfillment/odp-view/queries";
import { useFilterStore } from "@features/fulfillment/odp-view/store";

import { TabButton } from "@components/button";

import { Props } from "../..";

const SourceButton: React.FC<Props> = ({ access, mapState }) => {
    const filterStore = useFilterStore();

    return (
        <TabButton
            value={filterStore.source}
            onChange={(value) => {
                const source = value as OdpSource;
                let filters = filterStore.filters;

                if (source === "underspec") {
                    filters = [];

                    polygonBoundary.setPaths([]);
                    circleRadius.setRadius(filterStore.radius);
                }

                filterStore.set({ source, filters });

                if (markerPin.getPosition()) {
                    const latLng = markerPin.getPosition()!;
                    fetchOdp({
                        access,
                        source,
                        filters,
                        radius: Number(mapState().radius),
                        latLng: { lat: latLng.lat()!, lng: latLng.lng()! },
                    });
                }
            }}
            options={[
                { label: "UIM", value: "uim" },
                { label: "Valins", value: "valins" },
            ]}
            className="mb-3"
        />
    );
};

export default SourceButton;
