import { markerPin, circleRadius } from "@pages/fulfillment/odp-view";
import { fetchOdp } from "@features/fulfillment/odp-view/queries";
import { useFilterStore } from "@features/fulfillment/odp-view/store";

import { RadiusSlider } from "@components/maps";

let debounce: NodeJS.Timeout;

const Radius: React.FC<{ access: Access }> = ({ access }) => {
    const filterStore = useFilterStore();
    const { source, filters, radius } = filterStore;

    return (
        <RadiusSlider
            value={radius}
            onChange={(radius) => {
                filterStore.set({ radius });

                clearTimeout(debounce);
                debounce = setTimeout(() => {
                    const latLng = markerPin.getPosition()!;
                    circleRadius.setRadius(radius);

                    fetchOdp({
                        access,
                        source,
                        filters,
                        radius,
                        latLng: { lat: latLng.lat()!, lng: latLng.lng()! },
                    });
                }, 1000);
            }}
            min={50}
            max={300}
            step={25}
            className="mt-1.5"
        />
    );
};

export default Radius;
