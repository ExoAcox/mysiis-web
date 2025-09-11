import { useState } from "react";

import { Respondent, validateRespondent } from "@api/survey-demand/respondent";

import useFetch from "@hooks/useFetch";
import useModal from "@hooks/useModal";

import { InfoModal } from "@features/planning/dashboard-microdemand/components/global";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";
import { toast } from "react-toastify";
import { RadioButton } from "@components/radio";

const ValidateModal: React.FC<{ refresh: () => void; user: User; category: string }> = ({ refresh, user, category }): React.ReactElement => {
    const [option, setOption] = useState("");
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const survey = useModal<Respondent>("dashboard-survey-default");
    const { modal, data, setModal } = useModal<Respondent>("dashboard-survey-validate");

    const submit = useFetch<unknown>(null);

    const closeModal = () => {
        survey.setModal(false);
        setModal(false);
        setReason('');
        setError('');
    };

    const handleSubmit = () => {
        if (!option) {
            setError("Pilih opsi");
            return;
        }
        
        submit.fetch(validateRespondent({ surveyId: data.id, status: "valid", valid_reason: option }), {
            onResolve: () => {
                toast.success("Berhasil memverifikasi pre survey");
                closeModal();
                refresh();
            },
        });
    }

    return (
        <>
            <Modal
                className="sm:w-full max-h-[90%] overflow-y-auto"
                visible={modal}
            >
                <ModalTitle onClose={closeModal}>Validasi Pre Survey</ModalTitle>
                <div className="flex flex-col gap-4">
                    <RadioButton
                        className="py-1.5"
                        label="Pilih kelengkapan data pre survey"
                        value={option}
                        onChange={(value) => setOption(value)}
                        options={[
                            { value: "Data komplit", label: "Data komplit" },
                            { value: "Data tidak komplit", label: "Data tidak komplit" },
                            { value: "Data kosong", label: "Data kosong" },
                        ]}
                    />
                    <div className="flex justify-center gap-2 mt-5">
                        <Button 
                            className="text-medium py-2 px-7"
                            variant="ghost" 
                            color="secondary" 
                            disabled={submit.status === "pending"} 
                            onClick={closeModal} 
                        >
                            Batal
                        </Button>
                        <Button 
                            className="text-medium py-2 px-7" 
                            loading={submit.status === "pending"} 
                            onClick={handleSubmit}
                            disabled={submit.status === "pending" || !!error }
                        >
                            Kirim
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
