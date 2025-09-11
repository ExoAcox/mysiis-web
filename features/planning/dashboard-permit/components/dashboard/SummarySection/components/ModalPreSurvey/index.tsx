import useModal from "@hooks/useModal";
import React, { useEffect, useState } from "react";
import { Modal } from "@components/layout";
import { getPreSurveyByPolygon, ResponsesPerSurvey } from "@api/survey-demand/respondent";
import { ModalTitle } from "@components/text";
import { Table } from "@components/table";

export default function ModalPreSurvey() {
    const { modal, setModal, data } = useModal("modal-pre-survey");
    const [responses, setResponses] = useState<ResponsesPerSurvey[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            if (modal) {
                try {
                    const result = await getPreSurveyByPolygon({ polygon_id: data as number });
                    setResponses(result[0].responses);
                } catch (error) {
                    console.error(error);
                }
            }
        };
    
        fetchData();
    }, [modal]);
    
    return (
        <Modal visible={modal} className="w-[50%]">
            <ModalTitle onClose={() => setModal(false)}>Pre Survey</ModalTitle>
            <div>
            <Table
                    bodyClassName="text-center"
                    className="mt-2"
                    rows={responses}
                    columns={[
                        { header: "No", value: (_, index) => index + 1, className: "text-left whitespace-nowrap" },
                        { header: "Pertanyaan", value: (data) => data.question_text, className: "text-left" },
                        { header: "Jawaban", value: (data) => data.value ?? "-", className: "text-left" },
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
