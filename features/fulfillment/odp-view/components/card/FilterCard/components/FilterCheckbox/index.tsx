import { When } from "react-if";

import { OdpSource } from "@api/odp";

import { circleRadius, markerPin, polygonBoundary } from "@pages/fulfillment/odp-view";

import { filterOdp } from "@features/fulfillment/odp-view/functions/odp";
import { fetchOdp } from "@features/fulfillment/odp-view/queries";
import { OdpFilter, useFilterStore, useOdpStore, useSecondOdpStore } from "@features/fulfillment/odp-view/store";

import { CheckBox } from "@components/radio";

import { Props } from "../..";

const FilterCheckBox: React.FC<Props> = ({ access, mapState }) => {
    const odpStore = useOdpStore();
    const secondOdpStore = useSecondOdpStore();
    const filterStore = useFilterStore();
    const { filters, radius, source } = filterStore;

    const boundary = source !== "underspec" ? [{ label: "Boundary", value: "boundary" }] : [];

    return (
        <When condition={odpStore.status === "resolve" && secondOdpStore.status === "resolve"}>
            <CheckBox
                variant="inline"
                value={filters}
                onChange={(values, dataValue) => {
                    const filters = values as OdpFilter[];

                    if (!markerPin.getPosition()) return;

                    if (dataValue.value === "boundary") {
                        const isActive = filters.includes("boundary");
                        filterStore.set({ filters: isActive ? ["boundary"] : "" });

                        polygonBoundary.setPaths([]);
                        circleRadius.setRadius(radius);
                        const latLng = markerPin.getPosition()!;

                        fetchOdp({
                            access,
                            filters,
                            source: mapState().source as OdpSource,
                            radius: Number(mapState().radius),
                            latLng: { lat: latLng.lat()!, lng: latLng.lng()! },
                        });
                    } else {
                        filterStore.set({ filters });
                        filterOdp(filters);
                    }
                }}
                options={[{ label: "Ready", value: "ready" }, { label: "Nearby", value: "nearby" }, ...boundary]}
                className="mb-3"
            />
        </When>
    );
};

export default FilterCheckBox;
