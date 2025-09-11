import { Ookla } from "@api/speedtest/ookla";

import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

interface Isp {
    label: string;
    list: Ookla[];
}

const OoklaModal = () => {
    const { modal, setModal, data } = useModal<Isp>("ookla-modal");

    return (
        <Modal visible={modal} className="w-fit" centered>
            <ModalTitle onClose={() => setModal(false)} className="p-2">
                {`Detail Informasi ${data.label} (${data.list?.length})`}
            </ModalTitle>
            <div className="flex flex-col items-center justify-start gap-4 mt-4 w-full max-h-[70vh] z-10 overflow-auto scrollbar-hidden p-2">
                {data.list?.map((speedtest, index) => {
                    if (index > 98) return;
                    return (
                        <div className="p-4 rounded shadow" key={`${index.toString()}`}>
                            <List label="ISP">{speedtest.isp_name || "-"}</List>
                            <List label="Operator">{speedtest.network_operator_name || "-"}</List>
                            <List label="Device Source">{speedtest.source || "-"}</List>
                            <List label="Device Brand">{speedtest.brand || "-"}</List>
                            <List label="Latency">{speedtest.latency || "-"}</List>
                            <List label="Download">{(Number(speedtest.download_kbps) / 1000).toFixed(2) || "-"} mbps</List>
                            <List label="Upload">{(Number(speedtest.upload_kbps) / 1000).toFixed(2) || "-"} mbps</List>
                            <List label="Latitude">{speedtest.client_latitude || "-"}</List>
                            <List label="Longitude">{speedtest.client_longitude || "-"}</List>
                            <List label="Timestamp">{speedtest.ds || "-"}</List>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
};

const List: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => {
    return (
        <div className="flex gap-2 text-sm text-black-100">
            <span className="w-32">{label}</span>
            <span className="font-bold w-fit">:</span>
            <span className="w-32 font-bold">{children}</span>
        </div>
    );
};

export default OoklaModal;
