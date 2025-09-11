import useModal from "@hooks/useModal";
import React from "react";
import { Modal } from "@components/layout";
import { LogStatus } from "@api/survey-demand/respondent";
import { ModalTitle } from "@components/text";
import { Table } from "@components/table";
import dayjs from "dayjs";

export default function ModalLogStatus() {
    const { modal, setModal, data } = useModal<LogStatus[]>("modal-log-status");

    return (
        <Modal visible={modal} className="w-[50%]">
            <ModalTitle onClose={() => setModal(false)}>Log Status Polygon</ModalTitle>
            <div>
            <Table
                    bodyClassName="text-center"
                    className="mt-2"
                    rows={data}
                    columns={[
                        { header: "No", value: (_, index) => index + 1, className: "text-left whitespace-nowrap" },
                        { header: "Status", value: (data) => data.value, className: "text-left whitespace-nowrap" },
                        { header: "Tanggal", value: (data) => dayjs(data.date).format("DD-MM-YYYY HH:mm:ss"), className: "text-left whitespace-nowrap" },
                    ]}
                    notFoundComponent={
                        <div className="py-8 text-center">
                            DATA TIDAK DITEMUKAN
                        </div>
                    }
                />
            </div>
        </Modal>
    );
}
