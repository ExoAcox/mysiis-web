import { fetchStreet } from "@features/planning/district-validation/queries";
import { mainMarker, circleRadiusStreet } from "@pages/planning/district-validation/maps-summary";
import { useRadiusStore } from "@features/planning/district-validation/store";

import { Card, RadiusSlider } from "@components/maps";

let debounce: NodeJS.Timeout;

const RadiusDistrict = () => {
    const radiusStore = useRadiusStore();
    const { radius } = radiusStore;

    return (
        <Card>
            <RadiusSlider
                value={radius}
                onChange={(radius) => {
                    radiusStore.set({ radius });

                    if (mainMarker.getPosition()) {
                        clearTimeout(debounce);

                        debounce = setTimeout(() => {
                            const latLng = mainMarker.getPosition()!;
                            circleRadiusStreet.setRadius(radius);

                            fetchStreet({
                                radius,
                                latLng: { lat: latLng.lat()!, lng: latLng.lng()! },
                            });
                        }, 1000);
                    }
                }}
                min={50}
                max={300}
                step={25}
            />
        </Card>
    );
};

export default RadiusDistrict;
