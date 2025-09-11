import dayjs from "dayjs";

import useModal from "@hooks/useModal";

import { getColor } from "@features/fulfillment/odp-view/functions/speedtest";

import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

interface Speedtest {
    isp: string;
    value: number;
    averageSpeed: number;
}

const SpeedtestModal = () => {
    const { modal, setModal, data } = useModal<{ speedtest: Speedtest[] | null }>("odp-view/speedtest");

    return (
        <Modal visible={modal} className="w-[20rem]">
            <ModalTitle onClose={() => setModal(false)}>Speedtest Ookla</ModalTitle>
            <div className="flex justify-between mt-3 font-bold">
                <span>Total Provider</span>
                <span className="w-[5rem]">Total Test</span>
            </div>
            <div className="flex flex-col">
                {data.speedtest?.map((speedtest) => {
                    return (
                        <div
                            key={speedtest.isp}
                            className="text-secondary-60 py-2.5 border-b border-secondary-30 flex gap-2.5 text-subtitle items-center"
                        >
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(speedtest.isp) }} />
                            <span>{speedtest.isp}</span>
                            <span className="ml-auto w-[5rem]">{speedtest.value}</span>
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-col mt-4 text-center text-secondary-60 text-medium">
                <span>
                    Data yang diambil adalah data <br />
                    selama 1 bulan terakhir
                </span>
                <span>
                    ({dayjs().subtract(1, "month").format("DD-MM-YYYY")} s/d {dayjs().format("DD-MM-YYYY")})
                </span>
            </div>
        </Modal>
    );
};

export default SpeedtestModal;
