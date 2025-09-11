import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";
import { Button } from "@components/button";
import { Link } from "@components/navigation";

import Maps from "@images/vector/maps.svg";

import { ListAllCompetitor } from "@api/odp/competitor";

const DetailTableModal = (): JSX.Element => {
    const { modal, setModal, data } = useModal<ListAllCompetitor>("modal-data-competitor-table-detail");

    return (
        <Modal visible={modal} className="p-6 w-fit rounded-xl">
            <div className="flex flex-col gap-4">
                <ModalTitle onClose={() => setModal(false)} className="text-large">
                    Detail Competitor
                </ModalTitle>
                <div className="flex gap-8 max-h-[62vh] px-4 overflow-auto md:gap-4 md:max-h-none md:flex-col">
                    <div className="flex flex-col flex-1 w-full gap-2 text-sm">
                        <List label="Device ID">{data?.device_id || "-"}</List>
                        <List label="Device Name">{data?.devicename || "-"}</List>
                        <List label="Regional">{data?.regional || "-"}</List>
                        <List label="Witel">{data?.witel || "-"}</List>
                        <List label="STO Name">{data?.stoname || "-"}</List>
                        {/* <List label="Kecamatan">{"-"}</List> */}
                        <List label="Status OCC">{data?.status_occ || "-"}</List>
                        <List label="Provider">{data?.provider || "-"}</List>
                        <List label="Competitor Speed">{data?.competitor_speed || 0}</List>
                        <List label="Competitor Price">{data?.competitor_price || 0}</List>
                        <List label="Latency Competitor AVG">{data?.latency_competitor_avg_ms || 0}</List>
                        <List label="Latency Competitor Min">{data?.latency_competitor_min_ms || 0}</List>
                        <List label="Latency Telkom AVG">{data?.latency_telkom_avg_ms || 0}</List>
                        <List label="Latency Telkom Max">{data?.latency_telkom_max_ms || 0}</List>
                        <List label="Latency Telkom Min">{data?.latency_telkom_min_ms || 0}</List>
                        <List label="Telkom Paket Speed Flag">{data?.telkom_pkg_speed_flag || "-"}</List>
                        <List label="Telkom Paket Speed Internet Price">{data?.telkom_pkg_speed_internet_price || 0}</List>
                        <List label="Competitor Count Diff">{data?.competitor_count_diff || 0}</List>
                        <List label="Competitor Latency Diff">{data?.competitor_latency_diff || 0}</List>
                        <List label="Competitor Price Diff">{data?.competitor_price_diff || 0}</List>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-4 md:flex-col">
                    <Link href={`/fulfillment/odp-view?lat=${data.lat}&lng=${data.long}`} target="_blank" className="w-fit md:w-full">
                        <Button onClick={() => setModal(false)} className="w-fit md:w-full" labelClassName="gap-2">
                            <Maps />
                            Lihat di Maps
                        </Button>
                    </Link>
                </div>
            </div>
        </Modal>
    );
};

const List: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => {
    return (
        <div className="flex gap-2">
            <span className="shrink-0 w-60 md:w-40 sm:w-28 xs:w-20">{label}</span>
            <span>:</span>
            <span className="font-bold w-72">{children}</span>
        </div>
    );
};

export default DetailTableModal;
