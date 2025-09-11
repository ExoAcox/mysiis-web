import { When } from "react-if";
import { useLocationStore, useStreetCountStore } from "@features/planning/district-validation/store";

import { Spinner } from "@components/loader";
import { Subtitle } from "@components/text";
import { Card } from "@components/maps";

const StreetCard: React.FC<{ access: Access }> = () => {
    const locationStore = useLocationStore();
    const streetCountStore = useStreetCountStore();

    if (locationStore.status === "idle") return null;

    return (
        <Card className={locationStore.status === "reject" ? "hidden" : "block"}>
            <When condition={locationStore.status === "pending"}>
                <Spinner />
            </When>
            <When condition={locationStore.status === "resolve"}>
                <Subtitle className="w-full font-bold text-center">Ditemukan {streetCountStore.data} Jalan</Subtitle>
                <div className="pt-2 mt-2 border-t">
                    <Subtitle className="text-center">{locationStore.data.streetAddress}</Subtitle>
                </div>
            </When>
        </Card>
    );
};

export default StreetCard;
