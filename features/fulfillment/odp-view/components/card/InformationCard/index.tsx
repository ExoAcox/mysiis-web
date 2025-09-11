import { useKelurahanStore } from "@features/fulfillment/odp-view/store";

import { Card } from "@components/maps";

import { CheckboxSection, KelurahanSection, OdpSection } from "./components";

const InformationCard: React.FC<{ access: Access; device: Device }> = ({ access, device }) => {
    const kelurahanStore = useKelurahanStore();

    if (kelurahanStore.status === "idle") return null;

    return (
        <Card className={device !== "mobile" ? "text-center" : "shadow-none"}>
            <KelurahanSection access={access} />
            <OdpSection />
            {/* <CheckboxSection access={access} device={device} /> */}
        </Card>
    );
};

export default InformationCard;
