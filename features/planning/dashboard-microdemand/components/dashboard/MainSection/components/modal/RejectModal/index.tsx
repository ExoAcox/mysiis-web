import { useState } from "react";

import { Respondent, validateRespondent } from "@api/survey-demand/respondent";

import useFetch from "@hooks/useFetch";
import useModal from "@hooks/useModal";

import { InfoModal, WarningModal } from "@features/planning/dashboard-microdemand/components/global";
import { getModalId } from "@features/planning/dashboard-microdemand/functions/dashboard";

import { Button } from "@components/button";
import { TextArea } from "@components/input";
import { RadioButton } from "@components/radio";
import { When } from "react-if";
import { Modal } from "@components/layout";
import { toast } from "react-toastify";


         
         
         
const options = [
    { 
        value: "Rumah tidak sesuai kriteria survey", 
        label: "Rumah tidak sesuai kriteria survey"
    },
    { 
        value: "Evidence survey tidak lengkap/tidak jelas", 
        label: "Evidence survey tidak lengkap/tidak jelas"
    },
    { 
        value: "Non-residential", 
        label: "Non-residential" 
    },
    { 
        value: "Duplikasi Data", 
        label: "Duplikasi Data" 
    },
    { 
        value: "Lainnya", 
        label: "Lainnya" 
    },
]

const ValidateModal: React.FC<{ refresh: () => void; category: string }> = ({ refresh, category }) => {
    const [reason, setReason] = useState("");
    const [option, setOption] = useState("");

    const { data, modal, setModal } = useModal<Respondent>("dashboard-survey-reject");
    const survey = useModal<Respondent>(getModalId(category));

    const submit = useFetch<unknown>(null);
    const loading = submit.status === "pending";

    const closeModal = () => {
        setModal(false);
        setReason("");
        setOption("");
    };
    const buttonClassName = "text-medium py-2 px-7";

    const handleSubmit = () => {
        if (!option){
            toast.error("Pilih alasan invalid survey.");
            return;
        }

        if (option === "Lainnya" && !reason){
            toast.error("Masukkan alasan kenapa menolak survey ini.");
            return;
        }

        submit.fetch(validateRespondent({ surveyId: data.id, status: "invalid", invalid_reason: reason }), {
            onResolve: () => {
                survey.setModal(false);
                closeModal();
                refresh();
            },
        });
    };

    return (
        <>
            <Modal visible={modal}>
                <div>
                    <RadioButton
                        className="py-1.5"
                        label="Pilih Alasan Invalid"
                        value={option}
                        onChange={(value) => {
                            setOption(value);
                            if(value !== "Lainnya") setReason(value);
                        }}
                        options={options}
                    />
                    <When condition={option === "Lainnya"}>
                        <TextArea
                            value={reason}
                            onChange={(value) => setReason(value)}
                            rows={2}
                            className="w-80"
                            placeholder="Masukkan alasan kenapa menolak survey ini."
                        />
                    </When>
                    <div className="flex justify-center gap-2 mt-5">
                        <Button variant="ghost" color="secondary" disabled={loading} onClick={closeModal} className={buttonClassName}>
                            Batal
                        </Button>
                        <Button className={buttonClassName} loading={loading} onClick={handleSubmit}>
                            Tolak
                        </Button>
                    </div>
                </div>
            </Modal>

            <InfoModal visible={submit.status === "resolve"} variant="success" onClose={() => submit.reset()}>
                Berhasil Menolak Survey
            </InfoModal>
            <InfoModal visible={submit.status === "reject"} variant="failed" onClose={() => submit.reset()}>
                Gagal Menolak Survey
            </InfoModal>
        </>
    );
};

export default ValidateModal;
