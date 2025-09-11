import { useState } from "react";

import { Respondent, validateRespondent } from "@api/survey-demand/respondent";

import useFetch from "@hooks/useFetch";
import useModal from "@hooks/useModal";

import { InfoModal } from "@features/planning/dashboard-microdemand/components/global";
import { getModalId } from "@features/planning/dashboard-microdemand/functions/dashboard";

import { Button } from "@components/button";
import { TextArea } from "@components/input";
import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";
import { updateStatusPermit } from "@api/survey-demand/mysiista";

const ValidateModal: React.FC<{ refresh: () => void; category: string }> = ({ refresh, category }) => {
    const [reason, setReason] = useState("");

    const { data, modal, setModal } = useModal<Respondent>("dashboard-survey-reject");
    const survey = useModal<Respondent>(getModalId(category));

    const submit = useFetch<unknown>(null);
    const loading = submit.status === "pending";

    const closeModal = () => setModal(false);
    const buttonClassName = "text-medium py-2 px-7";

    const handleSubmit = () => {
        // if (data.mysista_data?.dokumen_bakp) {
        //     submit.fetch(validateRespondent({ surveyId: data.id, status: "valid", invalid_reason: reason }), {
        //         onResolve: () => {
        //             survey.setModal(false);
        //             closeModal();
        //             refresh();
        //         },
        //     });
            
        //     return;
        // }
        
        submit.fetch(updateStatusPermit({ status_permits: "rejected", mysistaid: data.mysista_data?.objectid!, reason_permits: reason }), {
            onResolve: () => {
                submit.fetch(validateRespondent({ surveyId: data.id, status: "valid", invalid_reason: reason }), {
                    onResolve: () => {
                        survey.setModal(false);
                        closeModal();
                        refresh();
                    },
                });
            }
        });
    };

    return (
        <>
            <Modal
                className="sm:w-full max-h-[90%] overflow-y-auto"
                visible={modal}
            >
                <ModalTitle onClose={closeModal}>Validasi Izin Tidak Disetujui</ModalTitle>
                <div>
                    <TextArea
                        value={reason}
                        onChange={(value) => setReason(value)}
                        rows={2}
                        className="w-80"
                        placeholder="Masukkan info tambahan izin ditolak."
                    />
                    <div className="flex justify-center gap-2 mt-5">
                        <Button variant="ghost" color="secondary" disabled={loading} onClick={closeModal} className={buttonClassName}>
                            Batal
                        </Button>
                        <Button className={buttonClassName} loading={loading} disabled={!reason} onClick={handleSubmit}>
                            Kirim
                        </Button>
                    </div>
                </div>
            </Modal>

            <InfoModal visible={submit.status === "resolve"} variant="success" onClose={() => submit.reset()}>
                Berhasil merubah status menjadi Tidak Disetujui
            </InfoModal>
            <InfoModal visible={submit.status === "reject"} variant="failed" onClose={() => submit.reset()}>
                Gagal merubah status menjadi Tidak Disetujui
            </InfoModal>
        </>
    );
};

export default ValidateModal;
