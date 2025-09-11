import { useState } from "react";

import { Respondent, validateRespondent, ValidateStatus } from "@api/survey-demand/respondent";

import useFetch from "@hooks/useFetch";
import useModal from "@hooks/useModal";

import { intersection } from "@functions/common";

import { InfoModal, WarningModal } from "@features/planning/dashboard-microdemand/components/global";
import { getModalId } from "@features/planning/dashboard-microdemand/functions/dashboard";

import { Button } from "@components/button";
import { TextArea } from "@components/input";
import { When } from "react-if";
import { RadioButton } from "@components/radio";
import { toast } from "react-toastify";
import { Modal } from "@components/layout";

const ValidateModal: React.FC<{ refresh: () => void; user: User; category: string }> = ({ refresh, user, category }) => {
    const [reason, setReason] = useState("");
    const [prioritas, setPrioritas] = useState("");
    const { data, modal, setModal } = useModal<Respondent>("dashboard-survey-validate");

    const survey = useModal<Respondent>(getModalId(category));

    const submit = useFetch<unknown>(null);
    const loading = submit.status === "pending";

    const closeModal = () => {
        setModal(false);
        setReason("");
        setPrioritas("");
    };
    const buttonClassName = "text-medium py-2 px-7";

    const handleSubmit = () => {
        if(data.sourcename === "telkomakses" && prioritas === "" && ["valid-mitra","invalid"].includes(data.status!)) {
            toast.error("Pilih prioritas demand");
            return;
        };

        const status: ValidateStatus = intersection(["supervisor-survey-mitra", "admin-survey-mitra"], user.role_keys).length ? "valid-mitra" : "valid";
        submit.fetch(validateRespondent({ surveyId: data.id, status: status, prioritas: prioritas, valid_reason: reason }), {
            onResolve: () => {
                survey.setModal(false);
                closeModal();
                refresh();
            },
        });
    };

    return (
        <>
            <Modal
                visible={modal}
                onClose={closeModal}
            >
                <div>
                    <When condition={["valid-mitra","invalid"].includes(data.status!) && data.sourcename === "telkomakses"}>
                        <div className="my-3">
                            <RadioButton
                                className="py-1.5"
                                label="Pilih kategori demand"
                                value={prioritas}
                                onChange={(value) => setPrioritas(value)}
                                options={[
                                    { value: "high", label: "High: >30 Mbps (gambaran ARPU >300k)" },
                                    { value: "medium", label: "Medium: 30 Mbps (gambaran ARPU 201-299k)" },
                                    { value: "low", label: "Low: 10 Mbps (gambaran ARPU 150-200k)" },
                                ]}
                            />
                        </div>
                    </When>
                    <TextArea
                        label="Alasan"
                        value={reason}
                        onChange={(value) => setReason(value)}
                        rows={2}
                        className="w-80"
                        placeholder="Masukkan alasan kenapa menerima survey ini."
                    />
                    <div className="flex justify-center gap-2 mt-5">
                        <Button variant="ghost" color="secondary" disabled={loading} onClick={closeModal} className={buttonClassName}>
                            Batal
                        </Button>
                        <Button className={buttonClassName} loading={loading} onClick={handleSubmit}>
                            Terima
                        </Button>
                    </div>
                </div>
            </Modal>

            <InfoModal visible={submit.status === "resolve"} variant="success" onClose={() => submit.reset()}>
                Berhasil Memverifikasi Survey
            </InfoModal>
            <InfoModal visible={submit.status === "reject"} variant="failed" onClose={() => submit.reset()}>
                Gagal Memverifikasi Survey
            </InfoModal>
        </>
    );
};

export default ValidateModal;
